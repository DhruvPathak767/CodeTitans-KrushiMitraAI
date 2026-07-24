import mongoose from 'mongoose';

const pricePredictionSchema = new mongoose.Schema(
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
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
    },
    predictedPrice3Days: {
      type: Number,
    },
    predictedPrice7Days: {
      type: Number,
    },
    predictedPrice15Days: {
      type: Number,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    modelVersion: {
      type: String,
      trim: true,
    },
    generatedAt: {
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
pricePredictionSchema.index({ farmId: 1, generatedAt: -1 });

const PricePrediction = mongoose.model('PricePrediction', pricePredictionSchema);
export default PricePrediction;
