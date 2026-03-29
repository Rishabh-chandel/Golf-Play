import { errorResponse } from '../utils/apiResponse.js';
import Subscription from '../models/Subscription.js';

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (!sub) {
      return res.status(403).json({
        success: false,
        error: 'Active subscription required',
        requiresSubscription: true
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
