import express from 'express';
import { body } from 'express-validator';
import { createCheckout, cancelSubscription, getStatus, createPortalSession } from '../controllers/subscription.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/create-checkout', [
  body('plan').isIn(['monthly', 'yearly']).withMessage('Plan must be monthly or yearly')
], createCheckout);

router.post('/cancel', cancelSubscription);
router.get('/status', getStatus);
router.get('/portal', createPortalSession);

export default router;
