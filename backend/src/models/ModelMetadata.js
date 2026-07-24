import mongoose from 'mongoose';

/**
 * Model Status Enum
 */
export const MODEL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const modelMetadataSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    version: {
      type: String,
      required: [true, 'Model version is required'],
      trim: true,
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 1,
    },
    precision: {
      type: Number,
      min: 0,
      max: 1,
    },
    recall: {
      type: Number,
      min: 0,
      max: 1,
    },
    f1Score: {
      type: Number,
      min: 0,
      max: 1,
    },
    trainedDate: {
      type: Date,
    },
    dataset: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(MODEL_STATUS),
      default: MODEL_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
modelMetadataSchema.index({ modelName: 1, version: 1 });

const ModelMetadata = mongoose.model('ModelMetadata', modelMetadataSchema);
export default ModelMetadata;
