import express from 'express';
import { body } from 'express-validator';
import { getCharities, getCharityBySlug, getFeaturedCharity, selectCharity, updateContributionPercent } from '../controllers/charity.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCharities);
router.get('/featured', getFeaturedCharity);
router.get('/:slug', getCharityBySlug);

// Protected routes
router.use(verifyToken);
router.post('/select', [
  body('charityId').notEmpty().withMessage('Charity ID is required')
], selectCharity);

router.put('/percent', [
  body('percent').isInt({ min: 10, max: 100 }).withMessage('Percent between 10 and 100')
], updateContributionPercent);

export default router;
