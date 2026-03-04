import { useState } from 'react'
import { Map, List, Search } from 'lucide-react'
import PillTag from '../components/PillTag'
import { useLanguage, T } from '../App'

// Borrower data
const BORROWERS = [
    {
        id: 1,
        initials: 'M',
        name: 'Meena Devi',
        gradient: 'from-amber-400 to-orange-500',
        business: '🧵 Tailoring Shop',
        pillColor: 'yellow',
        pillEmoji: '🧵',
        pillLabel: 'Tailoring',
        amount: '₹2,500',
        trust: 94,
        location: 'Jaipur, RJ',
        purpose: 'New industrial sewing machine',
        daysLeft: 5,
    },
    {
        id: 2,
        initials: 'S',
        name: 'Sunita Patel',
        gradient: 'from-emerald-400 to-teal-500',
        business: '🍎 Produce Stall',
        pillColor: 'emerald',
        pillEmoji: '🍎',
        pillLabel: 'Produce',
        amount: '₹1,200',
        trust: 88,
        location: 'Ahmedabad, GJ',
        purpose: 'Expand seasonal inventory',
        daysLeft: 12,
    },
    {
        id: 3,
        initials: 'R',
        name: 'Rekha Kumari',
        gradient: 'from-sky-400 to-blue-500',
        business: '🧼 Soap Business',
        pillColor: 'sky',
        pillEmoji: '🧼',
        pillLabel: 'Soap Making',
        amount: '₹800',
        trust: 91,
        location: 'Pune, MH',
        purpose: 'Raw material procurement',
        daysLeft: 3,
    },
    {
        id: 4,
        initials: 'A',
        name: 'Anjali Singh',
        gradient: 'from-rose-400 to-pink-500',
        business: '🪴 Nursery & Plants',
        pillColor: 'orange',
        pillEmoji: '🪴',
        pillLabel: 'Nursery',
        amount: '₹3,000',
        trust: 97,
        location: 'Lucknow, UP',
        purpose: 'Greenhouse expansion',
        daysLeft: 8,
    },
]

// Map placeholder component
function MapPlaceholder({ t }) {
    return (
        <div className="flex-1 mx-4 mb-4 glass-card overflow-hidden flex flex-col items-center justify-center gap-4 min-h-[400px]">
            {/* Stylised map grid */}
            <div className="relative w-full h-full min-h-[280px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl overflow-hidden">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#059669" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Map pins */}
                {[
                    { top: '25%', left: '30%', label: 'Meena', color: 'bg-amber-400' },
                    { top: '55%', left: '60%', label: 'Sunita', color: 'bg-emerald-500' },
                    { top: '70%', left: '25%', label: 'Rekha', color: 'bg-sky-500' },
                    { top: '35%', left: '75%', label: 'Anjali', color: 'bg-rose-400' },
                ].map(pin => (
                    <div key={pin.label}
                        className="absolute flex flex-col items-center"
                        style={{ top: pin.top, left: pin.left }}>
                        <div className={`w-8 h-8 ${pin.color} rounded-full border-2 border-white
                             shadow-lg flex items-center justify-center
                             animate-bounce`}
                            style={{ animationDuration: '2s', animationDelay: Math.random() * 0.5 + 's' }}>
                            <span className="text-white text-[10px] font-black">{pin.label[0]}</span>
                        </div>
                        <div className={`w-1.5 h-3 ${pin.color} rounded-full opacity-70 -mt-0.5`} />
                        <span className="text-[9px] font-bold text-stone-600 mt-0.5 bg-white/80
                             px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                            {pin.label}
                        </span>
                    </div>
                ))}

                {/* Label */}
                <div className="absolute bottom-3 left-3 right-3">
                    <div className="glass-card py-2 px-3 text-center">
                        <p className="text-[11px] font-semibold text-stone-500">📍 Showing 4 active borrowers near you</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Borrower card component
function BorrowerCard({ b, t }) {
    const [funded, setFunded] = useState(false)

    return (
        <div className="glass-card mx-4 p-5 fade-in">
            {/* Header row */}
            <div className="flex items-start gap-3 mb-4">
                {/* 3D Avatar */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.gradient}
                         flex items-center justify-center shadow-lg flex-shrink-0
                         ring-2 ring-white`}>
                    <span className="text-white font-black text-lg">{b.initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-sm font-bold text-stone-800">{b.name}</p>
                            <p className="text-[11px] text-stone-400">{b.location}</p>
                        </div>
                        <PillTag color="stone" label={`🛡 ${b.trust}`} size="sm" />
                    </div>
                </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-3">
                <PillTag color={b.pillColor} icon={b.pillEmoji} label={b.pillLabel} size="sm" />
                <PillTag color="rose" icon="⏳" label={`${b.daysLeft}d left`} size="sm" />
            </div>

            {/* Purpose */}
            <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">{b.purpose}</p>

            {/* Amount + CTA */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-stone-400 font-medium">{t.sought}</p>
                    <p className="text-xl font-black text-emerald-800">{b.amount}</p>
                </div>

                <button
                    onClick={() => setFunded(f => !f)}
                    className={`transition-all duration-300 rounded-2xl px-5 py-2.5 text-sm font-bold shadow-md
                       ${funded
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'btn-emerald'}`}
                >
                    {funded ? '✓ Funded!' : t.fundLoan}
                </button>
            </div>
        </div>
    )
}

export default function Marketplace() {
    const { lang } = useLanguage()
    const t = T[lang]
    const [view, setView] = useState('list') // 'list' | 'map'

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ── Top Bar ─────────────────────────────────────────── */}
            <header className="glass-nav px-5 py-3 flex-shrink-0 z-10">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg font-black text-stone-800">Community Loans</h1>
                    <button className="w-9 h-9 glass-card rounded-xl flex items-center justify-center
                             text-stone-500 hover:text-emerald-600 transition-colors">
                        <Search size={17} strokeWidth={2} />
                    </button>
                </div>

                {/* List / Map Toggle */}
                <div className="glass-card p-1 flex rounded-2xl">
                    {[
                        { key: 'list', Icon: List, label: t.listView },
                        { key: 'map', Icon: Map, label: t.mapView },
                    ].map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setView(key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
                          text-xs font-bold transition-all duration-200
                          ${view === key
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-stone-500 hover:text-emerald-600'}`}
                        >
                            <Icon size={14} strokeWidth={2} />
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Content ─────────────────────────────────────────── */}
            {view === 'map' ? (
                <MapPlaceholder t={t} />
            ) : (
                <div className="scroll-area py-4 space-y-4">
                    {BORROWERS.map(b => <BorrowerCard key={b.id} b={b} t={t} />)}
                    <div className="h-2" />
                </div>
            )}
        </div>
    )
}
