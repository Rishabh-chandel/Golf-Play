import express from 'express';
import { body } from 'express-validator';
import { getMyScores, addScore, editScore } from '../controllers/score.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/my', getMyScores);

router.post('/add', [
  body('value').isInt({ min: 1, max: 45 }).withMessage('Score must be between 1 and 45'),
  body('datePlayed').isISO8601().withMessage('Valid date is required')
], addScore);

router.put('/edit/:scoreIndex', [
  body('value').isInt({ min: 1, max: 45 }).withMessage('Score must be between 1 and 45'),
  body('datePlayed').isISO8601().withMessage('Valid date is required')
], editScore);

export default router;
