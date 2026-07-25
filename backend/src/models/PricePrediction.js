import mongoose from 'mongoose';

const pricePredictionSchema = new mongoose.Schema(
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
    market: {
      type: String,
      required: [true, 'Market name is required'],
      trim: true,
    },
    district: {
      type: String,
      default: 'Rajkot',
      trim: true,
    },
    todayPrice: {
      type: Number,
      required: [true, 'Today price is required'],
    },
    priceAfter3Days: {
      type: Number,
      required: [true, '3-day predicted price is required'],
    },
    priceAfter7Days: {
      type: Number,
      required: [true, '7-day predicted price is required'],
    },
    priceAfter15Days: {
      type: Number,
      required: [true, '15-day predicted price is required'],
    },
    trend: {
      type: String,
      enum: ['Increasing', 'Stable', 'Decreasing'],
      default: 'Increasing',
    },
    confidence: {
      type: Number,
      default: 91,
      min: 0,
      max: 100,
    },
    predictionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

pricePredictionSchema.index({ crop: 1, market: 1, createdAt: -1 });
pricePredictionSchema.index({ farmerId: 1, createdAt: -1 });

const PricePrediction =
  mongoose.models.PricePrediction || mongoose.model('PricePrediction', pricePredictionSchema);

export default PricePrediction;
