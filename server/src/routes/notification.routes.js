import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import { getMyNotifications, markNotificationRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.use(verifyToken);
router.get('/my', getMyNotifications);
router.put('/:id/read', markNotificationRead);

export default router;