/**
 * PillTag — reusable colorful pill-shaped tag component.
 *
 * Props:
 *   color   — tailwind color key: 'emerald' | 'amber' | 'sky' | 'rose' | 'violet' | 'teal'
 *   icon    — React element or emoji string
 *   label   — string text
 *   size    — 'sm' | 'md' (default 'md')
 */

const COLOR_MAP = {
    emerald: 'bg-emerald-100/80  text-emerald-800  border-emerald-200/60',
    amber: 'bg-amber-100/80    text-amber-800    border-amber-200/60',
    sky: 'bg-sky-100/80      text-sky-800      border-sky-200/60',
    rose: 'bg-rose-100/80     text-rose-800     border-rose-200/60',
    violet: 'bg-violet-100/80   text-violet-800   border-violet-200/60',
    teal: 'bg-teal-100/80     text-teal-800     border-teal-200/60',
    stone: 'bg-stone-100/80    text-stone-600    border-stone-200/60',
    yellow: 'bg-yellow-100/80   text-yellow-800   border-yellow-200/60',
    orange: 'bg-orange-100/80   text-orange-800   border-orange-200/60',
}

export default function PillTag({ color = 'emerald', icon, label, size = 'md' }) {
    const colorClass = COLOR_MAP[color] ?? COLOR_MAP.emerald
    const sizeClass = size === 'sm'
        ? 'px-2 py-0.5 text-[10px] gap-1'
        : 'px-3 py-1   text-xs     gap-1.5'

    return (
        <span className={`pill ${colorClass} ${sizeClass} backdrop-blur-sm`}>
            {icon && (
                typeof icon === 'string'
                    ? <span className="leading-none">{icon}</span>
                    : icon
            )}
            <span className="font-semibold tracking-wide">{label}</span>
        </span>
    )
}
