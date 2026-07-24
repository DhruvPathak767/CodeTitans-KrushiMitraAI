import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Leaf,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { LeafletMapPicker } from '@/components/map/LeafletMapPicker';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { type ReverseGeocodeResult } from '@/services/geocoding';

export function OnboardingFarm() {
  const { user, t, lang } = useApp();
  const { createFarm } = useFarm();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formState, setFormState] = useState({
    farmName: '',
    cropName: '',
    soilType: 'Black Soil',
    area: 5,
    areaUnit: 'ACRE' as 'ACRE' | 'HECTARE',
    sowingDate: new Date().toISOString().split('T')[0],
    irrigationType: 'Drip Irrigation',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    latitude: 22.3039,
    longitude: 70.8022,
    address: {
      formattedAddress: '',
      country: 'India',
      state: 'Gujarat',
      district: 'Rajkot',
      taluka: '',
      village: 'Kankot',
      pincode: '360005',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (geo: ReverseGeocodeResult) => {
    setFormState((prev) => ({
      ...prev,
      latitude: geo.latitude,
      longitude: geo.longitude,
      address: {
        formattedAddress: geo.formattedAddress,
        country: geo.country || 'India',
        state: geo.state || prev.address.state,
        district: geo.district || prev.address.district,
        taluka: geo.taluka || prev.address.taluka,
        village: geo.village || prev.address.village,
        pincode: geo.pincode || prev.address.pincode,
      },
    }));
  };

  const handleNextToLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formState.farmName || formState.farmName.trim().length < 3) {
      setError('Farm name must be at least 3 characters long');
      return;
    }
    if (!formState.cropName) {
      setError('Please enter crop name');
      return;
    }
    if (formState.area <= 0) {
      setError('Area must be greater than zero');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmitFirstFarm = async () => {
    setError(null);
    setLoading(true);

    try {
      await createFarm(formState);
      setCurrentStep(3);
      setTimeout(() => {
        navigate('/app/dashboard', { replace: true });
      }, 1500);
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Failed to register farm');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Animated Background Mesh & Cursor Spotlight */}
      <FutureBackground />
      <CursorSpotlight />

      {/* Top Header Controls Bar (Theme Toggle & Language Switcher) */}
      <div className="absolute top-4 flex w-full items-center justify-between px-4 sm:top-6 sm:px-8 z-30">
        <Link to="/" className="flex items-center gap-2.5 rounded-2xl glass-strong px-4 py-2 border border-slate-200/60 dark:border-white/10 shadow-card">
          <div className="grid place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-1.5 shadow-glow">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-extrabold gradient-text">KrishiMitra AI</span>
        </Link>

        <div className="flex items-center gap-1 rounded-2xl glass-strong px-2 py-1.5 border border-slate-200/60 dark:border-white/10 shadow-card">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 relative overflow-hidden backdrop-blur-xl p-6 sm:p-8 my-16"
      >
        {/* Decorative Glow Spheres */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 filter blur-3xl pointer-events-none" />

        {/* Onboarding Heading */}
        <div className="text-center mb-6 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2"
          >
            <Sparkles className="h-3.5 w-3.5" /> {t('onboard.badge')}
          </motion.div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">
            {t('onboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5 max-w-md mx-auto">
            {t('onboard.subtitle')}
          </p>
        </div>

        {/* CLEAN 3-STEP PROGRESS INDICATOR (Seamless Light & Dark Theme) */}
        <div className="max-w-md mx-auto mb-8 relative px-4">
          {/* Progress Connecting Line */}
          <div className="absolute top-[20px] left-10 right-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-[0_0_12px_#34d399]"
              initial={{ width: '0%' }}
              animate={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          <div className="flex items-center justify-between relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  currentStep === 1
                    ? {
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          '0 0 10px rgba(52,211,153,0.4)',
                          '0 0 25px rgba(52,211,153,0.8)',
                          '0 0 10px rgba(52,211,153,0.4)',
                        ],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer ${
                  currentStep >= 1
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                }`}
              >
                {currentStep > 1 ? <Check className="h-5 w-5 stroke-[3]" /> : '1'}
              </motion.div>
              <span className={`text-[11px] font-semibold transition-colors duration-300 ${currentStep >= 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                {t('onboard.step1')}
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  currentStep === 2
                    ? {
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          '0 0 10px rgba(52,211,153,0.4)',
                          '0 0 25px rgba(52,211,153,0.8)',
                          '0 0 10px rgba(52,211,153,0.4)',
                        ],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer ${
                  currentStep >= 2
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                }`}
              >
                {currentStep > 2 ? <Check className="h-5 w-5 stroke-[3]" /> : '2'}
              </motion.div>
              <span className={`text-[11px] font-semibold transition-colors duration-300 ${currentStep >= 2 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                {t('onboard.step2')}
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={
                  currentStep === 3
                    ? {
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          '0 0 10px rgba(52,211,153,0.4)',
                          '0 0 25px rgba(52,211,153,0.8)',
                          '0 0 10px rgba(52,211,153,0.4)',
                        ],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer ${
                  currentStep === 3
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                }`}
              >
                3
              </motion.div>
              <span className={`text-[11px] font-semibold transition-colors duration-300 ${currentStep === 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                {t('onboard.step3')}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-600 dark:text-red-400 shadow-md"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* STEP 1: FARM DETAILS FORM */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onSubmit={handleNextToLocation}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Farm Name *
                  </label>
                  <input
                    type="text"
                    value={formState.farmName}
                    onChange={(e) => setFormState((p) => ({ ...p, farmName: e.target.value }))}
                    placeholder="e.g. Green Acres Farm"
                    className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    value={formState.cropName}
                    onChange={(e) => setFormState((p) => ({ ...p, cropName: e.target.value }))}
                    placeholder="e.g. Wheat, Cotton, Groundnut"
                    className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Farm Area *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formState.area}
                    onChange={(e) => setFormState((p) => ({ ...p, area: parseFloat(e.target.value) || 0 }))}
                    className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500"
                    required
                  />
                </div>

                {/* AREA UNIT DROPDOWN */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Area Unit
                  </label>
                  <div className="relative">
                    <select
                      value={formState.areaUnit}
                      onChange={(e) => setFormState((p) => ({ ...p, areaUnit: e.target.value as any }))}
                      className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500 appearance-none pr-8 cursor-pointer font-medium"
                    >
                      <option value="ACRE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        ACRE
                      </option>
                      <option value="HECTARE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        HECTARE
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                  </div>
                </div>

                {/* SOIL TYPE DROPDOWN */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Soil Type
                  </label>
                  <div className="relative">
                    <select
                      value={formState.soilType}
                      onChange={(e) => setFormState((p) => ({ ...p, soilType: e.target.value }))}
                      className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500 appearance-none pr-8 cursor-pointer font-medium"
                    >
                      <option value="Black Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Black Soil
                      </option>
                      <option value="Red Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Red Soil
                      </option>
                      <option value="Alluvial Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Alluvial Soil
                      </option>
                      <option value="Loamy Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Loamy Soil
                      </option>
                      <option value="Sandy Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Sandy Soil
                      </option>
                      <option value="Clay Soil" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium">
                        Clay Soil
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sowing Date *
                  </label>
                  <input
                    type="date"
                    value={formState.sowingDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormState((p) => ({ ...p, sowingDate: e.target.value }))}
                    className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Irrigation System
                  </label>
                  <input
                    type="text"
                    value={formState.irrigationType}
                    onChange={(e) => setFormState((p) => ({ ...p, irrigationType: e.target.value }))}
                    placeholder="Drip, Canal, Well"
                    className="input text-xs w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-emerald-500"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                className="btn-primary w-full shadow-glow py-3.5 mt-4 flex items-center justify-center gap-2 text-xs font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110 transition-all cursor-pointer"
              >
                Continue to Location Selection <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.form>
          )}

          {/* STEP 2: INTERACTIVE LEAFLET MAP & LOCATION */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pin Your Farm Location on Interactive Map (Search or Drag Marker)
                </label>
                <LeafletMapPicker
                  initialLat={formState.latitude}
                  initialLng={formState.longitude}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* Auto-populated Address Overview */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/80 p-4 border border-slate-200 dark:border-white/10 space-y-2 text-xs shadow-inner">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase flex items-center gap-1.5 tracking-wider">
                  <MapPin className="h-3.5 w-3.5" /> Auto-Populated Address Details (via Reverse Geocoding)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <input
                    type="text"
                    value={formState.address.village}
                    onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, village: e.target.value } }))}
                    placeholder="Village"
                    className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
                  />
                  <input
                    type="text"
                    value={formState.address.district}
                    onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, district: e.target.value } }))}
                    placeholder="District"
                    className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
                  />
                  <input
                    type="text"
                    value={formState.address.state}
                    onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                    placeholder="State"
                    className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
                  />
                  <input
                    type="text"
                    value={formState.address.pincode}
                    onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, pincode: e.target.value } }))}
                    placeholder="Pincode"
                    className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-ghost text-xs py-3 px-4 flex items-center gap-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={handleSubmitFirstFarm}
                  disabled={loading}
                  className="btn-primary flex-1 shadow-glow py-3.5 flex items-center justify-center gap-2 text-xs font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      Register First Farm <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUCCESSFUL COMPLETION */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_0_30px_rgba(52,211,153,0.6)]"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Farm Registered Successfully! 🎉
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto">
                Your farm <strong>"{formState.farmName}"</strong> has been set as your active AI farm context. Redirecting to your dashboard...
              </p>
              <div className="flex justify-center pt-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
