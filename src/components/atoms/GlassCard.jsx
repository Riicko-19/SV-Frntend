/**
 * components/atoms/GlassCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 1 — Base glassmorphism wrapper atom.
 *
 * Strictly enforces the SheVest design system glass tokens:
 *   bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg
 *
 * Props:
 *   className  — additional Tailwind classes for layout/sizing overrides
 *   padding    — Tailwind padding class (default 'p-5')
 *   as         — HTML element or React component to render as (default 'div')
 *   onClick    — optional click handler
 *   children   — slot content
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function GlassCard({
  children,
  className = '',
  padding = 'p-5',
  as: Tag = 'div',
  onClick,
}) {
  return (
    <Tag
      onClick={onClick}
      className={[
        // ── Core glass tokens (NEVER modify these per design rules) ──────────
        'bg-white/60',
        'backdrop-blur-xl',
        'border border-white/40',
        'shadow-lg',
        // ── Shape & typography defaults ────────────────────────────────────
        'rounded-2xl',
        'font-sans text-stone-800',
        // ── Layout ────────────────────────────────────────────────────────
        padding,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
