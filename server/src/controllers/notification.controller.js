import Notification from '../models/Notification.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get the current user's notifications.
 */
export const getMyNotifications = async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20),
      Notification.countDocuments({ user: req.user._id, isRead: false })
    ]);

    res.status(200).json(
      successResponse({
        notifications,
        unreadCount,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a notification as read.
 */
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    res.status(200).json(successResponse(notification));
  } catch (error) {
    next(error);
  }
};