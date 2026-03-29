import Score from '../models/Score.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logAudit } from '../utils/audit.js';

export const getMyScores = async (req, res, next) => {
  try {
    const scoreDoc = await Score.findOne({ user: req.user._id });
    
    // Return scores in reverse chronological order
    const scores = scoreDoc ? scoreDoc.scores.sort((a, b) => b.enteredAt - a.enteredAt) : [];
    
    res.status(200).json(successResponse(scores));
  } catch (error) {
    next(error);
  }
};

export const addScore = async (req, res, next) => {
  try {
    const { value, datePlayed, clubId, courseRating, slopeRating, handicapIndexUsed } = req.body;
    
    if (value < 1 || value > 45) {
      return res.status(400).json(errorResponse('Score must be between 1 and 45', 400));
    }
    
    if (new Date(datePlayed) > new Date()) {
      return res.status(400).json(errorResponse('Date played cannot be in the future', 400));
    }

    let scoreDoc = await Score.findOne({ user: req.user._id });
    
    if (!scoreDoc) {
      scoreDoc = new Score({ user: req.user._id, scores: [] });
    }

    const numericCourseRating = courseRating !== undefined && courseRating !== '' ? Number(courseRating) : undefined;
    const numericSlopeRating = slopeRating !== undefined && slopeRating !== '' ? Number(slopeRating) : undefined;
    const numericHandicapIndexUsed = handicapIndexUsed !== undefined && handicapIndexUsed !== '' ? Number(handicapIndexUsed) : undefined;
    const scoreDifferential = numericCourseRating && numericSlopeRating
      ? Number((((Number(value) - numericCourseRating) * 113) / numericSlopeRating).toFixed(1))
      : undefined;
    
    scoreDoc.scores.push({
      value: Number(value),
      datePlayed,
      clubId,
      courseRating: numericCourseRating,
      slopeRating: numericSlopeRating,
      handicapIndexUsed: numericHandicapIndexUsed,
      scoreDifferential,
      enteredAt: Date.now()
    });
    
    await scoreDoc.save();

    await logAudit({
      actor: req.user._id,
      action: 'score_add',
      entityType: 'Score',
      entityId: scoreDoc._id,
      description: 'Added a new score entry',
      metadata: { value, datePlayed },
      req
    });
    
    // Sort before returning
    const sortedScores = scoreDoc.scores.sort((a, b) => b.enteredAt - a.enteredAt);
    
    res.status(201).json(successResponse(sortedScores, 'Score added successfully'));
  } catch (error) {
    next(error);
  }
};

export const editScore = async (req, res, next) => {
    try {
      const { scoreIndex } = req.params; // this could be the _id of the subdocument if we used it, but here it's an index or we can match value/date.
      // Better to edit by passing the exact enteredAt timestamp or assigning _id to subdocs.
      // Since Schema has _id: false for scores, we will rely on updating a specific index from the sorted array.
      
      const { value, datePlayed } = req.body;
      
      const scoreDoc = await Score.findOne({ user: req.user._id });
      if (!scoreDoc) {
        return res.status(404).json(errorResponse('No scores found', 404));
      }
      
      // Sort to match frontend display index
      scoreDoc.scores.sort((a, b) => b.enteredAt - a.enteredAt);
      
      if (scoreIndex < 0 || scoreIndex >= scoreDoc.scores.length) {
          return res.status(400).json(errorResponse('Invalid score index', 400));
      }
      
      scoreDoc.scores[scoreIndex].value = value;
      scoreDoc.scores[scoreIndex].datePlayed = datePlayed;
      scoreDoc.scores[scoreIndex].clubId = req.body.clubId || scoreDoc.scores[scoreIndex].clubId;
      scoreDoc.scores[scoreIndex].courseRating = req.body.courseRating !== undefined ? Number(req.body.courseRating) : scoreDoc.scores[scoreIndex].courseRating;
      scoreDoc.scores[scoreIndex].slopeRating = req.body.slopeRating !== undefined ? Number(req.body.slopeRating) : scoreDoc.scores[scoreIndex].slopeRating;
      scoreDoc.scores[scoreIndex].handicapIndexUsed = req.body.handicapIndexUsed !== undefined ? Number(req.body.handicapIndexUsed) : scoreDoc.scores[scoreIndex].handicapIndexUsed;
      if (scoreDoc.scores[scoreIndex].courseRating && scoreDoc.scores[scoreIndex].slopeRating) {
        scoreDoc.scores[scoreIndex].scoreDifferential = Number((((Number(value) - scoreDoc.scores[scoreIndex].courseRating) * 113) / scoreDoc.scores[scoreIndex].slopeRating).toFixed(1));
      }
      
      // Keep original timestamp or update? Updating it might shift its position. We'll keep original enteredAt but mark as edited if needed.
      
      await scoreDoc.save();

      await logAudit({
        actor: req.user._id,
        action: 'score_edit',
        entityType: 'Score',
        entityId: scoreDoc._id,
        description: 'Edited an existing score entry',
        metadata: { scoreIndex: Number(scoreIndex), value, datePlayed },
        req
      });

      const sortedScores = scoreDoc.scores.sort((a, b) => b.enteredAt - a.enteredAt);
      
      res.status(200).json(successResponse(sortedScores, 'Score updated successfully'));
    } catch (error) {
      next(error);
    }
  };
