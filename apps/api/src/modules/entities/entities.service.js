import { Entity } from './entity.model.js';
import { Wallet } from '../wallets/wallet.model.js';
import { inviteUser } from '../users/users.service.js';
import { RoleAssignment } from '../roles/roleAssignment.model.js';
import { transitionState } from '../../services/stateMachine.service.js';
import { ApiError, NotFoundError } from '../../utils/errors.js';

export async function listEntities({ tenantId, user, walletId }) {
  const filter = { tenantId, ...(walletId ? { walletId } : {}) };
  // ABAC: entity managers only see their assigned entities.
  if (user.scopeType === 'entity') {
    filter._id = { $in: user.assignedEntityIds };
  }
  return Entity.find(filter).sort({ createdAt: 1 });
}

export async function getEntity({ tenantId, entityId }) {
  const entity = await Entity.findOne({ _id: entityId, tenantId });
  if (!entity) throw new NotFoundError('Entity not found');
  return entity;
}

export async function createEntity({ tenantId, data, userId }) {
  const wallet = await Wallet.findOne({ _id: data.walletId, tenantId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  const entity = await Entity.create({
    tenantId,
    walletId: wallet._id,
    name: data.name,
    description: data.description,
    colorHex: data.colorHex,
    expectedUsers: data.expectedUsers,
  });

  // First entity advances the wallet setup wizard.
  if (wallet.status === 'wallet_created') {
    transitionState('wallet', wallet, 'entities_added', { userId });
    await wallet.save();
  }
  return entity;
}

export async function updateEntity({ tenantId, entityId, patch }) {
  const entity = await getEntity({ tenantId, entityId });
  const before = entity.toObject();
  // allocatedAmount/spentAmount are ledger-derived — never patchable.
  const { allocatedAmount, spentAmount, ...rest } = patch;
  Object.assign(entity, rest);
  await entity.save();
  return { before, entity };
}

export async function deleteEntity({ tenantId, entityId }) {
  const entity = await getEntity({ tenantId, entityId });
  // §7.5 — soft delete only when no live budget is at stake.
  if (entity.allocatedAmount - entity.spentAmount > 0) {
    throw new ApiError(
      422,
      'Entity still has unspent allocated budget — deallocate it before deleting',
      'ENTITY_HAS_BUDGET',
    );
  }
  // Campaign check joins here in Phase 4 (no active campaigns).
  await entity.softDelete();
  return entity;
}

/** §7.5 /assign-manager — invite (or reuse) a user and bind them to the entity. */
export async function assignManager({ tenantId, entityId, data, userId }) {
  const entity = await getEntity({ tenantId, entityId });

  const { user, inviteToken } = await inviteUser({
    tenantId,
    name: data.name,
    email: data.email,
    phone: data.mobile ?? '',
    role: 'entity_manager',
    scopeType: 'entity',
    scopeId: entity._id,
    assignedEntityIds: [entity._id],
  });

  entity.managerUserId = user._id;
  entity.managerInvitePending = user.status === 'invited';
  await entity.save();

  // Wizard advance: all entities of the wallet managed → managers_assigned.
  const wallet = await Wallet.findOne({ _id: entity.walletId, tenantId });
  if (wallet?.status === 'budget_allocated') {
    const unmanaged = await Entity.countDocuments({
      tenantId,
      walletId: wallet._id,
      managerUserId: null,
    });
    if (unmanaged === 0) {
      transitionState('wallet', wallet, 'managers_assigned', { userId });
      await wallet.save();
    }
  }

  return { entity, manager: user, inviteToken };
}

export async function entityRoleAssignment({ tenantId, entityId }) {
  return RoleAssignment.findOne({ tenantId, scopeType: 'entity', scopeId: entityId });
}
