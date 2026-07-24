import mongoose from 'mongoose';

/**
 * Notification Types Enum
 */
export const NOTIFICATION_TYPES = {
  RAIN: 'RAIN',
  DISEASE: 'DISEASE',
  HARVEST: 'HARVEST',
  MARKET: 'MARKET',
  GENERAL: 'GENERAL',
};

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      default: NOTIFICATION_TYPES.GENERAL,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
