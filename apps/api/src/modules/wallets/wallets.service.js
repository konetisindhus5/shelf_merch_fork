import { Wallet } from './wallet.model.js';
import { WalletTransaction } from './walletTransaction.model.js';
import { Entity } from '../entities/entity.model.js';
import * as ledger from '../../services/ledger.service.js';
import { transitionState, transitionThrough, validNextStatuses } from '../../services/stateMachine.service.js';
import { ApiError, NotFoundError } from '../../utils/errors.js';
import { getPagination, paginatedResponse } from '../../utils/pagination.js';

function withMeta(wallet) {
  const obj = wallet.toObject ? wallet.toObject() : wallet;
  return {
    ...obj,
    unallocatedAmount: obj.balance - obj.allocatedAmount,
    validNextStatuses: validNextStatuses('wallet', obj.status),
  };
}

export async function listWallets({ tenantId }) {
  const wallets = await Wallet.find({ tenantId }).sort({ createdAt: -1 });
  return wallets.map(withMeta);
}

export async function getWallet({ tenantId, walletId }) {
  const wallet = await Wallet.findOne({ _id: walletId, tenantId });
  if (!wallet) throw new NotFoundError('Wallet not found');
  return wallet;
}

export async function createWallet({ tenantId, userId, data }) {
  const wallet = await Wallet.create({
    tenantId,
    ownerUserId: userId,
    name: data.name,
    currency: data.currency,
    validFrom: data.validFrom,
    validTo: data.validTo,
    fundingMethod: data.fundingMethod,
    fundingDocument: data.fundingDocument ?? {},
  });
  return withMeta(wallet);
}

export async function updateWallet({ tenantId, walletId, patch }) {
  const wallet = await getWallet({ tenantId, walletId });
  const before = wallet.toObject();
  // Status is never patchable — state machine only (§3.4).
  const { status: _ignored, ...rest } = patch;
  Object.assign(wallet, rest);
  await wallet.save();
  return { before, wallet: withMeta(wallet) };
}

/**
 * §7.4 /fund — manual PO funding marks the document pending approval; the
 * cash still enters the ledger so the wizard can proceed in MVP. Online
 * (Razorpay) funding arrives with Phase 7's webhook.
 */
export async function fundWallet({ tenantId, walletId, userId, amount, description }) {
  const wallet = await getWallet({ tenantId, walletId });

  const txn = await ledger.createTransaction({
    tenantId,
    walletId,
    type: 'fund_in',
    amount,
    description: description || `Wallet funded (${wallet.fundingMethod})`,
    performedBy: userId,
  });

  if (wallet.fundingMethod === 'po_upload') {
    wallet.fundingDocument.approvalStatus = 'pending';
  }
  if (wallet.status === 'draft') {
    transitionState('wallet', wallet, 'wallet_created', { userId });
  }
  await wallet.save();

  return { transaction: txn, wallet: withMeta(await getWallet({ tenantId, walletId })) };
}

export async function allocate({ tenantId, walletId, userId, allocations }) {
  const wallet = await getWallet({ tenantId, walletId });

  const total = allocations.reduce((sum, a) => sum + a.amount, 0);
  if (total > wallet.balance - wallet.allocatedAmount) {
    throw new ApiError(
      422,
      `Allocations (₹${total}) exceed unallocated balance (₹${wallet.balance - wallet.allocatedAmount})`,
      'ALLOCATION_EXCEEDS_BALANCE',
    );
  }

  const txns = await ledger.allocateToEntities({ tenantId, walletId, allocations, performedBy: userId });

  const fresh = await getWallet({ tenantId, walletId });
  if (fresh.status === 'entities_added') {
    transitionState('wallet', fresh, 'budget_allocated', { userId });
    await fresh.save();
  }

  return { transactions: txns, wallet: withMeta(fresh) };
}

export async function transfer({ tenantId, walletId, toWalletId, amount, userId }) {
  await getWallet({ tenantId, walletId });
  await getWallet({ tenantId, walletId: toWalletId }); // both must belong to this tenant
  const result = await ledger.transferBetweenWallets({
    tenantId,
    fromWalletId: walletId,
    toWalletId,
    amount,
    performedBy: userId,
  });
  return { ...result, wallet: withMeta(await getWallet({ tenantId, walletId })) };
}

export async function listTransactions({ tenantId, walletId, query }) {
  await getWallet({ tenantId, walletId });
  const { page, limit, skip } = getPagination(query);
  const filter = { tenantId, walletId, ...(query.type ? { type: query.type } : {}) };
  const [items, total] = await Promise.all([
    WalletTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    WalletTransaction.countDocuments(filter),
  ]);
  return paginatedResponse(items, total, { page, limit });
}

/** §7.4 /activate — only allowed once every setup step is complete. */
export async function activate({ tenantId, walletId, userId }) {
  const wallet = await getWallet({ tenantId, walletId });

  const entities = await Entity.find({ tenantId, walletId });
  const problems = [];
  if (wallet.balance <= 0) problems.push('Wallet has no funds');
  if (entities.length === 0) problems.push('No entities/departments added');
  if (wallet.allocatedAmount <= 0) problems.push('No budget allocated to entities');
  const unmanaged = entities.filter((e) => !e.managerUserId);
  if (unmanaged.length) {
    problems.push(`Entities without a manager: ${unmanaged.map((e) => e.name).join(', ')}`);
  }
  if (problems.length) {
    throw new ApiError(422, 'Wallet setup incomplete', 'WALLET_SETUP_INCOMPLETE', problems);
  }

  transitionThrough('wallet', wallet, 'active', { userId });
  await wallet.save();
  return withMeta(wallet);
}
