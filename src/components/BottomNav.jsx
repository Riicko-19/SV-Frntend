/**
 * components/BottomNav.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — SheVest Bottom Navigation
 *
 * Three tabs:
 *   /chithub  → Coins       icon — "Chit Hub"
 *   /p2p      → TrendingUp  icon — "Marketplace"  (badge if trustScore nearing 80)
 *   /legal    → ShieldCheck icon — "Legal Shield"
 *
 * Features:
 *   · Glassmorphism bar
 *   · Active tab: emerald pill highlight + glow
 *   · Inactive tab: stone-400 → emerald-500 on hover
 *   · P2P tab: shows trust score badge if score < 80 (visual CTA)
 *   · Bilingual labels from AppContext
 *   · Safe-area padding for iOS home bar
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Link, useLocation } from 'react-router-dom'
import { Coins, TrendingUp, ShieldCheck, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
    {
        to: '/chithub',
        icon: Coins,
        labelKey: 'navChitHub',
        id: 'tab-chithub',
    },
    {
        to: '/p2p',
        icon: TrendingUp,
        labelKey: 'navP2P',
        id: 'tab-p2p',
        showBadge: true, // conditionally shows lock/score badge
    },
    {
        to: '/legal',
        icon: ShieldCheck,
        labelKey: 'navLegal',
        id: 'tab-legal',
    },
]

export default function BottomNav() {
    const { pathname } = useLocation()
    const { t, trustScore, isP2PUnlocked } = useApp()

    return (
        <nav
            className="glass-bottom-nav flex-shrink-0"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            aria-label="Main navigation"
        >
            <div className="flex justify-around items-center h-16 px-2">
                {TABS.map(({ to, icon: Icon, labelKey, id, showBadge }) => {
                    const active = pathname.startsWith(to)
                    const label = t[labelKey]

                    // P2P-specific badge: locked icon if not yet unlocked
                    const showLockBadge = showBadge && !isP2PUnlocked

                    return (
                        <Link
                            key={to}
                            to={to}
                            id={id}
                            aria-current={active ? 'page' : undefined}
                            className={`
                relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl
                transition-all duration-200 group select-none
                ${active
                                    ? 'text-emerald-700'
                                    : 'text-stone-400 hover:text-emerald-500'
                                }
              `}
                        >
                            {/* ── Active background pill ── */}
                            {active && (
                                <span
                                    className="
                    absolute inset-0 rounded-2xl
                    bg-emerald-50/90
                    shadow-[0_0_16px_4px_rgba(5,150,105,0.18)]
                    border border-emerald-100/60
                  "
                                    aria-hidden="true"
                                />
                            )}

                            {/* ── Icon wrapper ── */}
                            <span className="relative flex items-center justify-center">
                                <span
                                    className={`
                    p-1.5 rounded-xl transition-all duration-200 relative
                    ${active
                                            ? 'bg-emerald-100/80'
                                            : 'group-hover:bg-stone-50/80'
                                        }
                  `}
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={active ? 2.2 : 1.8}
                                        className="transition-all duration-200"
                                        aria-hidden="true"
                                    />

                                    {/* ── Lock badge for P2P tab ── */}
                                    {showLockBadge && (
                                        <span
                                            className="
                        absolute -top-1 -right-1
                        flex items-center justify-center
                        w-4 h-4 rounded-full
                        bg-amber-400 border border-white
                        shadow-sm
                      "
                                            title={`Unlock at 80 Trust Score (currently ${trustScore})`}
                                            aria-label="Locked"
                                        >
                                            <Lock size={8} strokeWidth={2.5} className="text-white" />
                                        </span>
                                    )}

                                    {/* ── Green dot badge when P2P just unlocked ── */}
                                    {showBadge && isP2PUnlocked && (
                                        <span
                                            className="
                        absolute -top-1 -right-1
                        w-3 h-3 rounded-full
                        bg-emerald-500 border-2 border-white
                        shadow-sm animate-pulse
                      "
                                            aria-label="Marketplace unlocked"
                                        />
                                    )}
                                </span>
                            </span>

                            {/* ── Label ── */}
                            <span
                                className={`
                  relative text-[10px] font-semibold tracking-wide
                  transition-all duration-200
                  ${active ? 'text-emerald-700' : 'text-stone-400'}
                `}
                            >
                                {label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
