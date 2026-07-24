import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, MapPin, Loader2 } from 'lucide-react';
import {
  reverseGeocode,
  searchLocation,
  type ReverseGeocodeResult,
  type SearchLocationResult,
} from '@/services/geocoding';

// Fix Leaflet default marker icon URL issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customGreenMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (result: ReverseGeocodeResult) => void;
  readOnly?: boolean;
}

/**
 * Controller component to imperatively pan/zoom Leaflet map
 */
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

/**
 * Handler for user clicking on Leaflet map
 */
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LeafletMapPicker({
  initialLat = 22.3039, // Default Rajkot, Gujarat
  initialLng = 70.8022,
  onLocationSelect,
  readOnly = false,
}: LeafletMapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [addressDetails, setAddressDetails] = useState<ReverseGeocodeResult | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Search location state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Update position when props change
  useEffect(() => {
    setPosition([initialLat, initialLng]);
    handleLocationUpdate(initialLat, initialLng);
  }, [initialLat, initialLng]);

  // Reverse geocode when coordinates change
  const handleLocationUpdate = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const result = await reverseGeocode(lat, lng);
      setAddressDetails(result);
      onLocationSelect(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMarkerDragEnd = (event: any) => {
    if (readOnly) return;
    const marker = event.target;
    const newPos = marker.getLatLng();
    setPosition([newPos.lat, newPos.lng]);
    handleLocationUpdate(newPos.lat, newPos.lng);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (readOnly) return;
    setPosition([lat, lng]);
    handleLocationUpdate(lat, lng);
  };

  // Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingAddress(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        handleLocationUpdate(lat, lng);
      },
      (error) => {
        alert(`Location access denied or unavailable: ${error.message}`);
        setLoadingAddress(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search input change handler with debouncing
  const searchTimeoutRef = useRef<any>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocation(val);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchResults(true);
    }, 400);
  };

  const handleSelectSearchResult = (result: SearchLocationResult) => {
    setPosition([result.latitude, result.longitude]);
    handleLocationUpdate(result.latitude, result.longitude);
    setSearchQuery(result.displayName);
    setShowSearchResults(false);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-card">
      {/* Top Overlay Bar: Search Location & Current Location Button */}
      {!readOnly && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row gap-2">
          {/* Location Search Bar */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-white/10 px-3 py-2 shadow-md">
              <Search className="h-4 w-4 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Search village, city, district, state..."
                className="w-full bg-transparent text-xs font-semibold outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />}
            </div>

            {/* Search Autocomplete Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-card z-[1001] p-1">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="flex items-start gap-2 w-full text-left p-2 hover:bg-emerald-500/10 rounded-lg text-xs font-medium transition-colors border-b last:border-0 border-slate-100 dark:border-white/5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="truncate text-slate-700 dark:text-slate-200">{res.displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Use My Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-md hover:brightness-110 transition-all shrink-0"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Use Current Location</span>
          </button>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div className="h-72 sm:h-80 w-full relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={position} />
          {!readOnly && <MapClickHandler onMapClick={handleMapClick} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
            icon={customGreenMarker}
            draggable={!readOnly}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          >
            <Popup>
              <div className="p-1 text-xs">
                <p className="font-bold text-emerald-700">🌱 Farm Location Marker</p>
                <p className="text-[11px] text-slate-600 font-semibold">{addressDetails?.formattedAddress || 'Drag or click to position'}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Bottom Address Info Banner */}
      <div className="bg-slate-900/90 text-white p-3 text-xs flex items-center justify-between border-t border-white/10">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate font-medium">
            {loadingAddress ? (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin text-emerald-400" /> Fetching location details...
              </span>
            ) : (
              addressDetails?.formattedAddress || 'Position farm marker on map'
            )}
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 shrink-0 pl-2">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </span>
      </div>
    </div>
  );
}
