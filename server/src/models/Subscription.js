import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['monthly', 'yearly'], required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'lapsed', 'past_due', 'trialing'],
      default: 'active'
    },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    amount: { type: Number }, // in pence/cents
    currency: { type: String, default: 'gbp' },
    charityContribution: { type: Number, default: 0 },
    prizePoolContribution: { type: Number, default: 0 },
    history: [
      {
        event: { type: String },
        date: { type: Date, default: Date.now },
        amount: { type: Number },
        stripeEventId: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
