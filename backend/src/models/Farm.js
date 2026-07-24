import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0, 'Area cannot be negative'],
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
farmSchema.index({ userId: 1 });

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
