import { useState, useRef, useEffect } from 'react'
import { Send, Languages } from 'lucide-react'
import FirModal from '../components/FirModal'
import { useLanguage, T } from '../App'

// Chat data
const INITIAL_MESSAGES = [
    {
        id: 1,
        from: 'lender',
        name: 'Ramesh K.',
        text: 'Priya ji, aapka EMI abhi tak nahi aaya. Kab dogi?',
        translation: 'Priya, your EMI has not arrived yet. When will you pay?',
        time: '6:42 PM',
        showTranslation: true,
    },
    {
        id: 2,
        from: 'me',
        text: 'Sir, please give me 2 more days. My payment from the shop is delayed.',
        time: '6:44 PM',
        showTranslation: false,
    },
    {
        id: 3,
        from: 'lender',
        name: 'Ramesh K.',
        text: 'Aaj raat tak ₹2,000 nahi diye toh ghar pe aaonga. Pariwar ko dekhna padega.',
        translation: '"Pay ₹2,000 by tonight or I will come to your house. Your family will face consequences."',
        time: '6:47 PM',
        showTranslation: true,
        isThreat: true,
    },
]

// Chat bubble component
function ChatBubble({ msg }) {
    const isMe = msg.from === 'me'

    return (
        <div className={`flex flex-col gap-1 max-w-[78%] fade-in
                     ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>

            {/* Sender name for lender messages */}
            {!isMe && (
                <p className="text-[10px] font-semibold text-stone-400 px-1">{msg.name}</p>
            )}

            {/* Bubble */}
            <div className={`px-4 py-2.5 rounded-3xl relative
                       ${isMe
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-lg shadow-md'
                    : msg.isThreat
                        ? 'glass-card border border-red-200/60 bg-red-50/60 text-stone-800 rounded-tl-lg'
                        : 'glass-card text-stone-800 rounded-tl-lg'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>

                {/* Threat indicator */}
                {msg.isThreat && (
                    <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wide">
                            ⚠ Potential threat detected
                        </span>
                    </div>
                )}
            </div>

            {/* Auto-translate indicator */}
            {msg.showTranslation && msg.translation && (
                <div className="flex items-start gap-1 px-1 max-w-full">
                    <Languages size={10} className="text-sky-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-[10px] leading-relaxed italic
                         ${msg.isThreat ? 'text-rose-500 font-medium' : 'text-sky-500'}`}>
                        {msg.translation}
                    </p>
                </div>
            )}

            {/* Time */}
            <p className="text-[9px] text-stone-400 px-1">{msg.time}</p>
        </div>
    )
}

export default function LegalBodyguard() {
    const { lang } = useLanguage()
    const t = T[lang]
    const [messages, setMessages] = useState(INITIAL_MESSAGES)
    const [inputText, setInputText] = useState('')
    const [showFir, setShowFir] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        const text = inputText.trim()
        if (!text) return
        setMessages(prev => [...prev, {
            id: Date.now(),
            from: 'me',
            text,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            showTranslation: false,
        }])
        setInputText('')
    }

    return (
        <div className="h-full flex flex-col overflow-hidden relative">

            {/* ── Top Bar ─────────────────────────────────────────── */}
            <header className="glass-nav px-4 py-3 flex items-center justify-between flex-shrink-0 z-10">
                {/* Contact info */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500
                          flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-black text-base">R</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-stone-800">Ramesh K. (Lender)</p>
                        <p className="text-[10px] text-stone-400">Auto-translated · Hindi → English</p>
                    </div>
                </div>

                {/* 🚨 Report Threat Button */}
                <button
                    onClick={() => setShowFir(true)}
                    className="pulse-ring flex items-center gap-1.5 px-3.5 py-2
                     bg-gradient-to-r from-rose-500 to-red-600
                     text-white text-xs font-bold rounded-2xl
                     shadow-[0_4px_16px_rgba(220,38,38,0.40)]
                     hover:shadow-[0_4px_24px_rgba(220,38,38,0.55)]
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200"
                >
                    🚨 <span className="hidden xs:inline">Report</span> Threat
                </button>
            </header>

            {/* ── Chat Feed ──────────────────────────────────────── */}
            <div className="scroll-area px-4 py-4 flex flex-col gap-3">
                {/* Date separator */}
                <div className="flex items-center gap-2 justify-center">
                    <div className="h-px flex-1 bg-stone-200/60" />
                    <span className="text-[10px] text-stone-400 font-medium px-2">Today, 4 Mar 2026</span>
                    <div className="h-px flex-1 bg-stone-200/60" />
                </div>

                {/* AI safety notice */}
                <div className="glass-card px-3 py-2 flex items-start gap-2 bg-sky-50/60">
                    <Languages size={14} className="text-sky-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-sky-700 leading-relaxed">
                        <strong>SheVest AI Shield is active.</strong> Messages are being monitored for threats.
                        Auto-translation enabled.
                    </p>
                </div>

                {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
                <div ref={bottomRef} />
            </div>

            {/* ── Message Input ─────────────────────────────────── */}
            <div className="glass-bottom-nav px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex-1 glass-card px-4 py-2.5 flex items-center gap-2 rounded-2xl">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={t.chatPlaceholder}
                            className="flex-1 bg-transparent text-sm text-stone-700
                         placeholder:text-stone-400 outline-none min-w-0"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="w-11 h-11 btn-emerald rounded-2xl flex items-center justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed p-0"
                    >
                        <Send size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* ── FIR Modal Overlay ─────────────────────────────── */}
            {showFir && <FirModal onClose={() => setShowFir(false)} />}
        </div>
    )
}
