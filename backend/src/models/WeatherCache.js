import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Farm ID is required'],
      unique: true,
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    current: {
      type: Object,
      required: true,
    },
    hourly: {
      type: Array,
      default: [],
    },
    daily: {
      type: Array,
      default: [],
    },
    airQuality: {
      type: Object,
      default: {},
    },
    agriculture: {
      type: Object,
      default: {},
    },
    alerts: {
      type: Array,
      default: [],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL Index: expires at expiresAt
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);
export default WeatherCache;
