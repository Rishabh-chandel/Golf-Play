import express from 'express';
import { getCurrentDraw, getDrawResults, getMyDrawResults } from '../controllers/draw.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/current', getCurrentDraw);
router.get('/results', getDrawResults);

router.use(verifyToken);
router.get('/my-results', getMyDrawResults);

export default router;
