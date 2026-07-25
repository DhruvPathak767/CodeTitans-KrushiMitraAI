import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['rain', 'disease', 'heat', 'harvest', 'irrigation', 'spray', 'ai', 'scheme', 'market', 'system', 'weather', 'WEATHER'],
      default: 'ai',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'gu'],
      default: 'en',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export const NOTIFICATION_TYPES = {
  RAIN: 'rain',
  DISEASE: 'disease',
  HEAT: 'heat',
  HARVEST: 'harvest',
  IRRIGATION: 'irrigation',
  SPRAY: 'spray',
  AI: 'ai',
  SCHEME: 'scheme',
  MARKET: 'market',
  SYSTEM: 'system',
};

export const NOTIFICATION_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
