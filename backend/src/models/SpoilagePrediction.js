import mongoose from 'mongoose';

const spoilagePredictionSchema = new mongoose.Schema(
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
    storageType: {
      type: String,
      required: [true, 'Storage type is required'],
      trim: true,
    },
    storageDays: {
      type: Number,
      required: [true, 'Storage days is required'],
      min: [0, 'Storage days cannot be negative'],
    },
    temperature: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    spoilageRisk: {
      type: Number,
      min: 0,
      max: 1,
    },
    expectedShelfLife: {
      type: Number,
    },
    recommendation: {
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
spoilagePredictionSchema.index({ farmId: 1, createdAt: -1 });

const SpoilagePrediction = mongoose.model('SpoilagePrediction', spoilagePredictionSchema);
export default SpoilagePrediction;
