/**
 * components/organisms/DemoGodMode.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — Live-pitch "God Mode" floating controller.
 *
 * Placement: fixed bottom-right, z-50. Always on screen after login.
 *
 * Default state: collapsed to a subtle amber pill ("DEMO ⚡").
 * Tap it → expands to a glass panel with 3 controls:
 *
 *   +20 Trust  — bumps global trustScore by 20 (caps at 100).
 *                Visually unlocks the P2P marketplace once score ≥ 80.
 *   Reset       — sets trustScore back to 20 (locked state for demos).
 *   Toggle Role — swaps userRole between 'borrower' ↔ 'ngo_admin' and
 *                 navigates to the correct view.
 *
 * Context contract (fulfilled by Agent 3):
 *   useApp() must expose:
 *     trustScore          — number
 *     setTrustScoreManual — (n: number) => void   ← already in context
 *     userRole            — 'borrower' | 'ngo_admin'  ← Agent 3 adds this
 *     toggleRole          — () => void                ← Agent 3 adds this
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, RotateCcw, UserCog, X, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ─── Tiny icon action button ──────────────────────────────────────────────────
function GodButton({ icon: Icon, label, sublabel, onClick, colorClass = 'text-stone-700', bgClass = 'bg-white/70 hover:bg-white' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl',
        'border border-white/50',
        'transition-all duration-150 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
        bgClass,
      ].join(' ')}
    >
      <Icon size={18} className={colorClass} strokeWidth={2} aria-hidden="true" />
      <span className={`text-[11px] font-bold leading-tight ${colorClass}`}>{label}</span>
      {sublabel && (
        <span className="text-[9px] text-stone-400 leading-tight">{sublabel}</span>
      )}
    </button>
  );
}

// ─── Score pip strip ──────────────────────────────────────────────────────────
function ScorePips({ score }) {
  const pips = 5; // each pip = 20 pts
  const filled = Math.floor(score / 20);
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: pips }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ backgroundColor: i < filled ? '#10b981' : '#d6d3d1' }}
          transition={{ duration: 0.3 }}
          className="w-4 h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DemoGodMode() {
  const {
    trustScore,
    setTrustScoreManual,
    userRole,
    toggleRole,
  } = useApp();

  const [open, setOpen] = useState(false);

  const isUnlocked = trustScore >= 80;

  const handleBump = () => {
    setTrustScoreManual(Math.min(100, trustScore + 20));
  };

  const handleReset = () => {
    setTrustScoreManual(20);
  };

  const handleToggleRole = () => {
    toggleRole?.();   // optional-chain: safe before Agent 3 wires it
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col items-end gap-2 select-none">

      {/* ── Expanded panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={[
              'bg-white/80 backdrop-blur-xl',
              'border border-white/50 shadow-xl shadow-stone-900/10',
              'rounded-2xl p-3 w-52',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" strokeWidth={2.5} aria-hidden="true" />
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  Controls
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-0.5 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Close panel"
              >
                <X size={13} className="text-stone-400" />
              </button>
            </div>

            {/* Trust score readout */}
            <div className="bg-stone-50/80 border border-stone-100 rounded-xl px-3 py-2 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                  Trust Score
                </span>
                <div className="flex items-center gap-1">
                  {isUnlocked
                    ? <ShieldCheck size={11} className="text-emerald-500" strokeWidth={2.5} />
                    : <Lock size={11} className="text-amber-500" strokeWidth={2.5} />
                  }
                  <motion.span
                    key={trustScore}
                    initial={{ scale: 1.3, color: '#10b981' }}
                    animate={{ scale: 1, color: isUnlocked ? '#059669' : '#b45309' }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-bold tabular-nums"
                  >
                    {trustScore}
                  </motion.span>
                  <span className="text-[10px] text-stone-400">/100</span>
                </div>
              </div>
              <ScorePips score={trustScore} />
              {!isUnlocked && (
                <p className="text-[9px] text-amber-600 mt-1.5 font-medium">
                  {80 - trustScore} pts to unlock P2P
                </p>
              )}
              {isUnlocked && (
                <p className="text-[9px] text-emerald-600 mt-1.5 font-medium">
                  P2P Marketplace unlocked ✓
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-1.5">
              <GodButton
                icon={TrendingUp}
                label="+20 Trust"
                sublabel={trustScore >= 100 ? 'Max' : `→ ${Math.min(100, trustScore + 20)}`}
                onClick={handleBump}
                colorClass="text-emerald-700"
                bgClass="bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200/60"
              />
              <GodButton
                icon={RotateCcw}
                label="Reset"
                sublabel="→ 20"
                onClick={handleReset}
                colorClass="text-stone-600"
                bgClass="bg-white/70 hover:bg-stone-50 border-stone-200/60"
              />
              <GodButton
                icon={UserCog}
                label="Toggle Role"
                sublabel={userRole === 'borrower' ? '→ NGO' : '→ User'}
                onClick={handleToggleRole}
                colorClass="text-rose-600"
                bgClass="bg-rose-50/70 hover:bg-rose-100/70 border-rose-200/50"
              />
            </div>

            {/* Role indicator */}
            {userRole && (
              <div className="mt-2.5 px-2 py-1.5 bg-stone-50/70 border border-stone-100 rounded-lg">
                <p className="text-[10px] text-stone-500 text-center">
                  Current role:{' '}
                  <span className="font-bold text-stone-700">
                    {userRole === 'ngo_admin' ? 'NGO Admin' : 'Borrower'}
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsed trigger pill ────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        aria-label={open ? 'Close controls' : 'Open controls'}
        aria-expanded={open}
        className={[
          'flex items-center gap-1.5 px-3 py-2 rounded-full',
          'bg-amber-400/90 hover:bg-amber-400',
          'border border-amber-300/60',
          'shadow-lg shadow-amber-500/30',
          'backdrop-blur-sm',
          'transition-colors duration-150',
        ].join(' ')}
      >
        <Zap size={14} className="text-white" strokeWidth={2.5} aria-hidden="true" />
        {/* Live score badge — visible when collapsed */}
        {!open && (
          <span
            className={[
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5',
              isUnlocked ? 'bg-emerald-500 text-white' : 'bg-white/80 text-amber-700',
            ].join(' ')}
          >
            {trustScore}
          </span>
        )}
      </motion.button>
    </div>
  );
}
