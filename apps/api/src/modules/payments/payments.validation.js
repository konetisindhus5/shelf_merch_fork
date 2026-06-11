import { z } from 'zod';
import { objectId } from '../users/users.validation.js';

export const createRazorpayOrderSchema = z.object({
  walletId: objectId,
  amount: z.number().positive(),
});
