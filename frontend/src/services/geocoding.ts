export interface ReverseGeocodeResult {
  formattedAddress: string;
  country: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface SearchLocationResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

/**
 * Clean administrative suffixes (e.g. "Taluka", "Tehsil", "Rural Taluka", "City Taluka")
 */
export function cleanAdminName(name: string, districtName?: string): string {
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

/**
 * Helper to deduplicate array of address parts case-insensitively
 */
export function dedupeAddressParts(parts: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
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

/**
 * Reverse Geocode coordinates via Backend API (POST /api/location/reverse)
 */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  try {
    const res = await fetch('/api/location/reverse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        return {
          formattedAddress: payload.data.formattedAddress || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          country: payload.data.country || 'India',
          state: payload.data.state || '',
          district: payload.data.district || '',
          taluka: payload.data.taluka || '',
          village: payload.data.village || '',
          pincode: payload.data.pincode || '',
          latitude: lat,
          longitude: lng,
        };
      }
    }
    throw new Error('Backend reverse geocoding failed');
  } catch (error) {
    console.warn('Backend reverse geocoding warning, trying direct OSM fallback:', error);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'KrishiMitra-AI-Platform/1.0',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch address details');

      const data = await res.json();
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

      const localTokens = [
        addr.junction || addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.locality || addr.hamlet || addr.quarter || addr.residential || addr.road || addr.amenity || addr.building
      ].filter(Boolean);

      let village = localTokens.length > 0
        ? Array.from(new Set(localTokens)).join(', ')
        : (addr.city || (data.display_name ? data.display_name.split(',')[0]?.trim() : ''));

      const pincode = addr.postcode || addr.postal_code || '';
      const formattedAddress = data.display_name || dedupeAddressParts([village, taluka, district, state, pincode, country]).join(', ');

      return {
        formattedAddress,
        country,
        state,
        district,
        taluka,
        village,
        pincode,
        latitude: lat,
        longitude: lng,
      };
    } catch (fallbackError) {
      return {
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        country: 'India',
        state: '',
        district: '',
        taluka: '',
        village: '',
        pincode: '',
        latitude: lat,
        longitude: lng,
      };
    }
  }
}

/**
 * Search Location query via Backend API (GET /api/location/search?q=)
 * Fallback to OpenStreetMap search if backend unavailable
 */
export async function searchLocation(query: string): Promise<SearchLocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const rawQuery = query.trim();

  // 1. Direct coordinate detection (e.g. "22.224563, 73.186925")
  const coordRegex = /^\s*\(?\s*(-?\d+(?:\.\d+)?)\s*[, \s]+\s*(-?\d+(?:\.\d+)?)\s*\)?\s*$/;
  const match = rawQuery.match(coordRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [
        {
          displayName: `📍 Pin Coordinates (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
          latitude: lat,
          longitude: lng,
        },
      ];
    }
  }

  // 2. Query Backend location search endpoint
  try {
    const res = await fetch(`/api/location/search?q=${encodeURIComponent(rawQuery)}`);
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
        return payload.data;
      }
    }
  } catch (err) {
    console.warn('Backend location search warning, trying direct OSM fallback:', err);
  }

  // 3. Fallback direct search with query relaxation
  try {
    const attempts = [
      rawQuery,
      rawQuery
        .replace(/\b\d+[\/\-a-z0-9]*\b/gi, '')
        .replace(/\b(near|opp|opposite|behind|beside|flat|society|apartment|heights|house|block|building)\b/gi, '')
        .replace(/[,;]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    ];

    const parts = rawQuery.split(/[,;\s]+/).filter(Boolean);
    if (parts.length > 2) {
      attempts.push(parts.slice(-3).join(' '));
      attempts.push(parts.slice(-2).join(' '));
    }

    const uniqueAttempts = Array.from(new Set(attempts.filter((q) => q && q.length >= 2)));

    for (const q of uniqueAttempts) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=in`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'KrishiMitra-AI-Platform/1.0',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return data.map((item: any) => ({
            displayName: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          }));
        }
      }
    }

    return [];
  } catch (error) {
    console.warn('Search location error:', error);
    return [];
  }
}
