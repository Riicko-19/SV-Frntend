/**
 * components/molecules/TrustScoreRing.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — Circular SVG progress ring displaying the SheVest Trust Score.
 *
 * Design rules:
 *  • Score ≤ 79 → Amber ring  (pending / building trust)
 *  • Score ≥ 80 → Emerald ring + continuous pulse glow animation
 *  • Locked P2P gateway: blur overlay shown when score < 80
 *
 * Props:
 *   score        — number 0–100
 *   size         — ring diameter in px (default 140)
 *   strokeWidth  — ring track thickness (default 10)
 *   showLabel    — show the "Trust Score" caption below the number (default true)
 *   animate      — animate the ring fill on mount (default true)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcCircle(size, strokeWidth) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  return { r, cx, circumference };
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, className }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(mv, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1], // expo-out
    });
    return controls.stop;
  }, [mv, target]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TrustScoreRing({
  score = 0,
  size = 140,
  strokeWidth = 10,
  showLabel = true,
  animate: shouldAnimate = true,
}) {
  const { r, cx, circumference } = calcCircle(size, strokeWidth);
  const clampedScore = Math.min(100, Math.max(0, score));

  const isUnlocked = clampedScore >= 80;
  const trackColor   = 'stroke-stone-200';
  const ringColor    = isUnlocked ? 'stroke-emerald-500' : 'stroke-amber-400';
  const textColor    = isUnlocked ? 'text-emerald-700'   : 'text-amber-700';

  // dashoffset: 0 = full ring, circumference = empty
  const targetOffset = circumference - (clampedScore / 100) * circumference;

  const dashOffsetMV = useMotionValue(shouldAnimate ? circumference : targetOffset);

  useEffect(() => {
    if (!shouldAnimate) return;
    const controls = animate(dashOffsetMV, targetOffset, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [dashOffsetMV, targetOffset, shouldAnimate]);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* ── Ring container ──────────────────────────────────────────────── */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Emerald glow pulse when unlocked */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400/20"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          aria-label={`Trust Score: ${clampedScore} out of 100`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            strokeWidth={strokeWidth}
            className={trackColor}
            strokeLinecap="round"
          />
          {/* Progress arc — rotated so it starts from 12 o'clock */}
          <motion.circle
            cx={cx}
            cy={cx}
            r={r}
            strokeWidth={strokeWidth}
            className={ringColor}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffsetMV, rotate: -90, originX: '50%', originY: '50%' }}
          />
        </svg>

        {/* Centre content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isUnlocked ? (
            <ShieldCheck
              size={18}
              className="text-emerald-600 mb-0.5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          ) : (
            <Lock
              size={15}
              className="text-amber-500 mb-0.5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          )}
          <AnimatedNumber
            target={clampedScore}
            className={`text-2xl font-bold leading-none font-sans ${textColor}`}
          />
          <span className="text-[10px] text-stone-400 font-medium mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Caption row */}
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-semibold text-stone-600 tracking-wide uppercase">
            Trust Score
          </p>
          {isUnlocked ? (
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              P2P Marketplace Unlocked ✓
            </p>
          ) : (
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              {80 - clampedScore} points to unlock P2P
            </p>
          )}
        </div>
      )}
    </div>
  );
}
