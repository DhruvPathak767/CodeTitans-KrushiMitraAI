import marketRepository from '../repositories/market.repository.js';
import ApiError from '../utils/ApiError.js';

class MarketService {
  /**
   * Fetch current/latest market prices based on query parameters.
   */
  async getLatestPrices(queryParams = {}) {
    const { crop, district, state, sort = 'latest', limit = 20, page = 1, search = '' } = queryParams;

    const filters = {};
    if (crop) filters.crop = { $regex: new RegExp(`^${crop}$`, 'i') };
    if (district) filters.district = { $regex: new RegExp(district, 'i') };
    if (state) filters.state = { $regex: new RegExp(state, 'i') };

    let sortOption = { date: -1, price: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'crop') sortOption = { crop: 1 };

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);

    let result = await marketRepository.findLatestPrices({
      filters,
      sort: sortOption,
      limit: parsedLimit,
      page: parsedPage,
      search,
    });

    // Fallback logic: if no data found for specific district, broaden to state.
    if (result.data.length === 0 && filters.district) {
      delete filters.district;
      result = await marketRepository.findLatestPrices({
        filters,
        sort: sortOption,
        limit: parsedLimit,
        page: parsedPage,
        search,
      });
    }

    // If still no data, broaden to nation-wide (all states).
    if (result.data.length === 0 && filters.state) {
      delete filters.state;
      result = await marketRepository.findLatestPrices({
        filters,
        sort: sortOption,
        limit: parsedLimit,
        page: parsedPage,
        search,
      });
    }

    const formattedData = result.data.map((item) => ({
      id: item._id,
      crop: item.crop,
      market: item.market,
      district: item.district,
      state: item.state,
      price: item.price,
      unit: item.unit,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : null,
      source: item.source,
    }));

    return {
      prices: formattedData,
      pagination: result.meta,
    };
  }

  /**
   * Fetch historical market prices for a crop over specified days (default 30 days).
   */
  async getPriceHistory(queryParams = {}) {
    const { crop, market, days = 30 } = queryParams;

    if (!crop && !market) {
      throw new ApiError(400, 'Please provide a crop or market name to fetch price history.');
    }

    const parsedDays = Math.max(1, parseInt(days, 10) || 30);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parsedDays);

    const records = await marketRepository.findPriceHistory({
      crop,
      market,
      startDate,
    });

    if (!records || records.length === 0) {
      return [];
    }

    return records.map((item) => ({
      crop: item.crop,
      market: item.market,
      district: item.district,
      state: item.state,
      price: item.price,
      unit: item.unit,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : null,
    }));
  }

  /**
   * Fetch nearby market prices given district, state, or crop.
   */
  async getNearbyMarketPrices(queryParams = {}) {
    const { district, state, crop, limit = 20 } = queryParams;

    if (!district && !state && !crop) {
      throw new ApiError(400, 'Please provide at least a district, state, or crop filter.');
    }

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

    const records = await marketRepository.findNearbyPrices({
      district,
      state,
      crop,
      limit: parsedLimit,
    });

    return records.map((item) => ({
      crop: item.crop,
      market: item.market,
      district: item.district,
      state: item.state,
      price: item.price,
      unit: item.unit,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : null,
    }));
  }

  /**
   * Fetch all supported unique crops.
   */
  async getAllCrops() {
    return await marketRepository.getDistinctCrops();
  }

  /**
   * Fetch all supported markets with district and state details.
   */
  async getAllMarkets() {
    return await marketRepository.getDistinctMarkets();
  }
}

export default new MarketService();
