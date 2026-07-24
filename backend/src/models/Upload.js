import mongoose from 'mongoose';

/**
 * Image Types Enum
 */
export const IMAGE_TYPES = {
  LEAF: 'LEAF',
  SOIL: 'SOIL',
  FRUIT: 'FRUIT',
  OTHER: 'OTHER',
};

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
    imageType: {
      type: String,
      enum: Object.values(IMAGE_TYPES),
      required: [true, 'Image type is required'],
    },
    imageSize: {
      type: Number,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    uploadedAt: {
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
uploadSchema.index({ userId: 1, uploadedAt: -1 });

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
