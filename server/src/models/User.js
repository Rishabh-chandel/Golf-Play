import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
    avatar: { type: String },
    phone: { type: String },
    country: { type: String },
    handicap: { type: Number },
    club: { type: String },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isEmailVerified: { type: Boolean, default: false },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    charityContributionPercent: { type: Number, default: 10, min: 10, max: 100 },
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('name').set(function(fullName) {
  const parts = fullName.split(' ');
  this.firstName = parts[0] || '';
  this.lastName = parts.slice(1).join(' ') || '';
});

const User = mongoose.model('User', userSchema);
export default User;
