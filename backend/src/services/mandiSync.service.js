import axios from 'axios';
import marketRepository from '../repositories/market.repository.js';

/**
 * MandiSyncService
 * Fetches live APMC mandi prices from the data.gov.in Open Government Data API
 * and upserts them into the local MarketPrice MongoDB collection.
 *
 * Environment variables required:
 *   MANDI_API_KEY       – API key from data.gov.in
 *   MANDI_API_BASE_URL  – https://api.data.gov.in
 *   MANDI_RESOURCE_ID   – Resource ID for the commodity prices dataset
 */
class MandiSyncService {
  constructor() {
    this.apiKey = process.env.MANDI_API_KEY;
    this.baseUrl = process.env.MANDI_API_BASE_URL || 'https://api.data.gov.in';
    this.resourceId = process.env.MANDI_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';
  }

  /**
   * Fetch a page of records from the data.gov.in API.
   * @param {Object} options
   * @param {number} options.offset  – Pagination offset (default 0)
   * @param {number} options.limit   – Records per page (default 100, max 1000)
   * @param {Object} options.filters – Optional OGD filters e.g. { state: 'Gujarat' }
   * @returns {Promise<{records: Array, total: number, count: number}>}
   */
  async fetchFromApi({ offset = 0, limit = 100, filters = {} } = {}) {
    if (!this.apiKey) {
      throw new Error('MANDI_API_KEY is not configured. Set it in .env');
    }

    const params = {
      'api-key': this.apiKey,
      format: 'json',
      offset,
      limit,
    };

    // Apply optional OGD filters (e.g. state, district, commodity)
    if (filters.state) params['filters[state]'] = filters.state;
    if (filters.district) params['filters[district]'] = filters.district;
    if (filters.commodity) params['filters[commodity]'] = filters.commodity;

    const url = `${this.baseUrl}/resource/${this.resourceId}`;

    const response = await axios.get(url, {
      params,
      timeout: 30000, // 30-second timeout
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KrushiMitraAI/1.0',
      },
    });

    const data = response.data;

    if (data.status !== 'ok' && !Array.isArray(data.records)) {
      throw new Error(`data.gov.in API returned unexpected status: ${JSON.stringify(data).slice(0, 200)}`);
    }

    return {
      records: data.records || [],
      total: data.total || 0,
      count: data.count || 0,
    };
  }

  /**
   * Map a raw OGD record to our MarketPrice schema.
   * OGD fields: state, district, market, commodity, variety, grade,
   *             min_price, max_price, modal_price, arrival_date
   */
  mapRecord(raw) {
    // Parse the arrival_date — OGD uses DD/MM/YYYY format
    let parsedDate;
    if (raw.arrival_date) {
      const parts = raw.arrival_date.split('/');
      if (parts.length === 3) {
        // DD/MM/YYYY → YYYY-MM-DD
        parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      parsedDate = new Date();
    }

    return {
      crop: this.titleCase(raw.commodity || ''),
      market: this.titleCase(raw.market || ''),
      district: this.titleCase(raw.district || ''),
      state: this.titleCase(raw.state || ''),
      price: Number(raw.modal_price) || 0,
      unit: 'Quintal',
      date: parsedDate,
      source: 'data.gov.in',
    };
  }

  /**
   * Convert to title case for consistent display.
   */
  titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .trim();
  }

  /**
   * Sync latest mandi prices from data.gov.in into MongoDB.
   * Fetches multiple pages to get comprehensive data.
   *
   * @param {Object} options
   * @param {number} options.maxRecords – Maximum total records to fetch (default 500)
   * @param {Object} options.filters    – Optional OGD filters
   * @returns {Promise<{synced: number, total: number}>}
   */
  async syncLatestPrices({ maxRecords = 500, filters = {} } = {}) {
    console.log('🔄 [MandiSync] Starting live APMC price sync from data.gov.in...');

    let allRecords = [];
    let offset = 0;
    const pageSize = 100;

    // Paginate through the API
    while (allRecords.length < maxRecords) {
      const remaining = maxRecords - allRecords.length;
      const limit = Math.min(pageSize, remaining);

      const { records, total } = await this.fetchFromApi({
        offset,
        limit,
        filters,
      });

      if (!records || records.length === 0) break;

      allRecords = allRecords.concat(records);
      offset += records.length;

      console.log(`   📥 Fetched ${allRecords.length}/${Math.min(total, maxRecords)} records...`);

      // Stop if we've fetched everything available
      if (offset >= total || records.length < limit) break;
    }

    if (allRecords.length === 0) {
      console.log('⚠️ [MandiSync] No records returned from data.gov.in API.');
      return { synced: 0, total: 0 };
    }

    // Map and validate records
    const mapped = allRecords
      .map((r) => this.mapRecord(r))
      .filter((r) => r.crop && r.market && r.district && r.state && r.price > 0);

    if (mapped.length === 0) {
      console.log('⚠️ [MandiSync] All records failed validation.');
      return { synced: 0, total: allRecords.length };
    }

    // Upsert into MongoDB
    const result = await marketRepository.bulkUpsertPrices(mapped);

    const synced = (result.upsertedCount || 0) + (result.modifiedCount || 0);
    console.log(`✅ [MandiSync] Sync completed! ${synced} records upserted/updated out of ${mapped.length} valid records.`);

    return { synced, total: mapped.length };
  }
}

export default new MandiSyncService();
