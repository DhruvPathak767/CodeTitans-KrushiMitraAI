import mongoose from 'mongoose';

/**
 * Area Units Enum
 */
export const AREA_UNITS = {
  ACRE: 'ACRE',
  HECTARE: 'HECTARE',
};

/**
 * Farm Status Enum
 */
export const FARM_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const addressSchema = new mongoose.Schema(
  {
    formattedAddress: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' },
    state: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    taluka: { type: String, trim: true, default: '' },
    village: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
    accuracy: { type: Number, default: 0 },
    resolvedLocation: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

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
      minlength: [3, 'Farm name must be at least 3 characters'],
      maxlength: [100, 'Farm name cannot exceed 100 characters'],
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    soilType: {
      type: String,
      trim: true,
      default: 'Black Soil',
    },
    area: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0.01, 'Area must be greater than zero'],
    },
    areaUnit: {
      type: String,
      enum: Object.values(AREA_UNITS),
      default: AREA_UNITS.ACRE,
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Sowing date cannot be in the future',
      },
    },
    irrigationType: {
      type: String,
      trim: true,
      default: 'Drip Irrigation',
    },
    lastIrrigationDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(FARM_STATUS),
      default: FARM_STATUS.ACTIVE,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [70.8022, 22.3039], // Default Rajkot, Gujarat
      },
    },
    address: addressSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
farmSchema.index({ location: '2dsphere' });
farmSchema.index({ userId: 1, createdAt: -1 });
farmSchema.index({ cropName: 1 });
farmSchema.index({ 'address.state': 1, 'address.district': 1 });

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
