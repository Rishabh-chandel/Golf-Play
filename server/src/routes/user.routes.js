import express from 'express';
import { getMe, getReferralOverview, updateMe, deleteMe } from '../controllers/user.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/me', getMe);
router.get('/me/referrals', getReferralOverview);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

export default router;
