/**
 * components/atoms/ActionButton.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 1 — Primary CTA button atom with Framer Motion tap micro-interaction.
 *
 * Props:
 *   variant    — 'emerald' | 'crimson' | 'ghost'
 *   isLoading  — boolean; replaces children with a spinner and disables clicks
 *   onClick    — click handler
 *   children   — label / slot content
 *   disabled   — explicitly disable the button (stacks with isLoading)
 *   type       — HTML button type (default 'button')
 *   className  — extra Tailwind classes (layout / sizing overrides only)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion } from 'framer-motion';

// ── Variant token map ────────────────────────────────────────────────────────
const VARIANT_MAP = {
  emerald: [
    'bg-emerald-500 hover:bg-emerald-600',
    'text-white',
    'shadow-md shadow-emerald-500/30',
    'border border-emerald-400/40',
  ],
  crimson: [
    'bg-rose-500 hover:bg-rose-600',
    'text-white',
    'shadow-md shadow-rose-500/30',
    'border border-rose-400/40',
  ],
  ghost: [
    'bg-white/60 hover:bg-white/80',
    'text-stone-700',
    'shadow-sm',
    'border border-white/40',
    'backdrop-blur-sm',
  ],
};

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ light }) {
  return (
    <svg
      className={[
        'animate-spin w-4 h-4',
        light ? 'text-white/80' : 'text-stone-500',
      ].join(' ')}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ActionButton({
  variant = 'emerald',
  isLoading = false,
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}) {
  const tokens = VARIANT_MAP[variant] ?? VARIANT_MAP.emerald;
  const isDisabled = disabled || isLoading;
  const lightSpinner = variant === 'emerald' || variant === 'crimson';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      // Subtle tactile tap scale — feels native without being distracting
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        // Layout
        'inline-flex items-center justify-center gap-2',
        'px-5 py-2.5',
        'rounded-xl',
        // Typography
        'text-sm font-semibold font-sans',
        // Transition
        'transition-colors duration-150',
        // Focus ring for accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
        // Disabled state
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        // Variant tokens (spread array)
        ...tokens,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner light={lightSpinner} />
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
