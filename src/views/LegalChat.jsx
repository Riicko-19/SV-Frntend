/**
 * views/LegalChat.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 5 — AI Legal Bodyguard Chat View
 *
 * Features:
 *   · Conversational chat UI with AI assistant persona "SheVest AI"
 *   · Prominent Crimson "Report Threat" button (pulse-ring animation)
 *   · Auto-scroll to latest message
 *   · Typing indicator (3-dot animation)
 *   · Opens FirModal when user sends a message AND taps "Report Threat"
 *   · Bilingual (EN/HI) via AppContext
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, ShieldAlert, ShieldCheck, Mic, ChevronDown } from 'lucide-react'
import FirModal from '../components/FirModal'
import PillTag from '../components/PillTag'
import { useApp } from '../context/AppContext'

// ─── Initial AI greeting messages ────────────────────────────────────────────
const getInitialMessages = (t) => [
    {
        id: 'm0',
        role: 'ai',
        text: `Namaste 🙏 I am **SheVest Legal AI**, your confidential legal assistant. I am trained on BNS 2023, IT Act, and PMLA to help protect you from financial harassment.`,
        time: now(),
    },
    {
        id: 'm1',
        role: 'ai',
        text: `You can describe any threat, harassment, or coercive behaviour you have faced — related to your Chit Fund or P2P loan. I will help you understand your legal rights and draft an Auto-FIR if needed.`,
        time: now(),
    },
]

function now() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// ─── AI response simulation ───────────────────────────────────────────────────
const AI_RESPONSES = [
    (incident) =>
        `I've recorded your statement. Based on what you've described — **"${incident.substring(0, 60)}${incident.length > 60 ? '…' : ''}"** — this appears to constitute financial coercion under **BNS Section 308(2)**. Tap **Report Threat** to generate your Auto-FIR draft.`,
    () =>
        `This behaviour is illegal. Under BNS 308(2) — Extortion, threatening a person to coerce payment is a cognisable and non-bailable offence. You have the right to file an FIR at your nearest police station. Would you like me to draft it?`,
    () =>
        `Your privacy is protected. All details you share here are end-to-end encrypted and can only be used for legal proceedings with your explicit consent. You can tap **Report Threat** at any time to initiate the Auto-FIR process.`,
]

let aiResponseIdx = 0

// ─── Components ───────────────────────────────────────────────────────────────

function TypingIndicator() {
    return (
        <div className="flex items-center gap-3 mb-3">
            {/* AI avatar */}
            <span className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
                <ShieldCheck size={13} strokeWidth={2.5} className="text-white" />
            </span>
            {/* Bubble */}
            <div className="chat-bubble-ai flex items-center gap-1 py-3 px-4">
                <span className="typing-dot w-2 h-2 rounded-full bg-stone-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-stone-400" style={{ animationDelay: '0.2s' }} />
                <span className="typing-dot w-2 h-2 rounded-full bg-stone-400" style={{ animationDelay: '0.4s' }} />
            </div>
        </div>
    )
}

