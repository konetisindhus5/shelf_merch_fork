import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './auth.controller.js';
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';

const router = Router();

router.post('/login', validate({ body: loginSchema }), asyncHandler(controller.login));
router.post('/refresh', validate({ body: refreshSchema }), asyncHandler(controller.refresh));
router.post('/logout', validate({ body: logoutSchema }), asyncHandler(controller.logout));
router.post('/forgot-password', validate({ body: forgotPasswordSchema }), asyncHandler(controller.forgotPassword));
router.post('/reset-password', validate({ body: resetPasswordSchema }), asyncHandler(controller.resetPassword));

export default router;
