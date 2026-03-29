import { errorResponse } from '../utils/apiResponse.js';

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json(errorResponse('Admin access required', 403));
  }
};

export default requireAdmin;
