/**
 * components/B2BHeader.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 3 — White-label B2B Top Header
 *
 * Displays:
 *   LEFT  — SheVest wordmark + shield glyph (always visible)
 *   CENTER— NGO partner logo placeholder (white-label customisable)
 *   RIGHT — "Powered by SheVest" micro-text + Language toggle (EN ↔ हिं)
 *
 * The entire bar uses .glass-nav glassmorphism.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ─── NGO Partner Logo Placeholder ────────────────────────────────────────────
// Replace `src` with actual white-labeled partner logo URL at runtime.
function PartnerLogo() {
    return (
        <div
            className="
        flex items-center gap-1.5 px-3 py-1
        rounded-xl border border-stone-200/70
        bg-white/60 backdrop-blur-sm
      "
            aria-label="NGO Partner Logo"
        >
            {/* Partner avatar placeholder */}
            <span
                className="
          w-5 h-5 rounded-full
          bg-gradient-to-br from-brand-400 to-brand-600
          flex items-center justify-center
          text-white text-[8px] font-black
          flex-shrink-0
        "
            >
                N
            </span>
            <span className="text-[10px] font-semibold text-stone-500 leading-none">
                NGO Partner
            </span>
        </div>
    )
}

// ─── Language Toggle Pill ─────────────────────────────────────────────────────
function LangToggle({ lang, onToggle }) {
    return (
        <button
            onClick={onToggle}
            id="lang-toggle-btn"
            aria-label={`Switch language. Current: ${lang}`}
            className="
        relative flex items-center gap-0.5 px-2.5 py-1
        rounded-full border border-stone-200/80
        bg-white/70 backdrop-blur-sm
        text-[11px] font-bold text-stone-600
        hover:bg-emerald-50/80 hover:border-emerald-200/60 hover:text-emerald-700
        active:scale-95 transition-all duration-200 select-none
        shadow-[0_2px_8px_rgba(31,38,135,0.06)]
      "
        >
            {/* Active lang */}
            <span className="text-emerald-700">{lang}</span>
            <span className="text-stone-300 mx-0.5 text-[10px]">/</span>
            {/* Inactive lang */}
            <span className="text-stone-400">{lang === 'EN' ? 'हिं' : 'EN'}</span>
        </button>
    )
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function B2BHeader() {
    const { lang, toggleLang, t } = useApp()

    return (
        <header
            className="glass-nav flex-shrink-0 z-40"
            role="banner"
        >
            <div className="flex items-center justify-between px-4 h-14">

                {/* ── LEFT — SheVest brand mark ── */}
                <div className="flex items-center gap-2">
                    {/* Shield icon */}
                    <span
                        className="
              w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
              bg-gradient-to-br from-brand-500 to-brand-700
              shadow-[0_4px_12px_rgba(16,185,129,0.35)]
            "
                        aria-hidden="true"
                    >
                        <ShieldCheck size={17} strokeWidth={2.5} className="text-white" />
                    </span>

                    {/* Wordmark */}
                    <div className="flex flex-col leading-none">
                        <span className="text-base font-extrabold text-stone-800 tracking-tight">
                            She<span className="text-brand-600">Vest</span>
                        </span>
                        <span className="text-[9px] font-medium text-stone-400 tracking-wider uppercase">
                            {t.poweredBy}
                        </span>
                    </div>
                </div>

                {/* ── CENTER — White-label NGO Partner placeholder ── */}
                <PartnerLogo />

                {/* ── RIGHT — Language toggle ── */}
                <LangToggle lang={lang} onToggle={toggleLang} />
            </div>

            {/* Subtle 3D depth line */}
            <div
                className="h-px w-full"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.15) 30%, rgba(167,243,208,0.25) 50%, rgba(16,185,129,0.15) 70%, transparent 100%)',
                }}
                aria-hidden="true"
            />
        </header>
    )
}
