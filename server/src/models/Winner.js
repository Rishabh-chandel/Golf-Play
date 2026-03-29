import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
    matchedNumbers: [{ type: Number }],
    matchTier: { type: Number, enum: [3, 4, 5], required: true },
    prizeAmount: { type: Number, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    proofUploadUrl: { type: String },
    proofUploadedAt: { type: Date },
    adminReviewNote: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    paidAt: { type: Date },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Winner = mongoose.model('Winner', winnerSchema);
export default Winner;
