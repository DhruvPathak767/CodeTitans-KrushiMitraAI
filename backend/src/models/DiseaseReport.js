import mongoose from 'mongoose';

const diseaseReportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    farmId: {
      type: String,
      default: 'default_farm',
      trim: true,
    },
    crop: {
      type: String,
      default: 'general',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
      trim: true,
    },
    disease: {
      type: String,
      required: [true, 'Disease classification result is required'],
      trim: true,
    },
    confidence: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: 0,
      max: 100,
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    treatment: {
      type: String,
      required: [true, 'Treatment recommendation is required'],
    },
    treatmentOrganic: {
      type: String,
      default: '',
    },
    treatmentChemical: {
      type: String,
      default: '',
    },
    organicAlternative: {
      type: String,
      default: '',
    },
    fungicide: {
      type: String,
      default: '',
    },
    prevention: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    predictionTime: {
      type: Number,
      default: 0, // prediction latency in milliseconds
    },
  },
  {
    timestamps: true,
  }
);

// Add index on farmerId and createdAt for fast history queries
diseaseReportSchema.index({ farmerId: 1, createdAt: -1 });

const DiseaseReport = mongoose.model('DiseaseReport', diseaseReportSchema);

export default DiseaseReport;
