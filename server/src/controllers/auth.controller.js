import User from '../models/User.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import crypto from 'crypto';
import { logAudit } from '../utils/audit.js';

const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
  });
};

const generateReferralCode = (firstName, lastName) => {
  const seed = `${firstName || 'USER'}${lastName || ''}`.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${seed.slice(0, 6) || 'GOLF'}-${suffix}`;
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, country, role, referralCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(errorResponse('User already exists', 400));
    }

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
      if (!referrer) {
        return res.status(400).json(errorResponse('Invalid referral code', 400));
      }
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      country,
      role: role || 'subscriber',
      referralCode: generateReferralCode(firstName, lastName),
      referredBy: referrer?._id,
      // In production, isEmailVerified false until token processed
      isEmailVerified: true 
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    if (referrer) {
      await Notification.create({
        user: referrer._id,
        type: 'system',
        title: 'Referral joined',
        message: `${user.firstName} ${user.lastName} joined using your referral code.`,
        link: '/dashboard/settings'
      });
    }

    await logAudit({
      actor: user._id,
      action: 'register',
      entityType: 'User',
      entityId: user._id,
      description: `Created account for ${user.email}`,
      metadata: { referralCode: referrer?.referralCode || null },
      req
    });
    
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    user.passwordHash = undefined;
    user.refreshToken = undefined;
    
    res.status(201).json(successResponse({ user, accessToken }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email }).select('+passwordHash +refreshToken');
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }

    if (role && user.role !== role) {
      return res.status(403).json(errorResponse(`Please select the ${user.role === 'admin' ? 'Admin' : 'Player'} login option`, 403));
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }
    
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    await logAudit({
      actor: user._id,
      action: 'login',
      entityType: 'AuthSession',
      entityId: user._id,
      description: `User signed in: ${user.email}`,
      req
    });
    
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    user.passwordHash = undefined;
    user.refreshToken = undefined;
    
    res.status(200).json(successResponse({ user, accessToken }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    let actorId = null;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
      actorId = decoded.id;
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }

    if (actorId) {
      await logAudit({
        actor: actorId,
        action: 'logout',
        entityType: 'AuthSession',
        entityId: actorId,
        description: 'User signed out',
        req
      });
    }
    
    res.cookie('jwt', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    res.status(200).json(successResponse(null, 'User logged out'));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json(errorResponse('Not authorized', 401));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== token) {
      return res.status(401).json(errorResponse('Invalid token', 401));
    }
    
    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json(successResponse({ accessToken: newAccessToken }));
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Invalid refresh token', 401));
    }
    next(error);
  }
};
