/**
 * views/P2PMarketplace.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 4 — "Borrow & Grow" View
 *
 * Logic:
 *   trustScore < 80  → frosted .lock-overlay + Lock icon (framer-motion fade-in)
 *   trustScore >= 80 → framer-motion staggered reveal of verified P2P loans
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lock, ShieldCheck, TrendingUp, Star,
    Clock, Percent, IndianRupee, ChevronRight, Sparkles,
    Users, Loader2,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PillTag from '../components/PillTag'
import { useApp, P2P_TRUST_GATE } from '../context/AppContext'

// ─── Loan Data ────────────────────────────────────────────────────────────────
const LOANS = [
    {
        id: 'L001',
        name: 'Priya Sharma',
        avatar: 'PS',
        location: 'Jaipur, RJ',
        amount: 8000,
        purpose: 'Sewing machine for tailoring business',
        rate: '7.5% p.a.',
        tenure: '6 months',
        trustMatch: 94,
        verified: true,
        tag: 'trust',
    },
    {
        id: 'L002',
        name: 'Rekha Devi',
        avatar: 'RD',
        location: 'Lucknow, UP',
        amount: 12000,
        purpose: 'School fees for 2 children',
        rate: '8.0% p.a.',
        tenure: '9 months',
        trustMatch: 88,
        verified: true,
        tag: 'trust',
    },
    {
        id: 'L003',
        name: 'Sunita Kumari',
        avatar: 'SK',
        location: 'Patna, BR',
        amount: 5000,
        purpose: 'Seeds & fertilizers for kharif crop',
        rate: '6.5% p.a.',
        tenure: '4 months',
        trustMatch: 91,
        verified: true,
        tag: 'trust',
    },
    {
        id: 'L004',
        name: 'Kavita Bai',
        avatar: 'KB',
        location: 'Indore, MP',
        amount: 15000,
        purpose: 'Expand roadside food stall',
        rate: '9.0% p.a.',
        tenure: '12 months',
        trustMatch: 82,
        verified: true,
        tag: 'amber',
    },
]

// ─── Framer-Motion Variants ───────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 28 },
    },
}

const lockVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
}

// ─── Mini Trust Bar ───────────────────────────────────────────────────────────
function MiniTrustBar({ score }) {
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold text-stone-500">Your Trust Score</span>
                <span className="text-xs font-bold text-emerald-700">{score} / {P2P_TRUST_GATE}</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (score / P2P_TRUST_GATE) * 100)}%` }}
                />
            </div>
            <p className="text-[10px] text-stone-400 mt-1.5 text-center">
                {P2P_TRUST_GATE - score} more points needed
            </p>
        </div>
    )
}

// ─── Locked Overlay ───────────────────────────────────────────────────────────
function LockedOverlay({ t, trustScore, onGoToChitHub, setTrustScoreManual }) {
    const [vouchState, setVouchState] = useState('idle') // 'idle' | 'pinging'

    const handleRequestVouch = () => {
        if (vouchState !== 'idle') return
        setVouchState('pinging')
        setTimeout(() => {
            setTrustScoreManual(80)
        }, 2000)
    }

    return (
        <motion.div
            key="locked"
            variants={lockVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full flex flex-col overflow-hidden"
        >
            {/* Blurred loan teasers in the background */}
            <div className="relative flex-1 px-4 pt-4 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="glass-card p-5 mb-3"
                        style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}
                        aria-hidden="true"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100/60" />
                            <div className="flex flex-col gap-1.5">
                                <div className="h-3 bg-stone-200/70 rounded-full w-24" />
                                <div className="h-2 bg-stone-100/70 rounded-full w-16" />
                            </div>
                        </div>
                        <div className="h-4 bg-stone-200/60 rounded-full w-3/4 mb-2" />
                        <div className="h-3 bg-stone-100/60 rounded-full w-1/2" />
                    </div>
                ))}

                {/* Frosted glass lock overlay */}
                <div className="lock-overlay">
                    <div className="flex flex-col items-center gap-3 px-5 py-5 w-full">

                        {/* Lock icon */}
                        <div
                            className="
                                w-14 h-14 rounded-2xl flex items-center justify-center
                                bg-white/80 backdrop-blur-sm
                                border border-amber-200/60
                                shadow-[0_8px_32px_rgba(245,158,11,0.22)]
                                float-anim
                            "
                        >
                            <Lock size={26} strokeWidth={1.8} className="text-amber-500" />
                        </div>

                        {/* Title + body */}
                        <div className="text-center">
                            <h2 className="text-lg font-extrabold text-stone-800 mb-1">{t.lockedTitle}</h2>
                            <p className="text-xs text-stone-500 leading-relaxed">{t.lockedBody}</p>
                        </div>

                        {/* Trust progress bar */}
                        <div className="glass-card-trust w-full px-4 py-3">
                            <MiniTrustBar score={trustScore} />
                        </div>

                        {/* ── Unlock Pathways panel ── */}
                        <div className="w-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-4 flex flex-col gap-3">

                            {/* Panel label */}
                            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
                                Unlock Pathways
                            </p>

                            {/* Route A — Standard: Continue Chit Fund */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onGoToChitHub}
                                className="
                                    w-full flex items-center justify-between gap-3
                                    py-3 px-4 rounded-xl
                                    border border-stone-200/80 bg-white/40
                                    text-left transition-all duration-200
                                    hover:bg-emerald-50/50 hover:border-emerald-200/70
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-100/70 flex-shrink-0">
                                        <TrendingUp size={15} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-700">Continue Chit Fund</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">Standard path — pay cycles, earn trust</p>
                                    </div>
                                </div>
                                <ChevronRight size={15} className="text-stone-300 flex-shrink-0" />
                            </motion.button>

                            {/* Route B — Fast-Track: Community Vouch */}
                            <div
                                className="
                                    w-full rounded-xl overflow-hidden
                                    border border-amber-200/80
                                    bg-gradient-to-br from-amber-50/90 to-emerald-50/70
                                    shadow-[0_4px_20px_rgba(245,158,11,0.14)]
                                "
                            >
                                {/* Card header */}
                                <div className="px-4 pt-3 pb-2">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Sparkles size={12} className="text-amber-500" />
                                        <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">
                                            Emergency Fast-Track
                                        </span>
                                    </div>
                                    <p className="text-sm font-extrabold text-stone-800 leading-snug">
                                        Request Community Vouch
                                    </p>
                                    <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                                        Need emergency capital today? Ask a high-trust SheVest member
                                        or your NGO leader to vouch for you.
                                    </p>
                                </div>

                                {/* Vouch CTA */}
                                <div className="px-4 pb-3">
                                    <motion.button
                                        onClick={handleRequestVouch}
                                        disabled={vouchState === 'pinging'}
                                        whileHover={vouchState === 'idle' ? { scale: 1.02 } : {}}
                                        whileTap={vouchState === 'idle' ? { scale: 0.97 } : {}}
                                        className={`
                                            w-full flex items-center justify-center gap-2
                                            py-2.5 rounded-xl text-sm font-bold
                                            transition-all duration-300
                                            ${
                                                vouchState === 'pinging'
                                                    ? 'bg-amber-100/80 text-amber-600 border border-amber-200/60 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-amber-400 to-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.28)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.38)]'
                                            }
                                        `}
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {vouchState === 'pinging' ? (
                                                <motion.span
                                                    key="pinging"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
                                                        className="inline-flex"
                                                    >
                                                        <Loader2 size={15} />
                                                    </motion.span>
                                                    Pinging local SHG…
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="idle"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Users size={15} />
                                                    Request Vouch
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Loan Card ────────────────────────────────────────────────────────────────
function LoanCard({ loan, t }) {
    const [funded, setFunded] = useState(false)

    return (
        <motion.div variants={cardVariants}>
            <GlassCard variant="base" padding="p-0" className="overflow-hidden">
                {/* Top section */}
                <div className="p-4 pb-3">
                    <div className="flex items-start gap-3">
                        <span
                            className="
                w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                text-sm font-bold text-white
                bg-gradient-to-br from-brand-500 to-brand-700
                shadow-[0_4px_12px_rgba(16,185,129,0.30)]
              "
                        >
                            {loan.avatar}
                        </span>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-stone-800 text-sm">{loan.name}</span>
                                {loan.verified && (
                                    <PillTag color="trust" icon={ShieldCheck} label={t.loanVerified} size="sm" />
                                )}
                            </div>
                            <p className="text-xs text-stone-400 mt-0.5">{loan.location}</p>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0">
                            <div className="flex items-center gap-1">
                                <Star size={11} className="text-amber-500 fill-amber-500" />
                                <span className="text-sm font-extrabold text-stone-700">{loan.trustMatch}%</span>
                            </div>
                            <span className="text-[9px] text-stone-400">{t.matchScore}</span>
                        </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                        <span className="font-semibold text-stone-700">{t.purpose}:</span>{' '}
                        {loan.purpose}
                    </p>
                </div>

                {/* Stats row */}
                <div
                    className="flex items-center divide-x divide-stone-100/60 px-4 py-3"
                    style={{ background: 'rgba(167,243,208,0.08)' }}
                >
                    <div className="flex-1 flex flex-col items-center gap-0.5 pr-3">
                        <span className="flex items-center gap-0.5 text-base font-extrabold text-emerald-700">
                            <IndianRupee size={14} strokeWidth={2.5} />
                            {loan.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-400">{t.loanSeeks}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-0.5 px-3">
                        <span className="flex items-center gap-0.5 text-sm font-bold text-stone-700">
                            <Percent size={12} />
                            {loan.rate}
                        </span>
                        <span className="text-[10px] text-stone-400">{t.loanRate}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-0.5 pl-3">
                        <span className="flex items-center gap-0.5 text-sm font-bold text-stone-700">
                            <Clock size={12} />
                            {loan.tenure}
                        </span>
                        <span className="text-[10px] text-stone-400">{t.loanDays}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="px-4 py-3">
                    <button
                        id={`fund-loan-${loan.id}`}
                        onClick={() => setFunded(f => !f)}
                        className={`
              w-full flex items-center justify-center gap-2
              py-3 rounded-2xl text-sm font-bold
              transition-all duration-300
              ${funded
                                ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/60'
                                : 'btn-emerald'
                            }
            `}
                    >
                        {funded
                            ? <><ShieldCheck size={16} /> Interest Committed!</>
                            : <>{t.fundLoan} <ChevronRight size={16} /></>
                        }
                    </button>
                </div>
            </GlassCard>
        </motion.div>
    )
}

// ─── Unlocked Marketplace ─────────────────────────────────────────────────────
function UnlockedMarketplace({ t }) {
    return (
        <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="h-full"
        >
            <div className="scroll-area px-4 py-4 pb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="section-title text-xl">{t.p2pTitle}</h1>
                        <p className="section-subtitle mt-0.5">{t.p2pSubtitle}</p>
                    </div>
                    <PillTag color="trust" icon={ShieldCheck} label="Unlocked" pulse size="sm" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                >
                    <GlassCard variant="trust" padding="px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-emerald-600 flex-shrink-0" />
                            <p className="text-xs font-semibold text-emerald-800">
                                You've earned P2P access through verified Chit cycles. Lend responsibly.
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-4"
                >
                    {LOANS.map(loan => (
                        <LoanCard key={loan.id} loan={loan} t={t} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function P2PMarketplace() {
    const { t, trustScore, isP2PUnlocked, setTrustScoreManual } = useApp()
    const navigate = useNavigate()

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
                {isP2PUnlocked ? (
                    <UnlockedMarketplace key="unlocked" t={t} />
                ) : (
                    <LockedOverlay
                        key="locked"
                        t={t}
                        trustScore={trustScore}
                        onGoToChitHub={() => navigate('/chithub')}
                        setTrustScoreManual={setTrustScoreManual}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
