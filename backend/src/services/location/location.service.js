import axios from 'axios';
import logger from '../../config/logger.js';

function cleanAdminName(name, districtName) {
  if (!name) return '';
  let cleaned = name.replace(/\s*(taluka|tehsil|subdistrict|block)\b/gi, '').trim();
  if (districtName) {
    const stripped = cleaned.replace(/\s*(rural|city)\b/gi, '').trim();
    if (stripped.toLowerCase() === districtName.toLowerCase()) {
      return districtName;
    }
  }
  return cleaned;
}

function dedupeAddressParts(parts) {
  const seen = new Set();
  const result = [];
  for (const p of parts) {
    if (!p || typeof p !== 'string') continue;
    const trimmed = p.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(trimmed);
    }
  }
  return result;
}

// In-Memory 30-Day Cache for Reverse Geocode Queries
if (!global.reverseGeocodeCache) {
  global.reverseGeocodeCache = new Map();
}
const REVERSE_GEOCODE_CACHE = global.reverseGeocodeCache;
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

class LocationService {
  /**
   * Reverse Geocode latitude & longitude - Optimized for Lightning Fast Speed
   * 1. Check 30-day cache (1ms)
   * 2. Try Nominatim (2.5s timeout)
   * 3. Instant Fallback to BigDataCloud (300ms)
   */
  async reverseGeocode(lat, lng) {
    const startTime = Date.now();
    const latFixed = Number(lat).toFixed(5);
    const lngFixed = Number(lng).toFixed(5);
    const cacheKey = `${latFixed},${lngFixed}`;

    // Check cache first (1ms)
    const cachedEntry = REVERSE_GEOCODE_CACHE.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      logger.info(`Reverse Geocode CACHE HIT for coords [${cacheKey}] (${Date.now() - startTime}ms)`);
      return {
        ...cachedEntry.data,
        isCached: true,
        durationMs: Date.now() - startTime,
      };
    }

    // 1. Primary Fast Attempt: OpenStreetMap Nominatim (2.5s timeout)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'KrishiMitra-Tetrathon-Platform-v1.0 (contact@krishimitra.in)',
        },
        timeout: 2500,
      });

      const data = res.data || {};
      const addr = data.address || {};

      const country = addr.country || 'India';
      const state = addr.state || addr.region || addr.province || addr['ISO3166-2-lvl4'] || '';
      const district =
        addr.state_district ||
        addr.district ||
        addr.city ||
        addr.county ||
        addr.municipality ||
        '';

      const rawTaluka =
        addr.subdistrict ||
        addr.tehsil ||
        addr.taluka ||
        addr.city_district ||
        (addr.county && addr.county !== district ? addr.county : '') ||
        '';
      const taluka = cleanAdminName(rawTaluka, district);

      const road = addr.road || addr.pedestrian || addr.street || '';
      const resolvedLocation = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.locality || addr.hamlet || road || '';

      let village =
        addr.village ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.locality ||
        addr.hamlet ||
        addr.town ||
        addr.city ||
        (data.display_name ? data.display_name.split(',')[0]?.trim() : '') ||
        'Location name unavailable';

      if (village.toLowerCase() === district.toLowerCase() && data.display_name) {
        const firstSegment = cleanAdminName(data.display_name.split(',')[0]?.trim() || '', district);
        if (
          firstSegment &&
          firstSegment.toLowerCase() !== district.toLowerCase() &&
          firstSegment.toLowerCase() !== state.toLowerCase()
        ) {
          village = firstSegment;
        }
      }

      const pincode = addr.postcode || addr.postal_code || '';
      const formattedAddress = data.display_name || dedupeAddressParts([village, taluka, district, state, pincode, country]).join(', ');

      const duration = Date.now() - startTime;
      logger.info(`Backend Nominatim Reverse Geocoding SUCCESS (${duration}ms): Village="${village}", District="${district}"`);

      const resultPayload = {
        formattedAddress,
        country,
        state,
        district,
        taluka,
        village,
        pincode,
        road,
        resolvedLocation,
        latitude: Number(lat),
        longitude: Number(lng),
        durationMs: duration,
        isCached: false,
        provider: 'Nominatim',
      };

      REVERSE_GEOCODE_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: resultPayload,
      });

      return resultPayload;
    } catch (primaryErr) {
      logger.warn(`Nominatim reverse geocode attempt skipped/timed out (${Date.now() - startTime}ms). Instant fallback to BigDataCloud...`);
    }

    // 2. Fast Fallback Attempt: BigDataCloud Reverse Geocode API (300ms response)
    try {
      const fallbackUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
      const res = await axios.get(fallbackUrl, { timeout: 3000 });
      const bdcData = res.data || {};

      const country = bdcData.countryName || 'India';
      const state = bdcData.principalSubdivision || '';
      const district = bdcData.city || bdcData.locality || '';
      const village = bdcData.locality || bdcData.city || 'Location name unavailable';

      let taluka = '';
      const adminList = bdcData.localityInfo?.administrative || [];
      const talukaItem = adminList.find((a) => a.name && (a.name.toLowerCase().includes('taluka') || a.name.toLowerCase().includes('tehsil')));
      if (talukaItem) {
        taluka = cleanAdminName(talukaItem.name, district);
      }

      const pincode = bdcData.postcode || '';
      const formattedAddress = dedupeAddressParts([village, taluka, district, state, country]).join(', ');
      const duration = Date.now() - startTime;

      const resultPayload = {
        formattedAddress,
        country,
        state,
        district,
        taluka,
        village,
        pincode,
        road: '',
        resolvedLocation: village,
        latitude: Number(lat),
        longitude: Number(lng),
        durationMs: duration,
        isCached: false,
        provider: 'BigDataCloud',
      };

      REVERSE_GEOCODE_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: resultPayload,
      });

      logger.info(`BigDataCloud Fast Reverse Geocode SUCCESS (${duration}ms): Village="${village}", District="${district}"`);
      return resultPayload;
    } catch (fallbackErr) {
      const duration = Date.now() - startTime;
      logger.error(`All Reverse Geocode providers failed (${duration}ms): ${fallbackErr.message}`);

      return {
        formattedAddress: `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lng).toFixed(4)}`,
        country: 'India',
        state: '',
        district: '',
        taluka: '',
        village: 'Location name unavailable',
        pincode: '',
        road: '',
        resolvedLocation: '',
        latitude: Number(lat),
        longitude: Number(lng),
        durationMs: duration,
        isCached: false,
        provider: 'None',
      };
    }
  }

  /**
   * Search location query restricted to India
   */
  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];
    const startTime = Date.now();
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'KrishiMitra-Tetrathon-Platform-v1.0 (contact@krishimitra.in)',
        },
        timeout: 4000,
      });

      const data = res.data || [];
      const duration = Date.now() - startTime;
      logger.info(`Backend Location Search completed in ${duration}ms for query: "${query}"`);

      return data.map((item) => ({
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    } catch (error) {
      logger.warn(`Location Search error: ${error.message}`);
      return [];
    }
  }
}

export default new LocationService();
