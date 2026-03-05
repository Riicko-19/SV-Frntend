/**
 * views/Login.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 1 — Frosted glass login screen with mock OTP flow.
 *
 * Flow:
 *   Step 1 — Enter mobile number → "Send OTP"
 *   Step 2 — Enter 6-digit OTP  → "Verify & Login" (mock: any 6 digits pass)
 *
 * Demo shortcuts (bottom of card):
 *   "Quick Login as Borrower"   → sets role=borrower,  bypass OTP
 *   "Quick Login as NGO Admin"  → sets role=ngo_admin, bypass OTP
 *
 * Props consumed from AppContext:
 *   login(role) — sets isAuthenticated=true and userRole
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, RefreshCw, Zap, Building2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard    from '../components/atoms/GlassCard';
import ActionButton from '../components/atoms/ActionButton';

// ── OTP 6-box input ───────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);

  const handleKey = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      // Backspace — move left
      const next = [...value];
      next[idx] = '';
      onChange(next.join(''));
      if (idx > 0) inputs.current[idx - 1]?.focus();
      return;
    }
    const next = [...value];
    next[idx] = val[0];
    onChange(next.join(''));
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleKey(e, i)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) {
              inputs.current[i - 1]?.focus();
            }
          }}
          className={[
            'w-11 h-12 rounded-xl border-2 text-center text-lg font-bold font-sans',
            'bg-white/70 text-stone-800',
            'focus:outline-none focus:border-emerald-400 focus:bg-white',
            value[i] ? 'border-emerald-300' : 'border-stone-200',
            'transition-colors duration-150',
          ].join(' ')}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ── Demo quick-login pill ─────────────────────────────────────────────────────
function DemoLoginButton({ icon: Icon, label, subLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 flex flex-col items-center gap-1',
        'px-3 py-3 rounded-xl',
        'bg-emerald-50/70 hover:bg-emerald-100/80',
        'border border-emerald-200/60',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
      ].join(' ')}
    >
      <Icon size={18} className="text-emerald-600" strokeWidth={2} aria-hidden="true" />
      <span className="text-xs font-bold text-emerald-800 leading-tight text-center">{label}</span>
      <span className="text-[10px] text-stone-400 leading-tight text-center">{subLabel}</span>
    </button>
  );
}

// ── View ──────────────────────────────────────────────────────────────────────
export default function Login() {
  const { login } = useApp();

  const [step, setStep]         = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // ── Step 1: Send OTP (mock 1s delay) ───────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStep('otp');
  };

  // ── Step 2: Verify OTP (mock: any 6 digits = valid) ──────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    login('borrower'); // default role when using real OTP path
  };

  // ── Demo shortcuts ──────────────────────────────────────────────────────────
  const handleQuickLogin = (role) => login(role);

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
      {/* Soft emerald bloom */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 20%, rgba(16,185,129,0.08) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-md mx-auto w-full flex flex-col flex-1 px-5 pt-16 pb-10 relative">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          {/* Logo pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50/80 border border-emerald-200/60 rounded-full mb-5">
            <ShieldCheck size={14} className="text-emerald-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-emerald-700 tracking-wide">SheVest</span>
          </div>

          <h1 className="text-2xl font-bold text-emerald-950">Welcome back</h1>
          <p className="text-sm text-stone-500 mt-1">
            {step === 'phone'
              ? 'Enter your mobile number to continue'
              : `OTP sent to +91 ${phone.slice(-10)}`}
          </p>
        </motion.div>

        {/* ── Auth card ──────────────────────────────────────────────────── */}
        <GlassCard padding="p-6" className="mb-4 w-full">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Phone ──────────────────────────────────────────── */}
            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="phone-input"
                    className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-500 select-none">
                      +91
                    </span>
                    <div className="absolute left-11 top-1/2 -translate-y-1/2 w-px h-4 bg-stone-200" />
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      placeholder="98400 12345"
                      className={[
                        'w-full pl-14 pr-4 py-3 rounded-xl text-sm font-medium',
                        'bg-white/70 border-2 text-stone-800 placeholder:text-stone-300',
                        'focus:outline-none focus:bg-white',
                        error ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-emerald-400',
                        'transition-colors duration-150',
                      ].join(' ')}
                      aria-describedby={error ? 'phone-error' : undefined}
                    />
                    <Phone
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                      aria-hidden="true"
                    />
                  </div>
                  {error && (
                    <p id="phone-error" className="text-xs text-rose-600 mt-1.5 font-medium">
                      {error}
                    </p>
                  )}
                </div>

                <ActionButton
                  variant="emerald"
                  className="w-full justify-center"
                  isLoading={loading}
                  onClick={handleSendOtp}
                >
                  Send OTP
                  <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
                </ActionButton>
              </motion.div>
            )}

            {/* ── Step 2: OTP ────────────────────────────────────────────── */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-5"
              >
                <OtpInput value={otp} onChange={setOtp} />

                {error && (
                  <p className="text-xs text-rose-600 text-center font-medium">{error}</p>
                )}

                <ActionButton
                  variant="emerald"
                  className="w-full justify-center"
                  isLoading={loading}
                  onClick={handleVerifyOtp}
                >
                  Verify &amp; Login
                  <ShieldCheck size={15} strokeWidth={2.5} aria-hidden="true" />
                </ActionButton>

                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <RefreshCw size={12} strokeWidth={2.5} aria-hidden="true" />
                  Change number or resend OTP
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </GlassCard>

        {/* ── Demo Quick Login ────────────────────────────────────────────── */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-stone-200/80" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50/80 border border-amber-200/50 rounded-full">
              <Zap size={11} className="text-amber-500" strokeWidth={2.5} aria-hidden="true" />
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                Quick Access
              </span>
            </div>
            <div className="flex-1 h-px bg-stone-200/80" />
          </div>

          <div className="flex gap-3">
            <DemoLoginButton
              icon={User}
              label="Quick Login as Borrower"
              subLabel="Kavita · Bengaluru"
              onClick={() => handleQuickLogin('borrower')}
            />
            <DemoLoginButton
              icon={Building2}
              label="Quick Login as NGO Admin"
              subLabel="Partner Dashboard"
              onClick={() => handleQuickLogin('ngo_admin')}
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <p className="text-center text-[11px] text-stone-400 mt-auto pt-8">
          By continuing you agree to SheVest's Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}
