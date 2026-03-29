import Charity from '../models/Charity.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getCharities = async (req, res, next) => {
  try {
    const chars = await Charity.find({ isActive: true }).sort({ isFeatured: -1, name: 1 });
    res.status(200).json(successResponse(chars));
  } catch (error) {
    next(error);
  }
};

export const getCharityBySlug = async (req, res, next) => {
  try {
    const char = await Charity.findOne({ slug: req.params.slug, isActive: true });
    if (!char) {
      return res.status(404).json(errorResponse('Charity not found', 404));
    }
    res.status(200).json(successResponse(char));
  } catch (error) {
    next(error);
  }
};

export const getFeaturedCharity = async (req, res, next) => {
  try {
    const char = await Charity.findOne({ isFeatured: true, isActive: true });
    res.status(200).json(successResponse(char));
  } catch (error) {
    next(error);
  }
};

export const selectCharity = async (req, res, next) => {
  try {
    const { charityId } = req.body;
    
    const char = await Charity.findById(charityId);
    if (!char || !char.isActive) {
      return res.status(404).json(errorResponse('Charity not found or inactive', 404));
    }
    
    const user = await User.findById(req.user._id);
    
    // Manage subscriber counts
    if (user.selectedCharity) {
        await Charity.findByIdAndUpdate(user.selectedCharity, { $inc: { subscriberCount: -1 } });
    }
    
    user.selectedCharity = charityId;
    await user.save();
    
    await Charity.findByIdAndUpdate(charityId, { $inc: { subscriberCount: 1 } });
    
    res.status(200).json(successResponse(null, 'Charity selected successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateContributionPercent = async (req, res, next) => {
    try {
        const { percent } = req.body;
        if (percent < 10 || percent > 100) {
            return res.status(400).json(errorResponse('Percent must be between 10 and 100', 400));
        }

        const user = await User.findByIdAndUpdate(req.user._id, { charityContributionPercent: percent }, { new: true });
        res.status(200).json(successResponse({ percent: user.charityContributionPercent }, 'Contribution percentage updated'));
    } catch (error) {
        next(error);
    }
};
