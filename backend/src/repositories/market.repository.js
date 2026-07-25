import MarketPrice from '../models/MarketPrice.js';

class MarketRepository {
  /**
   * Find latest market prices with filtering, sorting, pagination, and search.
   */
  async findLatestPrices({ filters = {}, sort = { date: -1, price: -1 }, limit = 20, page = 1, search = '' }) {
    const query = { ...filters };

    if (search) {
      query.$or = [
        { crop: { $regex: search, $options: 'i' } },
        { market: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MarketPrice.find(query).sort(sort).skip(skip).limit(limit).lean(),
      MarketPrice.countDocuments(query),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Find historical price records for a crop and market within a date range.
   */
  async findPriceHistory({ crop, market, startDate, sort = { date: 1 } }) {
    const query = {};

    if (crop) query.crop = { $regex: new RegExp(`^${crop}$`, 'i') };
    if (market) query.market = { $regex: new RegExp(market, 'i') };
    if (startDate) query.date = { $gte: new Date(startDate) };

    return await MarketPrice.find(query).sort(sort).lean();
  }

  /**
   * Find nearby market prices filtered by district, state, or crop.
   */
  async findNearbyPrices({ district, state, crop, limit = 20 }) {
    const query = {};

    if (district) {
      query.district = { $regex: new RegExp(district, 'i') };
    } else if (state) {
      query.state = { $regex: new RegExp(state, 'i') };
    }

    if (crop) {
      query.crop = { $regex: new RegExp(`^${crop}$`, 'i') };
    }

    return await MarketPrice.find(query).sort({ date: -1, price: -1 }).limit(limit).lean();
  }

  /**
   * Get distinct supported crops.
   */
  async getDistinctCrops() {
    return await MarketPrice.distinct('crop');
  }

  /**
   * Get distinct supported markets along with districts and states.
   */
  async getDistinctMarkets() {
    return await MarketPrice.aggregate([
      {
        $group: {
          _id: { market: '$market', district: '$district', state: '$state' },
          lastUpdated: { $max: '$date' },
        },
      },
      {
        $project: {
          _id: 0,
          market: '$_id.market',
          district: '$_id.district',
          state: '$_id.state',
          lastUpdated: 1,
        },
      },
      { $sort: { state: 1, district: 1, market: 1 } },
    ]);
  }

  /**
   * Bulk upsert market records to avoid duplicates during data seeding or syncing.
   */
  async bulkUpsertPrices(records) {
    const operations = records.map((record) => {
      const recordDate = new Date(record.date);
      return {
        updateOne: {
          filter: {
            crop: record.crop,
            market: record.market,
            date: recordDate,
          },
          update: {
            $set: {
              district: record.district,
              state: record.state,
              price: Number(record.price),
              unit: record.unit || 'Quintal',
              source: record.source || 'AGMARKNET Local',
              date: recordDate,
            },
          },
          upsert: true,
        },
      };
    });

    return await MarketPrice.bulkWrite(operations);
  }
}

export default new MarketRepository();
