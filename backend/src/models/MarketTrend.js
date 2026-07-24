import mongoose from 'mongoose';

/**
 * Trend Direction Enum
 */
export const TREND_DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  STABLE: 'STABLE',
};

const dailyPriceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const marketTrendSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    marketName: {
      type: String,
      required: [true, 'Market name is required'],
      trim: true,
    },
    dailyPrices: [dailyPriceSchema],
    averagePrice: {
      type: Number,
    },
    highestPrice: {
      type: Number,
    },
    lowestPrice: {
      type: Number,
    },
    volatility: {
      type: Number,
    },
    trend: {
      type: String,
      enum: Object.values(TREND_DIRECTIONS),
      required: [true, 'Trend direction is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
marketTrendSchema.index({ cropName: 1, marketName: 1 });

const MarketTrend = mongoose.model('MarketTrend', marketTrendSchema);
export default MarketTrend;
