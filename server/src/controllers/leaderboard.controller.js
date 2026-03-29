import Score from '../models/Score.js';
import User from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Return a simple monthly leaderboard based on score average.
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const scoreDocs = await Score.find().populate('user', 'firstName lastName email avatar role selectedCharity');

    const leaderboard = scoreDocs
      .map((doc) => {
        const values = doc.scores.map((score) => score.value);
        const averageScore = values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
        const bestScore = values.length ? Math.min(...values) : 0;

        return {
          userId: doc.user?._id,
          name: doc.user?.firstName && doc.user?.lastName ? `${doc.user.firstName} ${doc.user.lastName}` : 'Anonymous Player',
          averageScore: Number(averageScore.toFixed(1)),
          bestScore,
          totalRounds: values.length,
          avatar: doc.user?.avatar || null,
          role: doc.user?.role,
          selectedCharity: doc.user?.selectedCharity || null,
        };
      })
      .sort((left, right) => left.averageScore - right.averageScore)
      .slice(0, 20)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    res.status(200).json(successResponse(leaderboard));
  } catch (error) {
    next(error);
  }
};