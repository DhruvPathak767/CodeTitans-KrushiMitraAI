import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
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
    diseaseDetected: {
      type: Number,
      default: 0,
    },
    healthyLeaves: {
      type: Number,
      default: 0,
    },
    totalPredictions: {
      type: Number,
      default: 0,
    },
    averageConfidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    averageMarketPrice: {
      type: Number,
      default: 0,
    },
    estimatedProfit: {
      type: Number,
      default: 0,
    },
    totalRecommendations: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
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
analyticsSchema.index({ userId: 1, farmId: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
