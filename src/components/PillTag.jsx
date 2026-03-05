/**
 * components/PillTag.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 3 — Reusable pill / badge atom
 *
 * Props:
 *   color   — 'trust' | 'danger' | 'amber' | 'neutral' | 'info'
 *   icon    — Lucide icon component (optional)
 *   label   — string
 *   size    — 'sm' | 'md' (default 'md')
 *   pulse   — boolean (adds CSS pulse animation)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const COLOR_MAP = {
    trust: {
        wrapper: 'bg-emerald-100/80 text-emerald-800 border-emerald-200/60',
        dot: 'bg-emerald-500',
    },
    danger: {
        wrapper: 'bg-red-100/80 text-red-700 border-red-200/60',
        dot: 'bg-red-500',
    },
    amber: {
        wrapper: 'bg-amber-100/80 text-amber-800 border-amber-200/60',
        dot: 'bg-amber-500',
    },
    neutral: {
        wrapper: 'bg-stone-100/80 text-stone-600 border-stone-200/60',
        dot: 'bg-stone-400',
    },
    info: {
        wrapper: 'bg-sky-100/80 text-sky-700 border-sky-200/60',
        dot: 'bg-sky-500',
    },
}

const SIZE_MAP = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1   text-xs     gap-1.5',
}

export default function PillTag({
    color = 'neutral',
    icon: Icon,
    label,
    size = 'md',
    pulse = false,
    className = '',
}) {
    const palette = COLOR_MAP[color] ?? COLOR_MAP.neutral
    const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md

    return (
        <span
            className={`
        pill ${palette.wrapper} ${sizeClass}
        ${pulse ? (color === 'danger' ? 'pulse-ring' : 'pulse-trust') : ''}
        ${className}
      `}
        >
            {/* Optional leading icon */}
            {Icon && (
                <Icon
                    size={size === 'sm' ? 10 : 12}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className="flex-shrink-0"
                />
            )}

            {/* Optional status dot when no icon */}
            {!Icon && (
                <span
                    className={`
            w-1.5 h-1.5 rounded-full flex-shrink-0
            ${palette.dot}
            ${pulse ? 'animate-pulse' : ''}
          `}
                    aria-hidden="true"
                />
            )}

            <span className="leading-none">{label}</span>
        </span>
    )
}
