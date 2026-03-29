import mongoose from 'mongoose';

const prizePoolSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    totalCollected: { type: Number, default: 0 },
    tier5Pool: { type: Number, default: 0 },
    tier4Pool: { type: Number, default: 0 },
    tier3Pool: { type: Number, default: 0 },
    jackpotCarryover: { type: Number, default: 0 },
    isFinalized: { type: Boolean, default: false },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw' }
  },
  { timestamps: true }
);

const PrizePool = mongoose.model('PrizePool', prizePoolSchema);
export default PrizePool;
