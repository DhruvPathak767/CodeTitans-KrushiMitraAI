import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
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
    irrigation: {
      type: String,
      trim: true,
    },
    fertilizer: {
      type: String,
      trim: true,
    },
    pestRisk: {
      type: String,
      trim: true,
    },
    diseaseRisk: {
      type: String,
      trim: true,
    },
    harvestAdvice: {
      type: String,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
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
advisorySchema.index({ farmId: 1, generatedAt: -1 });
advisorySchema.index({ userId: 1 });

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
