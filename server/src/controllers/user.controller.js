import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import { logAudit } from '../utils/audit.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('subscription selectedCharity referredBy');
    res.status(200).json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const getReferralOverview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('referredBy');
    const referredUsers = await User.find({ referredBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('firstName lastName email createdAt referralCode');

    const referralLink = `${process.env.CLIENT_URL || ''}/register${user?.referralCode ? `?referralCode=${encodeURIComponent(user.referralCode)}` : ''}`;

    res.status(200).json(successResponse({
      referralCode: user?.referralCode,
      referralLink,
      referredBy: user?.referredBy,
      referredUsers,
      referredUsersCount: referredUsers.length,
    }));
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, country, handicap, club, name, selectedCharity } = req.body;
    
    // Build update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;
    if (handicap !== undefined) updateData.handicap = handicap;
    if (club !== undefined) updateData.club = club;
    if (selectedCharity) updateData.selectedCharity = selectedCharity;
    
    // Handle split name if provided from frontend 'name' field
    if (name) {
      const parts = name.split(' ');
      updateData.firstName = parts[0] || '';
      updateData.lastName = parts.slice(1).join(' ') || '';
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subscription selectedCharity');

    await logAudit({
      actor: req.user._id,
      action: 'profile_update',
      entityType: 'User',
      entityId: req.user._id,
      description: 'Updated profile settings',
      metadata: updateData,
      req
    });
    
    res.status(200).json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    await logAudit({
      actor: req.user._id,
      action: 'account_deactivate',
      entityType: 'User',
      entityId: req.user._id,
      description: 'Deactivated own account',
      req
    });
    res.status(200).json(successResponse(null, 'User deactivated successfully'));
  } catch (error) {
    next(error);
  }
};
