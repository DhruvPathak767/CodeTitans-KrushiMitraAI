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
 * Reverse Geocode coordinates using OpenStreetMap Nominatim API
 * Dynamically parses location details for ANY point in India / world.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
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

    // Dynamically construct local place details (junction, suburb, neighbourhood, village, town, locality)
    const localTokens = [
      addr.junction || addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.locality || addr.hamlet || addr.quarter || addr.residential || addr.road || addr.amenity || addr.building
    ].filter(Boolean);

    let village = localTokens.length > 0
      ? Array.from(new Set(localTokens)).join(', ')
      : (addr.city || (data.display_name ? data.display_name.split(',')[0]?.trim() : ''));

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

    // Dynamic formatted address from OpenStreetMap display_name or deduplicated parts
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
  } catch (error) {
    console.warn('Reverse geocoding warning:', error);
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

/**
 * Search Location query using OpenStreetMap Nominatim Search API
 * Focused on India (countrycodes=in) with coordinate detection & query relaxation
 */
export async function searchLocation(query: string): Promise<SearchLocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const rawQuery = query.trim();

  // 1. Direct coordinate detection (e.g. "22.224563, 73.186925" or "(22.224563, 73.186925)")
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

  // 2. Search focused on India with query fallbacks
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
      // Focused on India (countrycodes=in)
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
