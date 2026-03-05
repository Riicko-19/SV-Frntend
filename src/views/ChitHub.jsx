/**
 * views/ChitHub.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 4 — "Save & Prove" View
 *
 * Shows:
 *   · Active Chit pool hero (₹50,000 pot, member count, cycle progress ring)
 *   · Auction countdown timer (live days/hours/mins)
 *   · Trust Score arc gauge
 *   · Pay Monthly Installment CTA → updates global trustScore
 *   · Chit cycle history timeline
 *   · Member grid
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react'
import {
    Coins, Users, Trophy, Clock, CheckCircle2,
    ArrowRight, Sparkles, TrendingUp, AlertCircle,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PillTag from '../components/PillTag'
import { useApp } from '../context/AppContext'

// ─── Constants ────────────────────────────────────────────────────────────────
const CHIT_POT = 50000          // ₹
const CHIT_MEMBERS = 10
const INSTALLMENT_AMT = CHIT_POT / CHIT_MEMBERS  // ₹5,000 per month
const AUCTION_TARGET = new Date('2026-04-01T10:00:00+05:30')

const CHIT_MEMBERS_DATA = [
    { id: 1, name: 'Priya S.', avatar: 'P', paid: true },
    { id: 2, name: 'Rekha M.', avatar: 'R', paid: true },
    { id: 3, name: 'Anjali K.', avatar: 'A', paid: true },
    { id: 4, name: 'Meena D.', avatar: 'M', paid: false },
    { id: 5, name: 'Sunita L.', avatar: 'S', paid: true },
    { id: 6, name: 'Kavita B.', avatar: 'K', paid: false },
    { id: 7, name: 'Deepa N.', avatar: 'D', paid: true },
    { id: 8, name: 'Gita P.', avatar: 'G', paid: true },
    { id: 9, name: 'Lalita C.', avatar: 'L', paid: false },
    { id: 10, name: 'You', avatar: '★', paid: false, isUser: true },
]

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(target) {
    const calc = () => {
        const diff = Math.max(0, target - Date.now())
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            mins: Math.floor((diff % 3600000) / 60000),
            secs: Math.floor((diff % 60000) / 1000),
        }
    }
    const [time, setTime] = useState(calc)
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000)
        return () => clearInterval(id)
    }, [])
    return time
}

// ─── Trust Score Ring SVG ─────────────────────────────────────────────────────
function TrustRing({ score }) {
    const R = 42
    const CIRC = 2 * Math.PI * R        // ~263.9
    const filled = (score / 100) * CIRC
    const dashoffset = CIRC - filled

    return (
        <div className="relative flex items-center justify-center w-24 h-24">
            <svg width="96" height="96" viewBox="0 0 96 96" className="trust-ring -rotate-90">
                {/* Track */}
                <circle
                    cx="48" cy="48" r={R}
                    fill="none"
                    stroke="rgba(167,243,208,0.35)"
                    strokeWidth="8"
                />
                {/* Fill */}
                <circle
                    cx="48" cy="48" r={R}
                    fill="none"
                    stroke="url(#trustGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashoffset}
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
                />
                <defs>
                    <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Centre label */}
            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-emerald-700 leading-none">{score}</span>
                <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Trust</span>
            </div>
        </div>
    )
}

// ─── Countdown Block ──────────────────────────────────────────────────────────
function CountUnit({ value, label }) {
    return (
        <div className="flex flex-col items-center">
            <span
                className="
          text-2xl font-extrabold text-stone-800 leading-none
          tabular-nums w-10 text-center
        "
            >
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mt-0.5">
                {label}
            </span>
        </div>
    )
}

