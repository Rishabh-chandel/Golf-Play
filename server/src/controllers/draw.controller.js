import Draw from '../models/Draw.js';
import Winner from '../models/Winner.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getCurrentDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findOne({ status: { $in: ['scheduled', 'published'] } }).sort({ drawDate: -1 });
    res.status(200).json(successResponse(draw));
  } catch (error) {
    next(error);
  }
};

export const getDrawResults = async (req, res, next) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ drawDate: -1 }).limit(12).lean();
    
    // Attach winners to each draw
    for (let draw of draws) {
      const winners = await Winner.find({ draw: draw._id })
        .populate('user', 'firstName lastName club name handicap')
        .lean();
        
      // Map to frontend expected format
      draw.winners = winners.map(w => ({
        user: {
           name: w.user?.name || `${w.user?.firstName || 'Unknown'} ${w.user?.lastName || ''}`.trim(),
           club: w.user?.club || 'Independent'
        },
        prizeTier: `Tier ${w.matchTier}`,
        score: {
           handicapIndexUsed: w.user?.handicap || 'N/A'
        }
      }));
    }

    res.status(200).json(successResponse(draws));
  } catch (error) {
    next(error);
  }
};

export const getMyDrawResults = async (req, res, next) => {
  try {
    const userWins = await Winner.find({ user: req.user._id })
      .populate('draw')
      .sort({ createdAt: -1 });
      
    res.status(200).json(successResponse(userWins));
  } catch (error) {
    next(error);
  }
};
