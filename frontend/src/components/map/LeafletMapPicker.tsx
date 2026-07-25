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
import { Search, Navigation, MapPin, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
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
  className: 'animate-bounce-short', // Marker bounce animation
});

export interface GpsTelemetry {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  isDetected: boolean;
}

interface LeafletMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (result: ReverseGeocodeResult) => void;
  onGpsTelemetry?: (telemetry: GpsTelemetry) => void;
  readOnly?: boolean;
}

/**
 * Controller component to imperatively pan/zoom Leaflet map to Level 17
 * STEP 9: Calls map.invalidateSize() to fix blank map issues when modal opens!
 */
function MapController({ center, zoom = 17 }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    map.flyTo(center, zoom, { duration: 1.5 });
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
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
  initialLat = 22.3039, // Default Gujarat center
  initialLng = 70.8022,
  onLocationSelect,
  onGpsTelemetry,
  readOnly = false,
}: LeafletMapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [addressDetails, setAddressDetails] = useState<ReverseGeocodeResult | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // STEP 9: Progress step status: 'IDLE' | 'DETECTING' | 'ACQUIRING_GPS' | 'FINDING_ADDRESS' | 'READY'
  const [statusStep, setStatusStep] = useState<'IDLE' | 'DETECTING' | 'ACQUIRING_GPS' | 'FINDING_ADDRESS' | 'READY'>('IDLE');

  // GPS Telemetry State
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [permissionDeniedModal, setPermissionDeniedModal] = useState(false);
  const [showAdvancedCoords, setShowAdvancedCoords] = useState(false);

  // Search location state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // STEP 1 & STEP 14: Auto-request location permission on mount with session caching
  useEffect(() => {
    if (readOnly) {
      setPosition([initialLat, initialLng]);
      handleLocationUpdate(initialLat, initialLng);
      return;
    }

    // Check session storage cache first
    const cachedGps = sessionStorage.getItem('krishimitra_gps_cache');
    if (cachedGps) {
      try {
        const parsed = JSON.parse(cachedGps);
        if (parsed.lat && parsed.lng) {
          setPosition([parsed.lat, parsed.lng]);
          setAccuracy(parsed.accuracy || 10);
          setTimestamp(parsed.timestamp || Date.now());
          setGpsDetected(true);
          setStatusStep('READY');
          handleLocationUpdate(parsed.lat, parsed.lng);
          if (onGpsTelemetry) {
            onGpsTelemetry({
              latitude: parsed.lat,
              longitude: parsed.lng,
              accuracy: parsed.accuracy || 10,
              timestamp: parsed.timestamp || Date.now(),
              isDetected: true,
            });
          }
          return;
        }
      } catch (e) {
        sessionStorage.removeItem('krishimitra_gps_cache');
      }
    }

    // Trigger auto GPS detection on load
    detectGpsLocation();
  }, [readOnly]);

  // Fast, instant GPS location acquisition
  const detectGpsLocation = async () => {
    if (!navigator.geolocation) {
      setPermissionDeniedModal(true);
      return;
    }

    setStatusStep('ACQUIRING_GPS');
    setLoadingAddress(true);

    const getFastPosition = (highAccuracy: boolean): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: highAccuracy,
          timeout: 6000,
          maximumAge: 10000,
        });
      });

    try {
      // 1. Try fast high accuracy position first
      let pos: GeolocationPosition;
      try {
        pos = await getFastPosition(true);
      } catch (e) {
        // Fallback to low accuracy / IP position if high accuracy times out
        pos = await getFastPosition(false);
      }

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy || 15);
      const time = pos.timestamp || Date.now();

      console.log(`[GPS Fast Acquisition] Lat=${lat}, Lng=${lng}, Accuracy=${acc}m, Timestamp=${time}`);

      setPosition([lat, lng]);
      setAccuracy(acc);
      setTimestamp(time);
      setGpsDetected(true);
      setPermissionDeniedModal(false);

      sessionStorage.setItem(
        'krishimitra_gps_cache',
        JSON.stringify({ lat, lng, accuracy: acc, timestamp: time })
      );

      if (onGpsTelemetry) {
        onGpsTelemetry({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          timestamp: time,
          isDetected: true,
        });
      }

      setStatusStep('FINDING_ADDRESS');
      await handleLocationUpdate(lat, lng);
      setStatusStep('READY');
    } catch (err: any) {
      console.warn('GPS Location acquisition failed or denied:', err.message);
      setLoadingAddress(false);
      setGpsDetected(false);
      setStatusStep('IDLE');
      setPermissionDeniedModal(true);
    }
  };

  // Reverse geocode when coordinates change
  const handleLocationUpdate = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const result = await reverseGeocode(lat, lng);
      console.log(`[Reverse Geocode Output] Village: "${result.village}", District: "${result.district}", State: "${result.state}"`);
      setAddressDetails(result);
      onLocationSelect(result);
    } catch (err) {
      console.error('Reverse geocode update error:', err);
    } finally {
      setLoadingAddress(false);
    }
  };

  // STEP 7 & 9: Marker drag handler
  const handleMarkerDragEnd = (event: any) => {
    if (readOnly) return;
    const marker = event.target;
    const newPos = marker.getLatLng();
    console.log(`[Marker Dragged] New Position: (${newPos.lat}, ${newPos.lng})`);
    setPosition([newPos.lat, newPos.lng]);
    handleLocationUpdate(newPos.lat, newPos.lng);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (readOnly) return;
    setPosition([lat, lng]);
    handleLocationUpdate(lat, lng);
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

  const QUICK_CITIES = [
    { name: 'Vadodara', lat: 22.3072, lng: 73.1811 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
    { name: 'Anand', lat: 22.5645, lng: 72.9289 },
  ];

  const handleSelectQuickCity = (city: { name: string; lat: number; lng: number }) => {
    setPosition([city.lat, city.lng]);
    handleLocationUpdate(city.lat, city.lng);
    setSearchQuery(city.name);
    setShowSearchResults(false);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-card bg-white dark:bg-slate-900">
      {/* STEP 2 & STEP 9: Status Banner & Detect Location Button */}
      {!readOnly && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Status Progress Indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-white/10 px-3 py-2 shadow-md">
              {statusStep === 'DETECTING' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Detecting location...</span>
                </div>
              )}
              {statusStep === 'ACQUIRING_GPS' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Acquiring GPS high-accuracy...</span>
                </div>
              )}
              {statusStep === 'FINDING_ADDRESS' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Finding address...</span>
                </div>
              )}
              {statusStep === 'READY' || gpsDetected ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>📍 Location Verified</span>
                  {accuracy !== null && (
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      Accuracy: {accuracy}m
                    </span>
                  )}
                </div>
              ) : statusStep === 'IDLE' ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>GPS location ready</span>
                </div>
              ) : null}
            </div>

            {/* Detect My Current Location Button */}
            <button
              type="button"
              onClick={detectGpsLocation}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-md hover:brightness-110 transition-all shrink-0 cursor-pointer"
            >
              <Navigation className="h-3.5 w-3.5 animate-pulse" />
              <span>📍 Detect My Current Location</span>
            </button>
          </div>

          {/* Search Location Input Bar */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-white/10 px-3 py-2 shadow-md">
              <Search className="h-4 w-4 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search village, city, district, state..."
                className="w-full bg-transparent text-xs font-semibold outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />}
            </div>

            {/* Search Autocomplete & Quick Jump Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-card z-[1001] p-1.5 space-y-1">
                {(!searchQuery || searchQuery.trim().length < 2) && (
                  <div>
                    <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ⚡ Quick Jump Major Cities
                    </p>
                    <div className="flex flex-wrap gap-1.5 p-1">
                      {QUICK_CITIES.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleSelectQuickCity(c)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
        </div>
      )}

      {/* STEP 7 & STEP 9: Leaflet Map Container at Zoom Level 17 with InvalidateSize */}
      <div className="h-72 sm:h-80 w-full relative z-0">
        <MapContainer
          center={position}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={position} zoom={17} />
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
            {/* STEP 10: Marker Popup Current Farm Location */}
            <Popup autoPan={true}>
              <div className="p-1.5 text-xs space-y-1">
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  📍 Current Farm Location
                </p>
                <p className="text-xs text-slate-700 font-semibold leading-snug">
                  {addressDetails?.formattedAddress || 'Selected Farm Location'}
                </p>
                {accuracy && (
                  <p className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    GPS Accuracy: {accuracy}m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* STEP 8 & STEP 11: Human-Readable Address Display Card */}
      <div className="bg-slate-900 text-white p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate font-semibold text-slate-100">
            {loadingAddress ? (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin text-emerald-400" /> Resolving address...
              </span>
            ) : (
              addressDetails?.formattedAddress || 'Position farm marker on map'
            )}
          </span>
        </div>

        {/* STEP 11: Collapsible Advanced Coordinates Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvancedCoords(!showAdvancedCoords)}
          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-emerald-400 shrink-0 transition-colors cursor-pointer"
        >
          <span>{showAdvancedCoords ? 'Hide Coordinates' : 'Advanced Details'}</span>
          {showAdvancedCoords ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Collapsible Advanced Coordinates Box */}
      {showAdvancedCoords && (
        <div className="bg-slate-950 p-2.5 text-[11px] font-mono text-emerald-400 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <span>Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}</span>
          <span>Accuracy: ±{accuracy || 15}m</span>
          <span>Timestamp: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Live'}</span>
        </div>
      )}

      {/* STEP 12: Permission Denied Dialog */}
      {permissionDeniedModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Enable Location Permission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  We couldn't access your current location. Please allow browser location access or search for your farm village manually.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPermissionDeniedModal(false)}
                className="btn-ghost text-xs py-2 px-3.5 rounded-xl text-slate-600 dark:text-slate-300"
              >
                Search manually
              </button>
              <button
                type="button"
                onClick={() => {
                  setPermissionDeniedModal(false);
                  detectGpsLocation();
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