function ChatBubble({ msg }) {
    const isUser = msg.role === 'user'
    return (
        <div className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {!isUser && (
                <span className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm mb-1">
                    <ShieldCheck size={13} strokeWidth={2.5} className="text-white" />
                </span>
            )}

            {/* Bubble */}
            <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    {/* Render simple bold markdown */}
                    <p className="leading-relaxed whitespace-pre-wrap text-sm">
                        {msg.text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                            i % 2 === 1
                                ? <strong key={i} className={isUser ? 'font-extrabold' : 'font-bold text-emerald-700'}>{part}</strong>
                                : part
                        )}
                    </p>
                </div>
                <span className="text-[10px] text-stone-400 px-1">{msg.time}</span>
            </div>
        </div>
    )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function LegalChat() {
    const { t, lang } = useApp()

    const [messages, setMessages] = useState(() => getInitialMessages(t))
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [firOpen, setFirOpen] = useState(false)
    const [lastIncident, setLastIncident] = useState('')
    const [showScrollBtn, setShowScroll] = useState(false)

    const bottomRef = useRef(null)
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Detect scroll position for scroll-to-bottom button
    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
        setShowScroll(!atBottom)
    }

    const sendMessage = useCallback(async () => {
        const text = input.trim()
        if (!text) return

        const userMsg = { id: `u-${Date.now()}`, role: 'user', text, time: now() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLastIncident(text)
        setIsTyping(true)
        inputRef.current?.focus()

        // Simulate AI response delay (1.5–2.5s)
        const delay = 1500 + Math.random() * 1000
        await new Promise(r => setTimeout(r, delay))

        const aiText = AI_RESPONSES[aiResponseIdx % AI_RESPONSES.length](text)
        aiResponseIdx++
        const aiMsg = { id: `a-${Date.now()}`, role: 'ai', text: aiText, time: now() }

        setIsTyping(false)
        setMessages(prev => [...prev, aiMsg])
    }, [input])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleReportThreat = () => {
        setFirOpen(true)
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ── Subheader ── */}
            <div className="glass-nav px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-stone-800">{t.legalTitle}</span>
                    <span className="text-[10px] text-stone-400">{t.legalSubtitle}</span>
                </div>
                <PillTag color="trust" icon={ShieldCheck} label="Encrypted" size="sm" />
            </div>

            {/* ── Chat scroll area ── */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scroll-area px-4 py-4 relative"
            >
                {messages.map(msg => (
                    <ChatBubble key={msg.id} msg={msg} />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={bottomRef} className="h-1" />

                {/* Scroll to bottom button */}
                {showScrollBtn && (
                    <button
                        onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="
              absolute bottom-4 right-4
              w-9 h-9 rounded-full glass-card
              flex items-center justify-center
              text-stone-500 hover:text-emerald-600
              shadow-glass transition-all duration-200
            "
                        aria-label="Scroll to bottom"
                    >
                        <ChevronDown size={18} />
                    </button>
                )}
            </div>

            {/* ── Report Threat CTA ── */}
            <div className="px-4 pt-2 flex-shrink-0">
                <button
                    id="report-threat-btn"
                    onClick={handleReportThreat}
                    className="btn-crimson w-full pulse-ring"
                    aria-haspopup="dialog"
                >
                    <ShieldAlert size={18} />
                    {t.reportThreat}
                </button>
            </div>

            {/* ── Message Input ── */}
            <div className="px-4 pt-2.5 pb-3 flex-shrink-0">
                <div className="flex items-end gap-2">
                    {/* Mic button */}
                    <button
                        className="
              w-11 h-11 flex-shrink-0 rounded-2xl
              glass-card flex items-center justify-center
              text-stone-400 hover:text-brand-600
              hover:shadow-trust transition-all duration-200
            "
                        aria-label="Voice input"
                    >
                        <Mic size={18} />
                    </button>

                    {/* Text area */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            id="legal-chat-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.chatPlaceholder}
                            rows={1}
                            className="
                input-glass resize-none min-h-[44px] max-h-28
                pr-12 py-3 text-sm
              "
                            style={{ lineHeight: '1.5' }}
                            aria-label="Message input"
                        />
                    </div>

                    {/* Send button */}
                    <button
                        id="send-message-btn"
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="
              w-11 h-11 flex-shrink-0 rounded-2xl flex items-center justify-center
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-gradient-to-br from-brand-500 to-brand-700
              text-white shadow-trust
              hover:shadow-trust-lg hover:scale-105
              active:scale-95
            "
                        aria-label={t.sendMessage}
                    >
                        <Send size={17} strokeWidth={2.2} />
                    </button>
                </div>
            </div>

            {/* ── FIR Modal ── */}
            <FirModal
                isOpen={firOpen}
                onClose={() => setFirOpen(false)}
                incident={lastIncident}
                lang={lang}
            />
        </div>
    )
}
