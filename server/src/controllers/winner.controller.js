import Winner from '../models/Winner.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logAudit } from '../utils/audit.js';

export const getMyWinnings = async (req, res, next) => {
  try {
    const wins = await Winner.find({ user: req.user._id }).populate('draw').sort({ createdAt: -1 });
    res.status(200).json(successResponse(wins));
  } catch (error) {
    next(error);
  }
};

export const uploadProof = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('No image uploaded', 400));
    }
    
    // File structure will be handled by multer
    const fileUrl = `${process.env.CLIENT_URL}/uploads/${req.file.filename}`;
    
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { proofUploadUrl: fileUrl, proofUploadedAt: Date.now(), verificationStatus: 'pending' }, // Usually pending review
      { new: true }
    );

    await logAudit({
      actor: req.user._id,
      action: 'proof_upload',
      entityType: 'Winner',
      entityId: winner?._id,
      description: 'Uploaded prize verification proof',
      metadata: { fileUrl },
      req
    });
    
    res.status(200).json(successResponse(winner, 'Proof uploaded successfully'));
  } catch (error) {
    next(error);
  }
};
