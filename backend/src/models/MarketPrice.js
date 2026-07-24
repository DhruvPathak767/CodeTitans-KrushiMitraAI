import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    marketName: {
      type: String,
      required: [true, 'Market name is required'],
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
    minPrice: {
      type: Number,
      required: [true, 'Minimum price is required'],
      min: [0, 'Price cannot be negative'],
    },
    maxPrice: {
      type: Number,
      required: [true, 'Maximum price is required'],
      min: [0, 'Price cannot be negative'],
    },
    modalPrice: {
      type: Number,
      required: [true, 'Modal price is required'],
      min: [0, 'Price cannot be negative'],
    },
    arrivalQuantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'Quintal',
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    priceDate: {
      type: Date,
      required: [true, 'Price date is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
marketPriceSchema.index({ cropName: 1, marketName: 1, priceDate: -1 });

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
export default MarketPrice;
