import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, ArrowRight, User, Phone, Sprout, FlaskConical, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';

export function Login() {
  const { t, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@krishimitra.ai');
  const [password, setPassword] = useState('demo1234');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  function handleLogin() {
    if (step === 'login') {
      setStep('otp');
    } else {
      login('Ramesh Patel', email, 'farmer');
      navigate('/app/dashboard');
    }
  }

  function demoLogin() {
    login('Ramesh Patel', 'demo@krishimitra.ai', 'farmer');
    navigate('/app/dashboard');
  }

  function handleOtp(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  }

  return (
    <AuthShell title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <AnimatePresence mode="wait">
        {step === 'login' ? (
          <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <Field icon={<Mail className="h-4 w-4" />} label={t('auth.email')}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label={t('auth.password')}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" />
            </Field>
            <div className="flex justify-end">
              <button className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">{t('auth.forgot')}</button>
            </div>
            <button onClick={handleLogin} className="btn-primary mt-2 w-full shadow-glow">
              {t('common.login')} <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={demoLogin} className="btn-glass mt-3 w-full border-brand-500/30 text-brand-700 dark:text-brand-300">
              <Sparkles className="h-4 w-4 text-brand-500" /> {t('auth.demo')}
            </button>
          </motion.div>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-3 text-center text-xs font-semibold text-brand-700 dark:text-brand-300">
              {t('auth.otp.sent')} · +91 98765 43210
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">{t('auth.otp.enter')}</p>
            <div className="flex justify-center gap-2 my-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  maxLength={1}
                  className="h-12 w-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-center text-base font-extrabold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              ))}
            </div>
            <button onClick={handleLogin} className="btn-primary w-full shadow-glow">
              {t('common.continue')} <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setStep('login')} className="btn-ghost w-full text-xs">
              <ArrowLeft className="h-4 w-4" /> {t('common.back')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">{t('common.signup')}</Link>
      </p>
    </AuthShell>
  );
}

export function Signup() {
  const { t, login } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  function handleSignup() {
    login(name || 'New Farmer', email || 'new@krishimitra.ai', role);
    navigate('/app/farm');
  }

  const roles = [
    { value: 'farmer', label: t('auth.role.farmer'), icon: Sprout },
    { value: 'expert', label: t('auth.role.expert'), icon: FlaskConical },
    { value: 'admin', label: t('auth.role.admin'), icon: Shield },
  ];

  return (
    <AuthShell title={t('auth.signup.title')} subtitle={t('auth.signup.subtitle')}>
      <div className="space-y-3.5">
        <Field icon={<User className="h-4 w-4" />} label={t('auth.name')}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input pl-11" placeholder="Ramesh Patel" />
        </Field>
        <Field icon={<Mail className="h-4 w-4" />} label={t('auth.email')}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" />
        </Field>
        <Field icon={<Phone className="h-4 w-4" />} label={t('auth.phone')}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input pl-11" placeholder="+91 98765 43210" />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label={t('auth.password')}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" placeholder="••••••••" />
        </Field>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Select Platform Role</p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition-all ${
                    role === r.value
                      ? 'border-brand-500 bg-brand-500/15 text-brand-700 dark:text-brand-300 shadow-glow'
                      : 'border-slate-200 dark:border-white/10 hover:border-brand-500/40'
                  }`}
                >
                  <Icon className="h-5 w-5 text-brand-500" />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={handleSignup} className="btn-primary w-full shadow-glow mt-2">
          {t('common.signup')} <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">{t('common.login')}</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { t } = useApp();
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <FutureBackground />
      <CursorSpotlight />

      <div className="absolute top-4 flex w-full items-center justify-between px-4 sm:top-6 sm:px-8 z-20">
        <Link to="/" className="flex items-center gap-2.5 rounded-2xl glass-strong px-4 py-2 border border-white/40 dark:border-white/10 shadow-card">
          <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-1.5 shadow-glow">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-extrabold gradient-text">{t('app.name')}</span>
        </Link>
        <div className="flex items-center gap-1 rounded-2xl glass-strong px-2 py-1.5 border border-white/40 dark:border-white/10">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 my-16"
      >
        <div className="rounded-3xl glass-strong p-8 border border-white/50 dark:border-white/10 shadow-card relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-500/20 filter blur-2xl pointer-events-none" />
          <h1 className="font-display text-2xl font-extrabold tracking-tight gradient-text">{title}</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500">{icon}</span>
        {children}
      </div>
    </div>
  );
}
