import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    drawDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'simulation', 'published', 'archived'],
      default: 'scheduled'
    },
    drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
    winningNumbers: [{ type: Number, min: 1, max: 45 }], // 5 numbers
    prizePool: {
      total: { type: Number, default: 0 },
      tier5: { type: Number, default: 0 },
      tier4: { type: Number, default: 0 },
      tier3: { type: Number, default: 0 },
      jackpotRolledOver: { type: Number, default: 0 }
    },
    stats: {
      totalParticipants: { type: Number, default: 0 },
      tier5Winners: { type: Number, default: 0 },
      tier4Winners: { type: Number, default: 0 },
      tier3Winners: { type: Number, default: 0 }
    },
    publishedAt: { type: Date },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    simulationRuns: [
      {
        runAt: { type: Date, default: Date.now },
        winningNumbers: [{ type: Number }],
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  { timestamps: true }
);

// Optional: ensure unique month/year per draw record if it aligns with business logic
drawSchema.index({ month: 1, year: 1 }, { unique: true });

const Draw = mongoose.model('Draw', drawSchema);
export default Draw;
