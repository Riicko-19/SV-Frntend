/**
 * components/GlassCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 3 — Glassmorphism wrapper atom
 *
 * Props:
 *   variant   — 'base' | 'lg' | 'xl' | 'trust' | 'danger' | 'fir'
 *   hover     — boolean (adds hover-lift micro-animation)
 *   padding   — tailwind padding class string (default 'p-5')
 *   className — additional classes
 *   as        — HTML element tag (default 'div')
 *   onClick   — click handler
 * ─────────────────────────────────────────────────────────────────────────────
 */

const VARIANT_MAP = {
    base: 'glass-card',
    lg: 'glass-card-lg',
    xl: 'glass-card-xl',
    trust: 'glass-card-trust',
    danger: 'glass-card-danger',
    fir: 'glass-fir-modal',
}

export default function GlassCard({
    children,
    variant = 'base',
    hover = false,
    padding = 'p-5',
    className = '',
    as: Tag = 'div',
    onClick,
    style,
    ...rest
}) {
    const variantClass = VARIANT_MAP[variant] ?? VARIANT_MAP.base

    return (
        <Tag
            className={`
        ${variantClass}
        ${padding}
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
            style={style}
            {...rest}
        >
            {children}
        </Tag>
    )
}
