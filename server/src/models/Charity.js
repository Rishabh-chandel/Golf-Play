import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxLength: 200 },
    logo: { type: String },
    coverImage: { type: String },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ['health', 'education', 'environment', 'sports', 'community', 'animals', 'arts', 'other'],
      required: true
    },
    website: { type: String },
    registrationNumber: { type: String },
    country: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    totalReceived: { type: Number, default: 0 },
    subscriberCount: { type: Number, default: 0 },
    events: [
      {
        title: String,
        description: String,
        date: Date,
        location: String,
        link: String
      }
    ]
  },
  { timestamps: true }
);

const Charity = mongoose.model('Charity', charitySchema);
export default Charity;
