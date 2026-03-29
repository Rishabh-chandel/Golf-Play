import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['draw_result', 'winner_alert', 'subscription', 'verification', 'system'],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