function CountdownTimer({ t }) {
    const { days, hours, mins, secs } = useCountdown(AUCTION_TARGET)
    return (
        <div className="flex items-center gap-1">
            <CountUnit value={days} label={t.loanDays || 'Days'} />
            <span className="text-stone-300 font-bold text-xl mb-2">:</span>
            <CountUnit value={hours} label="Hrs" />
            <span className="text-stone-300 font-bold text-xl mb-2">:</span>
            <CountUnit value={mins} label="Mins" />
            <span className="text-stone-300 font-bold text-xl mb-2">:</span>
            <CountUnit value={secs} label="Secs" />
        </div>
    )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function ChitHub() {
    const {
        t, trustScore, chitCyclesCompleted,
        installmentsPaidThisCycle, cycleProgress,
        installmentsLeft, recordInstallmentPaid,
        INSTALLMENTS_PER_CYCLE,
    } = useApp()

    const [payState, setPayState] = useState('idle') // 'idle' | 'loading' | 'success'
    const [showToast, setShowToast] = useState(false)

    const handlePayInstallment = useCallback(async () => {
        if (payState !== 'idle') return
        setPayState('loading')
        await new Promise(r => setTimeout(r, 1400))
        recordInstallmentPaid()
        setPayState('success')
        setShowToast(true)
        setTimeout(() => { setPayState('idle'); setShowToast(false) }, 3000)
    }, [payState, recordInstallmentPaid])

    const paidCount = installmentsPaidThisCycle
    const potFill = ((10 - installmentsLeft) / 10) * 100  // % of ₹50k collected this month

    return (
        <div className="scroll-area">
            <div className="flex flex-col gap-4 px-4 py-4 pb-6">

                {/* ── Toast notification ── */}
                <div
                    className={`
            fixed top-16 left-1/2 -translate-x-1/2 z-50
            transition-all duration-500
            ${showToast ? 'opacity-100 translate-y-2' : 'opacity-0 -translate-y-4 pointer-events-none'}
          `}
                >
                    <div className="glass-card-trust px-4 py-2.5 flex items-center gap-2 shadow-trust">
                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-bold text-emerald-800">
                            {t.paySuccess}
                        </span>
                    </div>
                </div>

                {/* ── HERO — Active Chit Pool ── */}
                <GlassCard variant="trust" padding="p-0" className="overflow-hidden fade-in">
                    {/* Gradient banner strip */}
                    <div
                        className="relative px-5 pt-5 pb-4"
                        style={{
                            background: 'linear-gradient(135deg,rgba(167,243,208,0.45) 0%,rgba(255,255,255,0.10) 100%)',
                        }}
                    >
                        <div className="flex items-start justify-between">
                            {/* Left — pot info */}
                            <div className="flex flex-col gap-1">
                                <PillTag color="trust" icon={Coins} label={t.activeChit} size="sm" />
                                <p className="text-3xl font-extrabold text-stone-800 mt-1 leading-none">
                                    ₹{CHIT_POT.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs font-medium text-stone-500">
                                    {t.potValue} · {CHIT_MEMBERS} {t.members}
                                </p>
                            </div>

                            {/* Right — Trust ring */}
                            <TrustRing score={trustScore} />
                        </div>

                        {/* Cycle indicator */}
                        <div className="mt-3 flex items-center gap-2">
                            <PillTag
                                color={chitCyclesCompleted >= 3 ? 'trust' : 'amber'}
                                icon={Trophy}
                                label={`${t.cycle} ${chitCyclesCompleted + 1} ${t.of} 10`}
                                size="sm"
                            />
                            <PillTag color="neutral" label={`${paidCount}/${INSTALLMENTS_PER_CYCLE} paid`} size="sm" />
                        </div>
                    </div>

                    {/* Cycle progress bar */}
                    <div className="px-5 pb-1 pt-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-stone-500">{t.progress}</span>
                            <span className="text-xs font-bold text-emerald-700">{Math.round(cycleProgress)}%</span>
                        </div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${cycleProgress}%` }} />
                        </div>
                    </div>

                    {/* Trust gate hint */}
                    <div className="px-5 pb-4 pt-2">
                        <div className="flex items-center gap-1.5">
                            <TrendingUp size={12} className="text-brand-600" />
                            <span className="text-[11px] text-stone-500 font-medium">
                                {trustScore < 80
                                    ? `${80 - trustScore} points to unlock P2P Marketplace`
                                    : '🎉 P2P Marketplace unlocked!'}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                {/* ── AUCTION COUNTDOWN ── */}
                <GlassCard variant="base" padding="p-5" className="fade-in" style={{ animationDelay: '0.07s' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={16} className="text-amber-500" />
                        <span className="section-title text-base">{t.auctionCountdown}</span>
                        <PillTag color="amber" label="Live" pulse size="sm" />
                    </div>
                    <div className="flex justify-center">
                        <CountdownTimer t={t} />
                    </div>
                    <div className="mt-4 flex items-start gap-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-100/60">
                        <AlertCircle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                            The member with the highest bid wins the ₹{CHIT_POT.toLocaleString('en-IN')} pot this cycle. All members continue paying installments.
                        </p>
                    </div>
                </GlassCard>

                {/* ── PAY INSTALLMENT CTA ── */}
                <GlassCard variant="base" padding="p-5" className="fade-in" style={{ animationDelay: '0.12s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="section-title">{t.myInstallment}</p>
                            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
                                ₹{INSTALLMENT_AMT.toLocaleString('en-IN')}
                                <span className="text-sm font-medium text-stone-400 ml-1">/ month</span>
                            </p>
                        </div>
                        <PillTag
                            color={payState === 'success' ? 'trust' : 'amber'}
                            label={payState === 'success' ? 'Paid ✓' : 'Due'}
                            size="sm"
                        />
                    </div>

                    <button
                        id="pay-installment-btn"
                        onClick={handlePayInstallment}
                        disabled={payState !== 'idle'}
                        className={`
              btn-emerald w-full text-base
              ${payState !== 'idle' ? 'opacity-80' : 'pulse-trust'}
            `}
                        aria-busy={payState === 'loading'}
                    >
                        {payState === 'loading' ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                {t.paying}
                            </span>
                        ) : payState === 'success' ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                {t.paySuccess}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Coins size={18} />
                                {t.payInstallment}
                            </span>
                        )}
                    </button>

                    {/* Trust score gain preview */}
                    {payState === 'idle' && (
                        <p className="text-center text-[11px] text-stone-400 mt-2.5 font-medium">
                            <Sparkles size={10} className="inline mr-1 text-emerald-500" />
                            Earn <span className="text-emerald-600 font-bold">+5 Trust Points</span> on payment
                        </p>
                    )}
                </GlassCard>

                {/* ── MEMBER GRID ── */}
                <GlassCard variant="base" padding="p-5" className="fade-in" style={{ animationDelay: '0.18s' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={15} className="text-brand-600" />
                        <p className="section-title">Group Members</p>
                        <span className="ml-auto text-xs text-stone-400">
                            {CHIT_MEMBERS_DATA.filter(m => m.paid).length}/{CHIT_MEMBERS} paid
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        {CHIT_MEMBERS_DATA.map(member => (
                            <div key={member.id} className="flex flex-col items-center gap-1">
                                {/* Avatar bubble */}
                                <span
                                    className={`
                    w-11 h-11 rounded-2xl flex items-center justify-center
                    text-sm font-bold border-2 transition-all duration-200
                    ${member.isUser
                                            ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white border-brand-300 shadow-trust'
                                            : member.paid
                                                ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/70'
                                                : 'bg-stone-50/90 text-stone-400 border-stone-200/60'
                                        }
                  `}
                                >
                                    {member.avatar}
                                </span>
                                {/* Name */}
                                <span className="text-[9px] font-semibold text-stone-500 text-center leading-tight truncate w-full text-center">
                                    {member.name}
                                </span>
                                {/* Status dot */}
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${member.paid ? 'bg-emerald-500' : 'bg-stone-300'}`}
                                    aria-label={member.paid ? 'Paid' : 'Pending'}
                                />
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* ── CYCLE HISTORY ── */}
                {chitCyclesCompleted > 0 && (
                    <GlassCard variant="base" padding="p-5" className="fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy size={15} className="text-amber-500" />
                            <p className="section-title">{t.chitCycles}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: chitCyclesCompleted }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/50">
                                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-stone-700">{t.cycle} {i + 1} {t.cycleComplete}</p>
                                        <p className="text-[10px] text-stone-400">{INSTALLMENTS_PER_CYCLE} installments · +{20 + 12 * 5} trust pts</p>
                                    </div>
                                    <ArrowRight size={14} className="text-stone-300" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

            </div>
        </div>
    )
}
