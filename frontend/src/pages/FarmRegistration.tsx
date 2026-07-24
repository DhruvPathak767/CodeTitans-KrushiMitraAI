import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { LeafletMapPicker } from '@/components/map/LeafletMapPicker';
import { type FarmData } from '@/api/farm';
import { type ReverseGeocodeResult } from '@/services/geocoding';

export function FarmRegistration() {
  const { t } = useApp();
  const {
    farms,
    activeFarm,
    loading,
    pagination,
    filters,
    setFilters,
    createFarm,
    updateFarm,
    deleteFarm,
    selectActiveFarm,
  } = useFarm();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmData | null>(null);
  const [viewingMapFarm, setViewingMapFarm] = useState<FarmData | null>(null);
  const [deletingFarmId, setDeletingFarmId] = useState<string | null>(null);

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

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger search filter update
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormState({
      farmName: '',
      cropName: '',
      soilType: 'Black Soil',
      area: 5,
      areaUnit: 'ACRE',
      sowingDate: new Date().toISOString().split('T')[0],
      irrigationType: 'Drip Irrigation',
      status: 'ACTIVE',
      latitude: 22.3039,
      longitude: 70.8022,
      address: {
        formattedAddress: '',
        country: 'India',
        state: 'Gujarat',
        district: 'Rajkot',
        taluka: '',
        village: '',
        pincode: '',
      },
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (farm: FarmData) => {
    setEditingFarm(farm);
    const coords = farm.location?.coordinates || [70.8022, 22.3039];
    setFormState({
      farmName: farm.farmName,
      cropName: farm.cropName,
      soilType: farm.soilType || 'Black Soil',
      area: farm.area,
      areaUnit: farm.areaUnit || 'ACRE',
      sowingDate: farm.sowingDate ? new Date(farm.sowingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      irrigationType: farm.irrigationType || 'Drip Irrigation',
      status: farm.status || 'ACTIVE',
      latitude: coords[1],
      longitude: coords[0],
      address: {
        formattedAddress: farm.address?.formattedAddress || '',
        country: farm.address?.country || 'India',
        state: farm.address?.state || 'Gujarat',
        district: farm.address?.district || 'Rajkot',
        taluka: farm.address?.taluka || '',
        village: farm.address?.village || '',
        pincode: farm.address?.pincode || '',
      },
    });
    setFormError(null);
  };

  // Map location selection callback
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

  // Handle Form Submit (Add / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formState.farmName || formState.farmName.trim().length < 3) {
      setFormError('Farm name must be at least 3 characters long');
      return;
    }
    if (!formState.cropName) {
      setFormError('Please enter crop name');
      return;
    }
    if (formState.area <= 0) {
      setFormError('Area must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFarm) {
        await updateFarm(editingFarm._id, formState);
        setEditingFarm(null);
      } else {
        await createFarm(formState);
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setFormError(err.errors[0].message);
      } else {
        setFormError(err.message || 'Failed to save farm');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Farm
  const handleConfirmDelete = async () => {
    if (!deletingFarmId) return;
    try {
      await deleteFarm(deletingFarmId);
      setDeletingFarmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete farm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight gradient-text">
            {t('farm.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('farm.subtitle')}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenAddModal}
          className="btn-primary shadow-glow flex items-center gap-2 text-xs py-2.5 px-4 rounded-2xl shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold"
        >
          <Plus className="h-4 w-4" /> {t('farm.complete')}
        </motion.button>
      </div>

      {/* Active Farm Highlight Banner */}
      {activeFarm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 backdrop-blur shadow-[0_4px_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 z-10">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-glow shrink-0">
              <Sprout className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  ★ Active AI Farm
                </span>
                <span className="text-xs text-slate-400 font-medium">({activeFarm.cropName})</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeFarm.farmName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {activeFarm.address?.formattedAddress || `${activeFarm.address?.village || ''}, ${activeFarm.address?.district || ''}, ${activeFarm.address?.state || ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto z-10">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{t('farm.area')} & {t('farm.irrigation')}</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {activeFarm.area} {activeFarm.areaUnit || 'ACRE'} • {activeFarm.irrigationType || 'Drip'}
              </p>
            </div>
            <button
              onClick={() => setViewingMapFarm(activeFarm)}
              className="btn-glass text-xs py-2 px-3 flex items-center gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 w-full sm:w-auto justify-center rounded-xl"
            >
              <Maximize2 className="h-3.5 w-3.5" /> View Map
            </button>
          </div>
        </motion.div>
      )}

      {/* Control Bar: Search, Filters, Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder={t('common.search')}
            className="input pl-10 text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10"
          />
        </div>

        {/* Filter by Crop */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={filters.crop || ''}
            onChange={(e) => setFilters((p) => ({ ...p, crop: e.target.value, page: 1 }))}
            placeholder={`${t('farm.crop')} filter...`}
            className="input pl-10 text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10"
          />
        </div>

        {/* Filter by Status Dropdown */}
        <div className="relative">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
            className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 appearance-none pr-8 cursor-pointer font-semibold"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              All Statuses
            </option>
            <option value="ACTIVE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              ACTIVE
            </option>
            <option value="INACTIVE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              INACTIVE
            </option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value as any, page: 1 }))}
            className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 appearance-none pr-8 cursor-pointer font-semibold"
          >
            <option value="newest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              Sort: Newest First
            </option>
            <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              Sort: Oldest First
            </option>
            <option value="farmName" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
              Sort: Farm Name (A-Z)
            </option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
          <p className="text-xs font-semibold">{t('common.loading')}</p>
        </div>
      ) : farms.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center glass-strong">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
            <Sprout className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold">No Farm Records Found</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {filters.search || filters.crop || filters.status
              ? 'No farms match your search criteria.'
              : 'Register your first farm to unlock AI crop advisories, soil analytics, and live market prices.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary mt-6 shadow-glow text-xs py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold"
          >
            + {t('farm.title')}
          </button>
        </div>
      ) : (
        /* Farm Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => {
            const isActive = activeFarm?._id === farm._id;

            return (
              <motion.div
                key={farm._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl glass-strong p-5 border transition-all duration-300 relative flex flex-col justify-between shadow-card hover:shadow-glow ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                    : 'border-white/40 dark:border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white font-bold shadow-glow shrink-0">
                        <Sprout className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                          {farm.farmName}
                        </h3>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {farm.cropName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                        farm.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {farm.status}
                    </span>
                  </div>

                  {/* Address Badge */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="line-clamp-1">
                      {farm.address?.formattedAddress || `${farm.address?.village || ''}, ${farm.address?.district || ''}, ${farm.address?.state || ''}`}
                    </span>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-500/5 rounded-2xl p-3 border border-white/5 mb-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">{t('farm.area')}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {farm.area} {farm.areaUnit || 'ACRE'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">{t('farm.soil')}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {farm.soilType || 'Black Soil'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">{t('farm.irrigation')}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {farm.irrigationType || 'Drip'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">Sowing Date</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {farm.sowingDate ? new Date(farm.sowingDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => selectActiveFarm(farm._id)}
                      disabled={isActive}
                      className={`flex-1 btn-glass text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold cursor-default'
                          : 'hover:border-emerald-500/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Active Farm
                        </>
                      ) : (
                        <>
                          <Star className="h-3.5 w-3.5 text-amber-500" /> Select Active
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setViewingMapFarm(farm)}
                      className="p-2 rounded-xl btn-glass border-slate-200 dark:border-white/10 hover:border-emerald-500/40 text-emerald-500"
                      title="View Location Map"
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditModal(farm)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-500 transition-colors p-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingFarmId(farm._id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Page <strong className="text-slate-800 dark:text-white">{pagination.page}</strong> of{' '}
            <strong className="text-slate-800 dark:text-white">{pagination.totalPages}</strong> ({pagination.total} total farms)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
              disabled={pagination.page <= 1}
              className="btn-glass p-2 text-xs disabled:opacity-40 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters((p) => ({ ...p, page: Math.min(pagination.totalPages, (p.page || 1) + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="btn-glass p-2 text-xs disabled:opacity-40 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT FARM MODAL */}
      <AnimatePresence>
        {(isAddModalOpen || editingFarm) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl glass-strong p-6 border border-white/40 dark:border-white/10 shadow-card my-8"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-500">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold">
                      {editingFarm ? 'Edit Farm Record' : t('farm.title')}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {editingFarm ? 'Update farm attributes & coordinates' : t('farm.subtitle')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingFarm(null);
                  }}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-500/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* INTERACTIVE LEAFLET MAP LOCATION PICKER */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t('farm.location')} (Map Picker)
                  </label>
                  <LeafletMapPicker
                    initialLat={formState.latitude}
                    initialLng={formState.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                {/* Farm Name & Crop Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('farm.name')} *
                    </label>
                    <input
                      type="text"
                      value={formState.farmName}
                      onChange={(e) => setFormState((p) => ({ ...p, farmName: e.target.value }))}
                      placeholder="e.g. Green Valley Farm"
                      className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('farm.crop')} *
                    </label>
                    <input
                      type="text"
                      value={formState.cropName}
                      onChange={(e) => setFormState((p) => ({ ...p, cropName: e.target.value }))}
                      placeholder="e.g. Wheat, Cotton, Groundnut"
                      className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Area, Area Unit, Soil Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('farm.area')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formState.area}
                      onChange={(e) => setFormState((p) => ({ ...p, area: parseFloat(e.target.value) || 0 }))}
                      className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  {/* AREA UNIT DROPDOWN */}
                  <div className="relative">
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Unit
                    </label>
                    <div className="relative">
                      <select
                        value={formState.areaUnit}
                        onChange={(e) => setFormState((p) => ({ ...p, areaUnit: e.target.value as any }))}
                        className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 appearance-none pr-8 cursor-pointer font-semibold"
                      >
                        <option value="ACRE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          ACRE
                        </option>
                        <option value="HECTARE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          HECTARE
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* SOIL TYPE DROPDOWN */}
                  <div className="relative">
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('farm.soil')}
                    </label>
                    <div className="relative">
                      <select
                        value={formState.soilType}
                        onChange={(e) => setFormState((p) => ({ ...p, soilType: e.target.value }))}
                        className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 appearance-none pr-8 cursor-pointer font-semibold"
                      >
                        <option value="Black Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Black Soil
                        </option>
                        <option value="Red Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Red Soil
                        </option>
                        <option value="Alluvial Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Alluvial Soil
                        </option>
                        <option value="Loamy Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Loamy Soil
                        </option>
                        <option value="Sandy Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Sandy Soil
                        </option>
                        <option value="Clay Soil" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          Clay Soil
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Sowing Date, Irrigation Type, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Sowing Date *
                    </label>
                    <input
                      type="date"
                      value={formState.sowingDate}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormState((p) => ({ ...p, sowingDate: e.target.value }))}
                      className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t('farm.irrigation')}
                    </label>
                    <input
                      type="text"
                      value={formState.irrigationType}
                      onChange={(e) => setFormState((p) => ({ ...p, irrigationType: e.target.value }))}
                      placeholder="Drip, Canal, Well"
                      className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* STATUS DROPDOWN */}
                  <div className="relative">
                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={formState.status}
                        onChange={(e) => setFormState((p) => ({ ...p, status: e.target.value as any }))}
                        className="input text-xs w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 appearance-none pr-8 cursor-pointer font-semibold"
                      >
                        <option value="ACTIVE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          ACTIVE
                        </option>
                        <option value="INACTIVE" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white py-2 font-medium">
                          INACTIVE
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Auto-populated Address Details */}
                <div className="rounded-2xl bg-slate-500/5 p-3 border border-white/5 space-y-2 text-xs">
                  <p className="font-semibold text-slate-400 text-[11px] uppercase">
                    Auto-Populated Address Details (via Reverse Geocoding)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={formState.address.village}
                      onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, village: e.target.value } }))}
                      placeholder={t('farm.village')}
                      className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={formState.address.district}
                      onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, district: e.target.value } }))}
                      placeholder={t('farm.district')}
                      className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={formState.address.state}
                      onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                      placeholder={t('farm.state')}
                      className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={formState.address.pincode}
                      onChange={(e) => setFormState((p) => ({ ...p, address: { ...p.address, pincode: e.target.value } }))}
                      placeholder="Pincode"
                      className="input text-xs py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingFarm(null);
                    }}
                    className="btn-ghost text-xs py-2.5 px-4 rounded-xl"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-xs py-2.5 px-5 shadow-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingFarm ? t('common.save') : t('farm.complete')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW MAP MODAL */}
      <AnimatePresence>
        {viewingMapFarm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl glass-strong p-6 border border-white/40 dark:border-white/10 shadow-card"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-display font-extrabold text-base">{viewingMapFarm.farmName} Map View</h3>
                </div>
                <button
                  onClick={() => setViewingMapFarm(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-500/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <LeafletMapPicker
                initialLat={viewingMapFarm.location?.coordinates[1] || 22.3039}
                initialLng={viewingMapFarm.location?.coordinates[0] || 70.8022}
                onLocationSelect={() => {}}
                readOnly={true}
              />

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Crop: <strong className="text-emerald-400">{viewingMapFarm.cropName}</strong> ({viewingMapFarm.area} {viewingMapFarm.areaUnit || 'ACRE'})</span>
                <button
                  onClick={() => setViewingMapFarm(null)}
                  className="btn-primary text-xs py-1.5 px-4 rounded-xl"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingFarmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl glass-strong p-6 border border-red-500/30 shadow-card text-center space-y-4"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-500/20 text-red-500">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">Delete Farm Record?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to permanently delete this farm? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingFarmId(null)}
                  className="btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn-primary bg-red-600 hover:bg-red-500 text-white text-xs py-2 px-5 shadow-glow rounded-xl font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
