import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { objectId } from '../users/users.validation.js';
import { Notification } from './notification.model.js';
import { getPagination, paginatedResponse } from '../../utils/pagination.js';
import { NotFoundError } from '../../utils/errors.js';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  validate({
    query: z.object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
      unread: z.coerce.boolean().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { userId: req.user.userId, ...(req.query.unread ? { read: false } : {}) };
    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);
    res.json(paginatedResponse(items, total, { page, limit }));
  }),
);

router.patch(
  '/mark-all-read',
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user.userId, read: false }, { read: true });
    res.json({ success: true });
  }),
);

router.patch(
  '/:id/read',
  validate({ params: z.object({ id: objectId }) }),
  asyncHandler(async (req, res) => {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true },
    );
    if (!n) throw new NotFoundError('Notification not found');
    res.json(n);
  }),
);

export default router;
