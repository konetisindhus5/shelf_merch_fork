import { InvalidTransitionError } from '../utils/errors.js';

/**
 * §3.4 — central state machine. Direct `.status = x` assignment anywhere else
 * in the codebase is forbidden; every status change flows through
 * transitionState().
 */
const TRANSITIONS = {
  order: {
    created: ['approved', 'issue_raised'],
    approved: ['mockup_pending', 'issue_raised'],
    mockup_pending: ['mockup_approved', 'issue_raised'],
    mockup_approved: ['in_production', 'issue_raised'],
    in_production: ['qc_pending', 'issue_raised'],
    qc_pending: ['packed', 'issue_raised'],
    packed: ['shipped', 'issue_raised'],
    shipped: ['delivered', 'issue_raised'],
    delivered: ['issue_raised'],
    issue_raised: ['replacement_processing'],
    replacement_processing: [],
  },
  campaign: {
    draft: ['recipients_uploaded'],
    recipients_uploaded: ['credits_allocated'],
    credits_allocated: ['approved'],
    approved: ['launched'],
    launched: ['redemption_open'],
    redemption_open: ['redemption_closed'],
    redemption_closed: ['fulfilled'],
    fulfilled: [],
  },
  wallet: {
    draft: ['wallet_created'],
    wallet_created: ['entities_added'],
    entities_added: ['budget_allocated'],
    budget_allocated: ['managers_assigned'],
    managers_assigned: ['review_pending'],
    review_pending: ['active'],
    active: [],
  },
  redemption: {
    invited: ['opened', 'expired'],
    opened: ['verified', 'expired'],
    verified: ['redeemed', 'expired'],
    redeemed: ['order_created'],
    order_created: [],
    expired: [],
  },
};

export function validNextStatuses(entityType, currentStatus) {
  const machine = TRANSITIONS[entityType];
  if (!machine) throw new Error(`Unknown state machine: "${entityType}"`);
  return machine[currentStatus] ?? [];
}

export function canTransition(entityType, fromStatus, toStatus) {
  return validNextStatuses(entityType, fromStatus).includes(toStatus);
}

/**
 * Mutates `entity.status` (does NOT save — caller persists, usually within a
 * session) and returns the entity. Throws InvalidTransitionError on illegal
 * moves. `actor` is recorded on statusHistory when the schema has one.
 */
export function transitionState(entityType, entity, toStatus, actor = null, note = '') {
  const fromStatus = entity.status;
  if (!canTransition(entityType, fromStatus, toStatus)) {
    throw new InvalidTransitionError(entityType, fromStatus, toStatus);
  }
  entity.status = toStatus;
  if (Array.isArray(entity.statusHistory)) {
    entity.statusHistory.push({
      status: toStatus,
      at: new Date(),
      actorUserId: actor?.userId ?? null,
      note,
    });
  }
  return entity;
}

/**
 * Convenience for wizard-style machines (wallet setup): walks the chain from
 * the current status to `toStatus` through intermediate states, validating
 * each hop. E.g. managers_assigned -> active passes through review_pending.
 */
export function transitionThrough(entityType, entity, toStatus, actor = null) {
  const visited = new Set([entity.status]);
  while (entity.status !== toStatus) {
    const next = validNextStatuses(entityType, entity.status);
    if (next.length !== 1 && !next.includes(toStatus)) {
      throw new InvalidTransitionError(entityType, entity.status, toStatus);
    }
    const hop = next.includes(toStatus) ? toStatus : next[0];
    if (visited.has(hop)) {
      throw new InvalidTransitionError(entityType, entity.status, toStatus);
    }
    visited.add(hop);
    transitionState(entityType, entity, hop, actor);
  }
  return entity;
}
