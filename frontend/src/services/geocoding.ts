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
    const state = addr.state || addr.region || '';
    const district = addr.state_district || addr.district || addr.county || '';
    const taluka = addr.subdistrict || addr.county || addr.city_district || '';
    const village = addr.village || addr.town || addr.suburb || addr.city || addr.hamlet || '';
    const pincode = addr.postcode || '';

    return {
      formattedAddress: data.display_name || `${village}, ${district}, ${state}`,
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
      state: 'Gujarat',
      district: 'Rajkot',
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
