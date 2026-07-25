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

    // District parsing: state_district or district or city or municipality
    const district =
      addr.state_district ||
      addr.district ||
      addr.city ||
      addr.municipality ||
      (addr.county && !addr.county.toLowerCase().includes('taluka') && !addr.county.toLowerCase().includes('tehsil')
        ? addr.county
        : '') ||
      '';

    // Taluka parsing: subdistrict or tehsil or taluka or city_district or county
    const rawTaluka =
      addr.subdistrict ||
      addr.tehsil ||
      addr.taluka ||
      addr.city_district ||
      addr.county ||
      '';
    const taluka = cleanAdminName(rawTaluka, district);

    // Village/locality parsing: village or town or suburb or neighbourhood or locality or hamlet or quarter or residential or commercial or industrial or road
    let village =
      addr.village ||
      addr.town ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.locality ||
      addr.hamlet ||
      addr.quarter ||
      addr.residential ||
      addr.commercial ||
      addr.industrial ||
      addr.road ||
      '';

    // Fallback if village is empty: check if city is distinct from district or extract clean first part from display_name
    if (!village) {
      if (addr.city && addr.city.toLowerCase() !== district.toLowerCase()) {
        village = addr.city;
      } else if (data.display_name) {
        const firstPart = cleanAdminName(data.display_name.split(',')[0]?.trim() || '', district);
        if (
          firstPart &&
          firstPart.toLowerCase() !== district.toLowerCase() &&
          firstPart.toLowerCase() !== taluka.toLowerCase() &&
          firstPart.toLowerCase() !== state.toLowerCase() &&
          firstPart.toLowerCase() !== country.toLowerCase()
        ) {
          village = firstPart;
        }
      }
    }

    const pincode = addr.postcode || addr.postal_code || '';
    const formattedAddress = dedupeAddressParts([village, taluka, district, state, pincode, country]).join(', ');

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
 */
export async function searchLocation(query: string): Promise<SearchLocationResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'KrishiMitra-AI-Platform/1.0',
      },
    });

    if (!res.ok) return [];
    const data = await res.json();

    return data.map((item: any) => ({
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  } catch (error) {
    console.warn('Search location error:', error);
    return [];
  }
}
