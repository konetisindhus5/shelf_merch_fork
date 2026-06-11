import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { objectId } from '../users/users.validation.js';
import { CatalogProduct } from './catalogProduct.model.js';
import { NotFoundError } from '../../utils/errors.js';
import { getPagination, paginatedResponse } from '../../utils/pagination.js';

const router = Router();

// Platform-wide catalog: any authenticated user can browse (§7.6).
router.use(authenticate);

const listQuery = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

router.get(
  '/products',
  validate({ query: listQuery }),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query, { defaultLimit: 50 });
    const filter = {
      status: 'active',
      ...(req.query.category ? { category: req.query.category } : {}),
      ...(req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {}),
    };
    const [items, total] = await Promise.all([
      CatalogProduct.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      CatalogProduct.countDocuments(filter),
    ]);
    res.json(paginatedResponse(items, total, { page, limit }));
  }),
);

router.get(
  '/products/:id',
  validate({ params: z.object({ id: objectId }) }),
  asyncHandler(async (req, res) => {
    const product = await CatalogProduct.findById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  }),
);

export default router;
