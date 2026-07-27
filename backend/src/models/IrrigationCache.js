import mongoose from 'mongoose';

const weatherHashSchema = new mongoose.Schema(
  {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainProbability: { type: Number, required: true },
    expectedRainfall: { type: Number, default: 0 },
    condition: { type: String, default: 'Clear' },
  },
  { _id: false }
);

const irrigationCacheSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    lang: {
      type: String,
      default: 'en',
      index: true,
    },
    weatherHash: weatherHashSchema,
    recommendation: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    groqExplanation: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    ruleEngineFallback: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

irrigationCacheSchema.index({ farmId: 1, lang: 1, createdAt: -1 });

const IrrigationCache = mongoose.model('IrrigationCache', irrigationCacheSchema);
export default IrrigationCache;
