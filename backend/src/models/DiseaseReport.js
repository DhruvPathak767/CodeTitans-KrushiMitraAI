import mongoose from 'mongoose';

/**
 * Severity Enum
 */
export const SEVERITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

const diseaseReportSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    diseaseName: {
      type: String,
      required: [true, 'Disease name is required'],
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    severity: {
      type: String,
      enum: Object.values(SEVERITY_LEVELS),
      required: [true, 'Severity is required'],
    },
    symptoms: {
      type: String,
      trim: true,
    },
    treatment: {
      type: String,
      trim: true,
    },
    recommendation: {
      type: String,
      trim: true,
    },
    modelVersion: {
      type: String,
      trim: true,
    },
    predictionTime: {
      type: Date,
      default: Date.now,
    },
    processingTimeMs: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
diseaseReportSchema.index({ userId: 1, farmId: 1 });
diseaseReportSchema.index({ predictionTime: -1 });

const DiseaseReport = mongoose.model('DiseaseReport', diseaseReportSchema);
export default DiseaseReport;
