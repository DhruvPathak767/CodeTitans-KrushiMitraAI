import mongoose from 'mongoose';

const cropAdvisorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    lang: {
      type: String,
      enum: ['en', 'hi', 'gu'],
      default: 'en',
      index: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    growthStage: {
      type: String,
      required: true,
    },
    weatherSnapshot: {
      type: Object,
      required: true,
    },
    groqResponse: {
      type: Object,
      required: true,
    },
    ruleEngineFallback: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index auto-deletes expired advisory documents
    },
  },
  {
    timestamps: true,
  }
);

cropAdvisorySchema.index({ farmId: 1, lang: 1, createdAt: -1 });

const CropAdvisory = mongoose.model('CropAdvisory', cropAdvisorySchema);

export default CropAdvisory;
