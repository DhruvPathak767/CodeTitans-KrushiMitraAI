import mongoose from 'mongoose';

/**
 * Recommendation Options Enum
 */
export const RECOMMENDATION_OPTIONS = {
  SELL_NOW: 'SELL_NOW',
  STORE: 'STORE',
  TRANSPORT: 'TRANSPORT',
};

const sellRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Farm ID is required'],
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'Quintal',
      trim: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
    },
    predictedPrice: {
      type: Number,
      required: [true, 'Predicted price is required'],
    },
    expectedProfit: {
      type: Number,
    },
    storageCost: {
      type: Number,
      default: 0,
    },
    transportCost: {
      type: Number,
      default: 0,
    },
    spoilageRisk: {
      type: Number,
      min: 0,
      max: 1,
    },
    recommendation: {
      type: String,
      enum: Object.values(RECOMMENDATION_OPTIONS),
      required: [true, 'Recommendation is required'],
    },
    recommendationReason: {
      type: String,
      trim: true,
    },
    bestMarket: {
      type: String,
      trim: true,
    },
    expectedSellingDate: {
      type: Date,
    },
    aiExplanation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
sellRecommendationSchema.index({ farmId: 1, createdAt: -1 });

const SellRecommendation = mongoose.model('SellRecommendation', sellRecommendationSchema);
export default SellRecommendation;
