import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { dictionaries, type Lang } from './dictionaries';

type Theme = 'light' | 'dark';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr';
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  user: { name: string; email: string; role: string } | null;
  login: (name: string, email: string, role: string) => void;
  logout: () => void;
  farm: { name: string; village: string; district: string; state: string; area: number; crop: string; soil: string; irrigation: string; registered: boolean } | null;
  registerFarm: (f: Omit<NonNullable<AppContextValue['farm']>, 'registered'>) => void;
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
  const [user, setUser] = useState<AppContextValue['user']>(() => load(STORAGE.user, null));
  const [farm, setFarm] = useState<AppContextValue['farm']>(() => load(STORAGE.farm, null));

  useEffect(() => {
    localStorage.setItem(STORAGE.lang, JSON.stringify(lang));
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE.theme, JSON.stringify(theme));
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE.user, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE.farm, JSON.stringify(farm));
  }, [farm]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleTheme = useCallback(
    () => setThemeState((p) => (p === 'light' ? 'dark' : 'light')),
    [],
  );
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const t = useCallback(
    (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang],
  );
  const login = useCallback((name: string, email: string, role: string) => {
    setUser({ name, email, role });
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const registerFarm = useCallback(
    (f: Omit<NonNullable<AppContextValue['farm']>, 'registered'>) => {
      setFarm({ ...f, registered: true });
    },
    [],
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
        login,
        logout,
        farm,
        registerFarm,
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
