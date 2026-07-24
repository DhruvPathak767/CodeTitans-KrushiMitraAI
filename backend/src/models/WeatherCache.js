import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Farm ID is required'],
      index: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity is required'],
    },
    rainfall: {
      type: Number,
      default: 0,
    },
    windSpeed: {
      type: Number,
      default: 0,
    },
    weatherCondition: {
      type: String,
      required: [true, 'Weather condition is required'],
      trim: true,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
weatherCacheSchema.index({ farmId: 1, fetchedAt: -1 });

// TTL index - Expire documents after 1 hour (3600 seconds)
weatherCacheSchema.index({ fetchedAt: 1 }, { expireAfterSeconds: 3600 });

const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);
export default WeatherCache;
