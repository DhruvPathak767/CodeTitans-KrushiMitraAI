import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MarketPrice from '../models/MarketPrice.js';
import marketRepository from '../repositories/market.repository.js';
import connectDB from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedMarketData = async () => {
  try {
    console.log('🌱 Starting KrishiMitra Market Intelligence Data Seeder...');

    await connectDB();

    const jsonPath = path.join(__dirname, '../data/market_prices.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Data file not found at ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const records = JSON.parse(rawData);

    if (!Array.isArray(records) || records.length === 0) {
      console.log('⚠️ No market records found in dataset.');
      process.exit(0);
    }

    console.log(`📦 Loaded ${records.length} market records from JSON dataset. Validating and seeding...`);

    const validRecords = records.filter((r) => r.crop && r.market && r.district && r.state && r.price && r.date);

    if (validRecords.length === 0) {
      throw new Error('No valid records passed schema validation.');
    }

    const bulkResult = await marketRepository.bulkUpsertPrices(validRecords);

    console.log(`✅ Market data seeded successfully!`);
    console.log(`   Upserted: ${bulkResult.upsertedCount || 0} new records`);
    console.log(`   Modified/Matched: ${bulkResult.modifiedCount || 0} existing records`);

    const totalCount = await MarketPrice.countDocuments();
    console.log(`📊 Total MarketPrice records in MongoDB: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Data Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedMarketData();
