import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: [
      {
        value: { type: Number, min: 1, max: 45, required: true },
        datePlayed: { type: Date, required: true },
        clubId: { type: String },
        courseRating: { type: Number },
        slopeRating: { type: Number },
        handicapIndexUsed: { type: Number },
        scoreDifferential: { type: Number },
        enteredAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// BUSINESS RULE: scores array max length = 5
scoreSchema.pre('save', function (next) {
  if (this.scores.length > 5) {
    // Sort by enteredAt to ensure we remove the oldest, or just shift if we assume append
    // Here we sort by enteredAt ascending, then remove until we have 5
    this.scores.sort((a, b) => a.enteredAt - b.enteredAt);
    while (this.scores.length > 5) {
      this.scores.shift();
    }
  }
  next();
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;
