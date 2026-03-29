import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import requireAdmin from '../middleware/admin.middleware.js';
import { getStats, getUsers, getAuditLogs, createCharity } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/audit-logs', getAuditLogs);
router.post('/charities', createCharity);

export default router;
