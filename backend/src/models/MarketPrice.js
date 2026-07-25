import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      index: true,
    },
    market: {
      type: String,
      required: [true, 'Market name is required'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: 'Quintal',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Price date is required'],
      index: true,
    },
    source: {
      type: String,
      default: 'AGMARKNET Local',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate entries for the same crop, market, and date
marketPriceSchema.index({ crop: 1, market: 1, date: 1 }, { unique: true });

const MarketPrice = mongoose.models.MarketPrice || mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice;
