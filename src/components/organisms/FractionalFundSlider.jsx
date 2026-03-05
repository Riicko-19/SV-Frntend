/**
 * components/organisms/FractionalFundSlider.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 3 — P2P Marketplace: fractional lending card with tactile slider.
 *
 * Allows a lender to choose HOW MUCH of a loan request they want to fund:
 *   Quick-pick presets  →  ₹500 | ₹1,000
 *   Custom              →  draggable range slider between ₹100 and loanAmount
 *
 * Design rules enforced:
 *  • Glass card wrapper (bg-white/60 backdrop-blur-xl etc.)
 *  • Progress bar: "₹X / ₹Y Funded" per skills.md Fractional Funding rule
 *  • Emerald CTA: "Fund ₹X" ActionButton
 *  • If trustScore < 80 → blurred overlay with lock icon (P2P Gateway Lock)
 *
 * Props:
 *   borrowerName   — string  e.g. "Kavita Sharma"
 *   borrowerCity   — string  e.g. "Bengaluru"
 *   loanAmount     — number  total amount requested
 *   fundedAmount   — number  already funded by others
 *   purpose        — string  e.g. "Sewing machine repair"
 *   trustScore     — number  lender's trust score (gates access)
 *   onFund         — (amount: number) => void
 *   isProcessing   — boolean
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, TrendingUp, MapPin, Target } from 'lucide-react';
import GlassCard    from '../atoms/GlassCard';
import ActionButton from '../atoms/ActionButton';

// ── Indian number formatter ───────────────────────────────────────────────────
const inr = (n) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(n))}`;

// ── Preset chip ───────────────────────────────────────────────────────────────
function PresetChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150',
        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
        active
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-400/30'
          : 'bg-white/60 text-stone-600 border-white/50 hover:bg-white/80',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FractionalFundSlider({
  borrowerName   = 'Kavita Sharma',
  borrowerCity   = 'Bengaluru',
  loanAmount     = 5000,
  fundedAmount   = 2000,
  purpose        = 'Working capital',
  trustScore     = 85,
  onFund,
  isProcessing   = false,
}) {
  const sliderId     = useId();
  const isLocked     = trustScore < 80;
  const remaining    = loanAmount - fundedAmount;
  const fundedPct    = Math.min(100, (fundedAmount / loanAmount) * 100);

  // Presets capped to remaining gap
  const PRESETS = [500, 1000].filter((p) => p <= remaining);

  const [mode, setMode]         = useState('preset'); // 'preset' | 'custom'
  const [presetAmt, setPreset]  = useState(PRESETS[0] ?? remaining);
  const [customAmt, setCustom]  = useState(Math.min(500, remaining));

  const activeAmount = mode === 'custom' ? customAmt : presetAmt;
  const canFund = activeAmount > 0 && activeAmount <= remaining;

  const handlePreset = (amt) => {
    setMode('preset');
    setPreset(amt);
  };

  const handleCustomToggle = () => {
    setMode('custom');
  };

  return (
    <div className="relative w-full">
      <GlassCard padding="p-5" className="w-full space-y-4">

        {/* ── Header: borrower info ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-base font-bold text-emerald-950">{borrowerName}</p>
            <p className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin size={11} strokeWidth={2.5} aria-hidden="true" />
              {borrowerCity}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500 font-medium">Loan Request</p>
            <p className="text-lg font-bold text-emerald-700">{inr(loanAmount)}</p>
          </div>
        </div>

        {/* Purpose tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 border border-emerald-100/60 rounded-lg">
          <Target size={13} className="text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
          <p className="text-xs text-emerald-800 font-medium truncate">{purpose}</p>
        </div>

        {/* ── Funding progress bar ──────────────────────────────────────── */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-stone-500 font-medium">
              <TrendingUp size={12} className="inline mr-1" aria-hidden="true" />
              {inr(fundedAmount)} funded
            </span>
            <span className="text-stone-400">{inr(remaining)} remaining</span>
          </div>
          <div className="h-2 w-full bg-stone-200/70 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${fundedPct}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="text-right text-[10px] text-stone-400 mt-0.5">
            {Math.round(fundedPct)}% of goal
          </p>
        </div>

        {/* ── Amount picker ─────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">
            Choose your contribution
          </p>

          {/* Preset chips + Custom toggle */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESETS.map((amt) => (
              <PresetChip
                key={amt}
                label={inr(amt)}
                active={mode === 'preset' && presetAmt === amt}
                onClick={() => handlePreset(amt)}
              />
            ))}
            <PresetChip
              label="Custom"
              active={mode === 'custom'}
              onClick={handleCustomToggle}
            />
          </div>

          {/* Custom slider — animates in/out */}
          <AnimatePresence>
            {mode === 'custom' && (
              <motion.div
                key="slider"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="pt-1 pb-2">
                  <label htmlFor={sliderId} className="sr-only">
                    Custom funding amount
                  </label>
                  <input
                    id={sliderId}
                    type="range"
                    min={100}
                    max={remaining}
                    step={100}
                    value={customAmt}
                    onChange={(e) => setCustom(Number(e.target.value))}
                    className={[
                      'w-full h-2 rounded-full appearance-none cursor-pointer',
                      'bg-stone-200',
                      // Webkit thumb styling via inline accent
                      'accent-emerald-500',
                    ].join(' ')}
                    style={{ accentColor: '#10b981' }}
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>₹100</span>
                    <span className="text-emerald-700 font-semibold text-xs">
                      {inr(customAmt)}
                    </span>
                    <span>{inr(remaining)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <ActionButton
          variant="emerald"
          className="w-full justify-center"
          isLoading={isProcessing}
          disabled={!canFund}
          onClick={() => onFund?.(activeAmount)}
        >
          Fund {inr(activeAmount)}
        </ActionButton>

      </GlassCard>

      {/* ── P2P Gateway Lock Overlay (trustScore < 80) ────────────────── */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={[
              'absolute inset-0 rounded-2xl',
              'backdrop-blur-md bg-white/40',
              'flex flex-col items-center justify-center gap-3',
              'border border-white/40',
            ].join(' ')}
            aria-live="polite"
          >
            <div className="bg-amber-100/80 p-3 rounded-full border border-amber-200/60">
              <Lock size={24} className="text-amber-600" strokeWidth={2} />
            </div>
            <div className="text-center px-6">
              <p className="text-sm font-bold text-stone-800">P2P Marketplace Locked</p>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Complete {80 - trustScore} more trust points via your Chit
                Fund to unlock lending.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
