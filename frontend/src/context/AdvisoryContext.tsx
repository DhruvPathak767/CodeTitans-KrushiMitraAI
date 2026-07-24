import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAdvisoryApi, refreshAdvisoryApi, AdvisoryResponse } from '@/api/advisory';
import { useFarm } from '@/context/FarmContext';
import { useApp } from '@/i18n/AppContext';

interface AdvisoryContextType {
  advisoryData: AdvisoryResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshAdvisory: () => Promise<void>;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

export const AdvisoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { activeFarm } = useFarm();
  const { lang } = useApp();
  const [advisoryData, setAdvisoryData] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisory = async (showLoading = true) => {
    if (!activeFarm) return;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await getAdvisoryApi(lang);
      setAdvisoryData(data);
    } catch (err: any) {
      console.error('Failed to fetch AI Crop Advisory:', err);
      setError(err?.response?.data?.message || 'Failed to fetch AI Advisory');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const refreshAdvisory = async () => {
    if (!activeFarm) return;
    setRefreshing(true);
    setError(null);
    try {
      const data = await refreshAdvisoryApi(lang);
      setAdvisoryData(data);
    } catch (err: any) {
      console.error('Failed to refresh AI Crop Advisory:', err);
      setError(err?.response?.data?.message || 'Failed to refresh AI Advisory');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeFarm?._id) {
      fetchAdvisory(true);
    }
  }, [activeFarm?._id, lang]);

  return (
    <AdvisoryContext.Provider
      value={{
        advisoryData,
        loading,
        refreshing,
        error,
        refreshAdvisory,
      }}
    >
      {children}
    </AdvisoryContext.Provider>
  );
};

export const useAdvisory = () => {
  const context = useContext(AdvisoryContext);
  if (!context) {
    throw new Error('useAdvisory must be used within an AdvisoryProvider');
  }
  return context;
};
