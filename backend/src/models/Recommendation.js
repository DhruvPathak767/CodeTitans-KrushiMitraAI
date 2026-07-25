import mongoose from 'mongoose';

export const DECISION_TYPES = {
  SELL_NOW: 'SELL_NOW',
  STORE: 'STORE',
  SELL_PARTIALLY: 'SELL_PARTIALLY',
  IMMEDIATE_SALE_DISEASE: 'IMMEDIATE_SALE_DISEASE',
  IMMEDIATE_SALE_WEATHER: 'IMMEDIATE_SALE_WEATHER',
};

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

const recommendationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      index: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 100,
    },
    marketPrice: {
      type: Number,
      required: [true, 'Current market price is required'],
    },
    predictedPrice: {
      type: Number,
    },
    weatherRisk: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Low',
    },
    diseaseStatus: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Healthy',
    },
    storageAvailable: {
      type: Boolean,
      default: true,
    },
    storageCost: {
      type: Number,
      default: 0,
    },
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    decision: {
      type: String,
      enum: Object.values(DECISION_TYPES),
      required: [true, 'Decision is required'],
      index: true,
    },
    estimatedProfit: {
      type: String,
      default: '0%',
    },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVELS),
      default: RISK_LEVELS.LOW,
    },
    confidence: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    recommendationSummary: {
      type: String,
      required: [true, 'Recommendation summary is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

recommendationSchema.index({ farmerId: 1, createdAt: -1 });
recommendationSchema.index({ farmId: 1, createdAt: -1 });

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
