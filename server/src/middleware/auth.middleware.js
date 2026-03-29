import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const verifyToken = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json(errorResponse('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('subscription selectedCharity');
    
    if (!user) {
      return res.status(401).json(errorResponse('User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token expired', 401));
    }
    return res.status(401).json(errorResponse('Not authorized to access this route', 401));
  }
};

export default verifyToken;
