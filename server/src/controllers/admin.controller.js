import User from '../models/User.js';
import Charity from '../models/Charity.js';
import Subscription from '../models/Subscription.js';
import AuditLog from '../models/AuditLog.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logAudit } from '../utils/audit.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await Subscription.countDocuments({ status: 'active' });
    const totalCharities = await Charity.countDocuments();
    const referredSignups = await User.countDocuments({ referredBy: { $ne: null } });
    const revenueAggregate = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyRevenue = revenueAggregate[0]?.total || 0;
    const recentAuditLogs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('actor', 'firstName lastName email role');
    
    res.status(200).json(successResponse({
      totalUsers,
      activeSubscribers,
      totalCharities,
      monthlyRevenue,
      referredSignups,
      recentAuditLogs
    }));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('subscription referredBy selectedCharity').sort({ createdAt: -1 });
    res.status(200).json(successResponse(users));
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 25);
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actor', 'firstName lastName email role referralCode');

    res.status(200).json(successResponse(logs));
  } catch (error) {
    next(error);
  }
};

export const createCharity = async (req, res, next) => {
    try {
      const char = await Charity.create(req.body);
      await logAudit({
        actor: req.user._id,
        action: 'create_charity',
        entityType: 'Charity',
        entityId: char._id,
        description: `Created charity ${char.name}`,
        metadata: { slug: char.slug },
        req
      });
      res.status(201).json(successResponse(char, 'Charity created'));
    } catch (error) {
      next(error);
    }
};

// More admin routes will go here
