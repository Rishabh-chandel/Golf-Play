import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Webhooks require raw body parser, which should be applied in app.js
// Thus, this route does not use the standard verifyToken or body validators
router.post('/stripe', handleStripeWebhook);

export default router;
