import { useState, useEffect } from 'react'
import { Shield, X, Download, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

// ── Stage 1: Loading animation ───────────────────────────────────────────────
function FirLoading() {
    const [dots, setDots] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setDots(d => (d + 1) % 4), 500)
        return () => clearInterval(id)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-6 fade-in">
            {/* Animated AI scan ring */}
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-red-400/40 animate-ping"
                    style={{ animationDelay: '0.3s' }} />
                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-900/60 to-slate-900/80
                        border border-red-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <Loader2 size={32} className="text-red-400 animate-spin" />
                </div>
            </div>

            {/* Analysis text */}
            <div className="text-center space-y-2">
                <p className="text-red-300 font-bold text-base tracking-wide">
                    🔍 Gemini Auto-FIR Analysis in Progress{'.'.repeat(dots)}
                </p>
                <p className="text-slate-400 text-xs">
                    Scanning chat logs for threat patterns & BNS violations
                </p>
            </div>

            {/* Progress steps */}
            <div className="w-full space-y-2 px-2">
                {[
                    { label: 'Extracting conversation context', done: true, delay: 0 },
                    { label: 'Identifying threat language', done: true, delay: 0.3 },
                    { label: 'Cross-referencing BNS codes', done: false, delay: 0.6 },
                    { label: 'Drafting legal FIR document', done: false, delay: 0.9 },
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3"
                        style={{ animation: `fadeIn 0.4s ease ${step.delay}s both` }}>
                        {step.done
                            ? <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                            : <Loader2 size={14} className="text-red-400 animate-spin flex-shrink-0" />
                        }
                        <p className={`text-xs ${step.done ? 'text-slate-300' : 'text-slate-500'}`}>
                            {step.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Stage 2: Legal FIR Document ──────────────────────────────────────────────
function FirDocument() {
    return (
        <div className="fade-in space-y-4">
            {/* Header badge */}
            <div className="flex items-center justify-center gap-2 p-3
                      bg-red-500/20 rounded-2xl border border-red-500/30">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="text-red-300 text-xs font-bold uppercase tracking-widest">
                    Auto-Generated Legal Draft
                </span>
                <AlertTriangle size={16} className="text-red-400" />
            </div>

            {/* FIR Document */}
            <div className="bg-slate-800/60 rounded-2xl border border-red-500/20 p-4 space-y-3
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">

                {/* Document title */}
                <div className="text-center border-b border-red-500/20 pb-3">
                    <p className="text-red-200 font-black text-sm tracking-widest uppercase">
                        FIRST INFORMATION REPORT
                    </p>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                        Bharatiya Nagarik Suraksha Sanhita, 2023 | Auto-FIR Draft #2026-03-04
                    </p>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[
                        ['Date', '04 March 2026'],
                        ['Time', '19:08 IST'],
                        ['Platform', 'SheVest App (P2P)'],
                        ['Report ID', 'SHV-FIR-7742'],
                    ].map(([k, v]) => (
                        <div key={k} className="bg-slate-700/40 rounded-xl p-2">
                            <p className="text-slate-500 uppercase tracking-wide text-[9px]">{k}</p>
                            <p className="text-slate-200 font-semibold mt-0.5">{v}</p>
                        </div>
                    ))}
                </div>

                {/* Complainant */}
                <div className="bg-slate-700/40 rounded-xl p-3">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Complainant</p>
                    <p className="text-slate-200 text-xs font-semibold">Priya Sharma</p>
                    <p className="text-slate-400 text-[10px]">Verified SHG Member — UID: SHV-U-0421</p>
                </div>

                {/* Threat Evidence */}
                <div className="bg-red-900/30 rounded-xl p-3 border border-red-500/20">
                    <p className="text-[9px] text-red-400 uppercase tracking-wide mb-2 font-bold">
                        Extracted Threat Evidence
                    </p>
                    <div className="space-y-1.5">
                        {[
                            '"Pay ₹2,000 by tonight or I will come to your house."',
                            '"Your family will face consequences if you ignore me."',
                        ].map((quote, i) => (
                            <div key={i} className="flex gap-2 items-start">
                                <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">▸</span>
                                <p className="text-red-200 text-[10px] italic leading-relaxed">{quote}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BNS Violation - highlighted */}
                <div className="bg-gradient-to-r from-red-900/40 to-rose-900/30 rounded-xl p-3
                        border border-red-400/30 shadow-[0_0_16px_rgba(220,38,38,0.15)]">
                    <p className="text-[9px] text-red-400 uppercase tracking-widest mb-2 font-black">
                        ⚖ Applicable Legal Codes
                    </p>
                    <div className="space-y-2">
                        <div>
                            <p className="text-red-200 text-xs font-black">BNS Section 308(2) — Extortion</p>
                            <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                                Whosoever commits extortion by putting a person in fear of death or grievous
                                hurt shall be punished with rigorous imprisonment up to 10 years with fine.
                            </p>
                        </div>
                        <div className="h-px bg-red-500/20" />
                        <div>
                            <p className="text-red-200 text-xs font-bold">BNS Section 351(2) — Criminal Intimidation</p>
                            <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                                Threatening with injury to person, reputation, or property — imprisonment
                                up to 2 years, fine, or both.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-emerald-900/20 rounded-xl p-2.5 border border-emerald-500/20">
                    <p className="text-emerald-400 text-[10px] font-semibold">
                        ✓ This draft is ready to be submitted at your nearest police station or via the
                        National Cybercrime Reporting Portal (cybercrime.gov.in).
                    </p>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={() => alert('PDF generation would be handled by backend in production.')}
                className="w-full flex items-center justify-center gap-3 py-4
                   bg-gradient-to-r from-red-600 to-rose-600
                   text-white font-black rounded-2xl text-sm tracking-wide
                   shadow-[0_4px_24px_rgba(220,38,38,0.45)]
                   hover:shadow-[0_6px_32px_rgba(220,38,38,0.6)]
                   hover:scale-[1.01] active:scale-[0.99]
                   transition-all duration-200"
            >
                <Download size={16} strokeWidth={2.5} />
                ↓ Download Legal PDF
            </button>
        </div>
    )
}

// ── Main FIR Modal ───────────────────────────────────────────────────────────
export default function FirModal({ onClose }) {
    const [stage, setStage] = useState('loading') // 'loading' | 'document'

    useEffect(() => {
        const timer = setTimeout(() => setStage('document'), 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        /* Backdrop */
        <div className="absolute inset-0 z-50 flex items-end justify-center p-0"
            style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>

            {/* Modal sheet */}
            <div className="modal-enter w-full max-h-[90vh]
                      bg-slate-900/85 backdrop-blur-2xl
                      border-t border-x border-red-500/50
                      rounded-t-3xl overflow-hidden flex flex-col
                      shadow-[0_-8px_64px_rgba(220,38,38,0.25)]">

                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4
                        border-b border-red-500/20 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40
                            flex items-center justify-center">
                            <Shield size={16} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm">Legal Bodyguard</p>
                            <p className="text-red-400 text-[10px] font-semibold">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20
                       flex items-center justify-center transition-colors"
                    >
                        <X size={16} className="text-slate-300" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="scroll-area p-5">
                    {stage === 'loading' ? <FirLoading /> : <FirDocument />}
                    <div className="h-4" />
                </div>
            </div>
        </div>
    )
}
