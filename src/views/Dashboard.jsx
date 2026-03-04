import { Shield, TrendingUp, Clock, Wallet, ChevronRight, Star } from 'lucide-react'
import PillTag from '../components/PillTag'
import { useLanguage, T } from '../App'

// Quick stat card
function StatCard({ icon: Icon, value, label, color = 'emerald' }) {
    return (
        <div className="glass-card p-4 flex flex-col gap-1 flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1
                       ${color === 'emerald' ? 'bg-emerald-100 text-emerald-600'
                    : color === 'sky' ? 'bg-sky-100     text-sky-600'
                        : 'bg-amber-100   text-amber-600'}`}>
                <Icon size={16} strokeWidth={2} />
            </div>
            <p className="text-lg font-black text-stone-800 leading-none">{value}</p>
            <p className="text-[10px] font-medium text-stone-400 leading-tight">{label}</p>
        </div>
    )
}

// Recent activity row
function ActivityRow({ emoji, title, amount, date, type }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-white/60 last:border-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100
                      flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                {emoji}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-700 truncate">{title}</p>
                <p className="text-[11px] text-stone-400">{date}</p>
            </div>
            <span className={`text-sm font-black ${type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {type === 'credit' ? '+' : '−'}₹{amount}
            </span>
        </div>
    )
}

export default function Dashboard() {
    const { lang, toggleLang } = useLanguage()
    const t = T[lang]

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ── Top Bar ─────────────────────────────────────────── */}
            <header className="glass-nav px-5 py-3 flex items-center justify-between flex-shrink-0 z-10">
                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500
                          flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-black text-base">P</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-stone-800 leading-tight">Priya Sharma</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">{t.verified} · SHG Member</p>
                    </div>
                </div>

                {/* Language Toggle Pill */}
                <button
                    onClick={toggleLang}
                    className="glass-card px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer
                     hover:bg-emerald-50/60 active:scale-95 transition-all duration-150
                     rounded-full border border-emerald-200/60"
                >
                    <span className={`text-xs font-bold transition-all ${lang === 'EN' ? 'text-emerald-700' : 'text-stone-400'}`}>EN</span>
                    <span className="text-stone-300 text-xs">/</span>
                    <span className={`text-xs font-bold transition-all ${lang === 'HI' ? 'text-emerald-700' : 'text-stone-400'}`}>अ</span>
                </button>
            </header>

            {/* ── Scrollable Content ──────────────────────────────── */}
            <div className="scroll-area px-4 py-4 space-y-4">

                {/* ── Hero Capital Card ─────────────────────────────── */}
                <div className="glass-card-lg p-6 relative overflow-hidden">

                    {/* Background decorative circles */}
                    <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full
                          bg-gradient-to-br from-emerald-300/20 to-teal-400/15 blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full
                          bg-gradient-to-tr from-teal-200/20 to-sky-200/15 blur-xl" />

                    {/* Trust Score Pill */}
                    <div className="flex items-center justify-between mb-5 relative">
                        <PillTag
                            color="emerald"
                            icon={<Shield size={12} strokeWidth={2.5} className="text-emerald-600" />}
                            label={`${t.trustScore}: 98`}
                        />
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={12} fill="#059669" stroke="none" />
                            ))}
                        </div>
                    </div>

                    {/* Capital Amount */}
                    <div className="relative">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
                            {t.activeCapital}
                        </p>
                        <p className="text-6xl font-black text-emerald-800 leading-none tracking-tight">
                            ₹5,000
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-600">+12% this month</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />

                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <span className="text-[11px] font-medium text-stone-500">Repayment Progress</span>
                            <span className="text-[11px] font-bold text-emerald-700">78%</span>
                        </div>
                        <div className="h-2 bg-emerald-100/60 rounded-full overflow-hidden">
                            <div className="h-full w-[78%] bg-gradient-to-r from-emerald-400 to-teal-500
                              rounded-full shadow-sm transition-all duration-700" />
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats Row ────────────────────────────────── */}
                <div className="flex gap-3">
                    <StatCard
                        icon={Wallet}
                        value="7"
                        label={t.loansFunded}
                        color="emerald"
                    />
                    <StatCard
                        icon={TrendingUp}
                        value="98%"
                        label={t.repaymentRate}
                        color="sky"
                    />
                    <StatCard
                        icon={Clock}
                        value="142"
                        label={t.days}
                        color="amber"
                    />
                </div>

                {/* ── Recent Activity ────────────────────────────────── */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-stone-700">Recent Activity</h3>
                        <button className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                            All <ChevronRight size={12} />
                        </button>
                    </div>

                    <ActivityRow emoji="🧵" title="Funded: Meena's Tailoring Shop" amount="500" date="2 Mar 2026" type="debit" />
                    <ActivityRow emoji="🍎" title="Repayment: Sunita's Produce Stall" amount="250" date="28 Feb 2026" type="credit" />
                    <ActivityRow emoji="🧼" title="Funded: Rekha's Soap Business" amount="1,000" date="22 Feb 2026" type="debit" />
                    <ActivityRow emoji="✅" title="Interest Earned" amount="85" date="20 Feb 2026" type="credit" />
                </div>

                {/* Bottom spacer */}
                <div className="h-2" />
            </div>
        </div>
    )
}
