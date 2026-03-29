import express from 'express';
import { getMyWinnings, uploadProof } from '../controllers/winner.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/my', getMyWinnings);
router.post('/:id/upload-proof', upload.single('proof'), uploadProof);

export default router;
