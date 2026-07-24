import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type FarmData,
  type FarmQueryParams,
  getFarmsApi,
  createFarmApi,
  updateFarmApi,
  deleteFarmApi,
  selectActiveFarmApi,
  checkFarmStatusApi,
} from '@/api/farm';
import { useApp } from '@/i18n/AppContext';

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FarmContextValue {
  farms: FarmData[];
  activeFarm: FarmData | null;
  hasFarm: boolean | null;
  loading: boolean;
  checkingOnboarding: boolean;
  pagination: PaginationState;
  filters: FarmQueryParams;
  setFilters: React.Dispatch<React.SetStateAction<FarmQueryParams>>;
  fetchFarms: (params?: FarmQueryParams) => Promise<void>;
  checkOnboardingStatus: () => Promise<{ hasFarm: boolean; farmCount: number }>;
  createFarm: (data: Partial<FarmData>) => Promise<FarmData>;
  updateFarm: (id: string, data: Partial<FarmData>) => Promise<FarmData>;
  deleteFarm: (id: string) => Promise<void>;
  selectActiveFarm: (id: string) => Promise<void>;
}

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [activeFarm, setActiveFarm] = useState<FarmData | null>(null);
  const [hasFarm, setHasFarm] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<FarmQueryParams>({
    search: '',
    crop: '',
    state: '',
    status: '',
    sort: 'newest',
    page: 1,
    limit: 10,
  });

  const checkOnboardingStatus = useCallback(async () => {
    if (!user) {
      setHasFarm(null);
      setCheckingOnboarding(false);
      return { hasFarm: false, farmCount: 0 };
    }
    try {
      const res = await checkFarmStatusApi();
      if (res.data) {
        setHasFarm(res.data.hasFarm);
        if (res.data.activeFarm) {
          setActiveFarm(res.data.activeFarm);
          localStorage.setItem('km_active_farm_id', res.data.activeFarm._id);
        }
        return { hasFarm: res.data.hasFarm, farmCount: res.data.farmCount };
      }
    } catch (err) {
      console.error('Failed to check farm status:', err);
    } finally {
      setCheckingOnboarding(false);
    }
    return { hasFarm: false, farmCount: 0 };
  }, [user]);

  const fetchFarms = useCallback(
    async (params?: FarmQueryParams) => {
      if (!user) return;
      setLoading(true);
      try {
        const mergedParams = { ...filters, ...params };
        const res = await getFarmsApi(mergedParams);
        if (res.data) {
          setFarms(res.data.farms);
          setHasFarm(res.data.farms.length > 0);
          setPagination({
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages,
          });

          if (user.activeFarm) {
            const activeId = typeof user.activeFarm === 'string' ? user.activeFarm : (user.activeFarm as any)._id;
            const matched = res.data.farms.find((f) => f._id === activeId);
            setActiveFarm(matched || res.data.farms[0] || null);
          } else if (res.data.farms.length > 0) {
            setActiveFarm(res.data.farms[0]);
          } else {
            setActiveFarm(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      } finally {
        setLoading(false);
      }
    },
    [user, filters]
  );

  useEffect(() => {
    if (user) {
      checkOnboardingStatus().then(() => fetchFarms());
    } else {
      setFarms([]);
      setActiveFarm(null);
      setHasFarm(null);
      setCheckingOnboarding(false);
    }
  }, [user]);

  const handleCreateFarm = async (data: Partial<FarmData>): Promise<FarmData> => {
    const res = await createFarmApi(data);
    if (!res.data?.farm) throw new Error('Failed to create farm');
    setHasFarm(true);
    setActiveFarm(res.data.farm);
    localStorage.setItem('km_active_farm_id', res.data.farm._id);
    await fetchFarms();
    return res.data.farm;
  };

  const handleUpdateFarm = async (id: string, data: Partial<FarmData>): Promise<FarmData> => {
    const res = await updateFarmApi(id, data);
    if (!res.data?.farm) throw new Error('Failed to update farm');
    await fetchFarms();
    return res.data.farm;
  };

  const handleDeleteFarm = async (id: string): Promise<void> => {
    const res = await deleteFarmApi(id);
    const remaining = res.data?.remainingCount ?? 0;
    if (remaining === 0) {
      setHasFarm(false);
      setActiveFarm(null);
      localStorage.removeItem('km_active_farm_id');
    }
    await fetchFarms();
  };

  const handleSelectActiveFarm = async (id: string): Promise<void> => {
    const res = await selectActiveFarmApi(id);
    if (res.data?.activeFarm) {
      setActiveFarm(res.data.activeFarm);
      localStorage.setItem('km_active_farm_id', res.data.activeFarm._id);
    }
    await fetchFarms();
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        activeFarm,
        hasFarm,
        loading,
        checkingOnboarding,
        pagination,
        filters,
        setFilters,
        fetchFarms,
        checkOnboardingStatus,
        createFarm: handleCreateFarm,
        updateFarm: handleUpdateFarm,
        deleteFarm: handleDeleteFarm,
        selectActiveFarm: handleSelectActiveFarm,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error('useFarm must be used within FarmProvider');
  return ctx;
}
