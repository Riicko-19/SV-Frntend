/**
 * components/atoms/PillTag.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 1 — Reusable status pill / badge atom.
 *
 * Props:
 *   colorType  — 'trust' | 'danger' | 'warning'
 *   icon       — Lucide icon component (optional, rendered at 14px)
 *   label      — string displayed inside the pill
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Color token map aligned to SheVest design system palette
const COLOR_MAP = {
  trust: {
    pill: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60',
    dot:  'bg-emerald-500',
  },
  danger: {
    pill: 'bg-rose-100/80 text-rose-700 border border-rose-200/60',
    dot:  'bg-rose-500',
  },
  warning: {
    pill: 'bg-amber-100/80 text-amber-800 border border-amber-200/60',
    dot:  'bg-amber-500',
  },
};

export default function PillTag({ colorType = 'trust', icon: Icon, label }) {
  const tokens = COLOR_MAP[colorType] ?? COLOR_MAP.trust;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5',
        'px-2.5 py-0.5',
        'rounded-full text-xs font-semibold',
        'select-none whitespace-nowrap',
        tokens.pill,
      ].join(' ')}
    >
      {/* Icon overrides the status dot when provided */}
      {Icon ? (
        <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <span
          className={['w-1.5 h-1.5 rounded-full flex-shrink-0', tokens.dot].join(' ')}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
