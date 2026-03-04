import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Users, ShieldCheck } from 'lucide-react'
import { useLanguage, T } from '../App'

const tabs = [
    { to: '/dashboard', icon: BookOpen, key: 'dashboard' },
    { to: '/market', icon: Users, key: 'marketplace' },
    { to: '/legal', icon: ShieldCheck, key: 'legal' },
]

export default function BottomNav() {
    const { pathname } = useLocation()
    const { lang } = useLanguage()
    const t = T[lang]

    return (
        <nav className="glass-bottom-nav flex-shrink-0 px-2 pt-2 pb-safe-bottom">
            <div className="flex justify-around items-center h-16">
                {tabs.map(({ to, icon: Icon, key }) => {
                    const active = pathname.startsWith(to)
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl
                          transition-all duration-200 group
                          ${active
                                    ? 'bg-emerald-50/80 text-emerald-700'
                                    : 'text-stone-400 hover:text-emerald-500'}`}
                        >
                            {/* Icon container with soft glow when active */}
                            <span className={`p-1.5 rounded-xl transition-all duration-200
                                ${active
                                    ? 'bg-emerald-100/80 shadow-[0_0_12px_2px_rgba(5,150,105,0.20)]'
                                    : 'group-hover:bg-stone-50'}`}>
                                <Icon
                                    size={22}
                                    strokeWidth={active ? 2.2 : 1.8}
                                    className="transition-all duration-200"
                                />
                            </span>
                            <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200
                                ${active ? 'text-emerald-700' : 'text-stone-400'}`}>
                                {key === 'marketplace' ? t.marketplace
                                    : key === 'legal' ? t.legal
                                        : t.dashboard}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
