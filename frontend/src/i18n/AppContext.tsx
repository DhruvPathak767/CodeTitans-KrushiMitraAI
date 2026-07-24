import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { dictionaries, type Lang } from './dictionaries';
import {
  type UserProfile,
  getProfileApi,
  refreshTokenApi,
  logoutApi,
  getAccessToken,
  clearTokens,
} from '@/api/auth';

type Theme = 'light' | 'dark';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr';
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
  farm: {
    name: string;
    village: string;
    district: string;
    state: string;
    area: number;
    crop: string;
    soil: string;
    irrigation: string;
    registered: boolean;
  } | null;
  registerFarm: (f: Omit<NonNullable<AppContextValue['farm']>, 'registered'>) => void;
  loadingUser: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE = { lang: 'km_lang', theme: 'km_theme', user: 'km_user', farm: 'km_farm' };

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => load<Lang>(STORAGE.lang, 'en'));
  const [theme, setThemeState] = useState<Theme>(() => load<Theme>(STORAGE.theme, 'light'));
  const [user, setUserState] = useState<UserProfile | null>(() => load(STORAGE.user, null));
  const [farm, setFarm] = useState<AppContextValue['farm']>(() => load(STORAGE.farm, null));
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // Sync user with backend profile on initial mount
  useEffect(() => {
    async function initAuth() {
      const token = getAccessToken();
      if (!token) {
        setLoadingUser(false);
        return;
      }
      try {
        const res = await getProfileApi();
        if (res.data?.user) {
          setUserState(res.data.user);
        }
      } catch (err: any) {
        // Try refreshing token if expired
        try {
          await refreshTokenApi();
          const res = await getProfileApi();
          if (res.data?.user) {
            setUserState(res.data.user);
          }
        } catch {
          clearTokens();
          setUserState(null);
        }
      } finally {
        setLoadingUser(false);
      }
    }
    initAuth();
  }, []);

  useEffect(() => {
    // Keep html lang attribute in sync
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE.theme, JSON.stringify(theme));
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE.user);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE.farm, JSON.stringify(farm));
  }, [farm]);

  const setLang = useCallback((l: Lang) => {
    // Write synchronously to localStorage BEFORE state update so
    // getStoredLang() reads the correct value immediately on the next fetch.
    localStorage.setItem(STORAGE.lang, JSON.stringify(l));
    setLangState(l);
  }, []);
  const toggleTheme = useCallback(
    () => setThemeState((p) => (p === 'light' ? 'dark' : 'light')),
    []
  );
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const t = useCallback(
    (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang]
  );

  const setUser = useCallback((u: UserProfile | null) => {
    setUserState(u);
  }, []);

  const login = useCallback((userData: UserProfile) => {
    setUserState(userData);
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUserState(null);
  }, []);

  const registerFarm = useCallback(
    (f: Omit<NonNullable<AppContextValue['farm']>, 'registered'>) => {
      setFarm({ ...f, registered: true });
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        dir: 'ltr',
        theme,
        toggleTheme,
        setTheme,
        user,
        setUser,
        login,
        logout,
        farm,
        registerFarm,
        loadingUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
