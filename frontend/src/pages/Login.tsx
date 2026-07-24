import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Mail,
  Lock,
  ArrowRight,
  User,
  Phone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Globe,
  ChevronDown,
  RotateCw,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import {
  loginApi,
  signupApi,
  verifyOtpApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@/api/auth';

/**
 * Interactive LED Password Strength Indicator Component
 */
function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null;

  const requirements = [
    { id: 'length', label: '8+ characters', pass: password.length >= 8 },
    { id: 'upper', label: 'Uppercase letter (A-Z)', pass: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Lowercase letter (a-z)', pass: /[a-z]/.test(password) },
    { id: 'number', label: 'Number (0-9)', pass: /\d/.test(password) },
    { id: 'special', label: 'Special symbol (@$!%*?&#)', pass: /[@$!%*?&#]/.test(password) },
  ];

  const passedCount = requirements.filter((r) => r.pass).length;
  const isFullyStrong = passedCount === requirements.length;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2.5 space-y-2 rounded-2xl border border-slate-200/60 bg-slate-50/90 dark:border-white/10 dark:bg-slate-900/80 p-3.5 text-xs shadow-inner"
    >
      <div className="flex items-center justify-between font-semibold">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Password Strength</span>
        <span
          className={`text-[11px] font-bold ${
            isFullyStrong
              ? 'text-emerald-500 dark:text-emerald-400'
              : passedCount >= 3
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-rose-500 dark:text-rose-400'
          }`}
        >
          {isFullyStrong ? 'Strong' : passedCount >= 3 ? 'Medium' : 'Weak'} ({passedCount}/5)
        </span>
      </div>

      {/* Segmented Strength Bar */}
      <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`flex-1 transition-all duration-300 ${
              req.pass
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'bg-slate-300 dark:bg-slate-700/50'
            }`}
          />
        ))}
      </div>

      {/* Individual LED Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req) => (
          <div key={req.id} className="flex items-center gap-2 text-[11px] font-medium">
            {/* LED Glow Light */}
            <span
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 shrink-0 ${
                req.pass
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] scale-110'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
            <span
              className={`transition-colors duration-200 ${
                req.pass
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Login() {
  const { t, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { email?: string; step?: 'login' | 'otp'; message?: string } | null;

  const [email, setEmail] = useState(locationState?.email || '');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | 'otp' | 'forgot' | 'reset'>(locationState?.step || 'login');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(locationState?.message || null);

  // Handle Login submission
  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.data?.user) {
        login(res.data.user);
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('not verified')) {
        setStep('otp');
        setSuccessMsg('Email is not verified yet. A 6-digit OTP code has been sent to your email.');
      } else if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP Verification submission
  async function handleVerifyOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpApi({ email, otp: otpCode });
      setSuccessMsg(res.message || 'OTP verified successfully! Logging you in...');
      
      // Auto login after verification
      if (password) {
        const loginRes = await loginApi({ email, password });
        if (loginRes.data?.user) {
          login(loginRes.data.user);
          navigate('/app/dashboard');
          return;
        }
      }

      setStep('login');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  // Handle Resend OTP
  async function handleResendOtp() {
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      setSuccessMsg(res.message || 'A fresh OTP code has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  // Handle Forgot Password submission
  async function handleForgotPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email) {
      setError('Please enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      setSuccessMsg(res.message || 'Reset code sent to your email.');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  }

  // Handle Reset Password submission
  async function handleResetPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    if (!newPassword) {
      setError('Please enter your new password');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({ email, otp: otpCode, newPassword });
      setSuccessMsg(res.message || 'Password reset successfully! Please log in.');
      setStep('login');
      setPassword('');
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Password reset failed');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(i: number, v: string) {
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
      {/* Alert Banners */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleLogin} className="space-y-4">
            <Field icon={<Mail className="h-4 w-4" />} label={t('auth.email')}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" required />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label={t('auth.password')}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" placeholder="Enter your password" required />
            </Field>
            <div className="flex justify-end">
              <button type="button" onClick={() => setStep('forgot')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full shadow-glow flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> {t('common.login')} <ArrowRight className="h-4 w-4" /> </>}
            </button>
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-3 text-center text-xs font-semibold text-brand-700 dark:text-brand-300">
              Verification Code sent to {email || 'your email'}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Enter 6-Digit Verification Code</p>
            <div className="flex justify-center gap-2 my-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                  className="h-12 w-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-center text-base font-extrabold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full shadow-glow flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> Verify OTP <ArrowRight className="h-4 w-4" /> </>}
            </button>
            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={handleResendOtp} disabled={loading} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                <RotateCw className="h-3 w-3" /> Resend OTP Code
              </button>
              <button type="button" onClick={() => setStep('login')} className="btn-ghost text-xs flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </button>
            </div>
          </motion.form>
        )}

        {step === 'forgot' && (
          <motion.form key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleForgotPassword} className="space-y-4">
            <Field icon={<Mail className="h-4 w-4" />} label={t('auth.email')}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" required />
            </Field>
            <button type="submit" disabled={loading} className="btn-primary w-full shadow-glow flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> Send Reset Code <ArrowRight className="h-4 w-4" /> </>}
            </button>
            <button type="button" onClick={() => setStep('login')} className="btn-ghost w-full text-xs flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </button>
          </motion.form>
        )}

        {step === 'reset' && (
          <motion.form key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">Enter 6-Digit OTP Code Sent to Email</p>
            <div className="flex justify-center gap-2 my-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                  className="h-12 w-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-center text-base font-extrabold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              ))}
            </div>
            <Field icon={<KeyRound className="h-4 w-4" />} label="New Password">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input pl-11" placeholder="Enter new password" required />
            </Field>
            <PasswordStrengthIndicator password={newPassword} />
            <button type="submit" disabled={loading} className="btn-primary w-full shadow-glow flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> Reset Password <ArrowRight className="h-4 w-4" /> </>}
            </button>
            <button type="button" onClick={() => setStep('login')} className="btn-ghost w-full text-xs flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </button>
          </motion.form>
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
  const { t } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await signupApi({
        name,
        email,
        phone,
        password,
        preferredLanguage,
      });

      navigate('/login', {
        state: {
          email,
          step: 'otp',
          message: res.message || 'Account created successfully! Please enter the 6-digit OTP sent to your email address to verify your account.',
        },
      });
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t('auth.signup.title')} subtitle={t('auth.signup.subtitle')}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-3.5">
        <Field icon={<User className="h-4 w-4" />} label={t('auth.name')}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input pl-11" placeholder="Enter your full name" required />
        </Field>
        <Field icon={<Mail className="h-4 w-4" />} label={t('auth.email')}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" required />
        </Field>
        <Field icon={<Phone className="h-4 w-4" />} label={t('auth.phone')}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input pl-11" placeholder="Enter 10-digit mobile number" required />
        </Field>
        <div>
          <Field icon={<Lock className="h-4 w-4" />} label={t('auth.password')}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" placeholder="Create a strong password" required />
          </Field>
          <PasswordStrengthIndicator password={password} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">Preferred Language</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500 z-10">
              <Globe className="h-4 w-4" />
            </span>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="input pl-11 pr-8 w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer focus:border-brand-500 text-xs font-semibold appearance-none"
            >
              <option value="English" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2">
                English
              </option>
              <option value="Hindi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2">
                Hindi
              </option>
              <option value="Gujarati" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2">
                Gujarati
              </option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full shadow-glow mt-2 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> {t('common.signup')} <ArrowRight className="h-4 w-4" /> </>}
        </button>
        <p className="mt-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">{t('common.login')}</Link>
        </p>
      </form>
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
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500 z-10">{icon}</span>
        {children}
      </div>
    </div>
  );
}
