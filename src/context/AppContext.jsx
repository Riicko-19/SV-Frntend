/**
 * context/AppContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SheVest Global State
 *
 * Manages:
 *   · language            — 'EN' | 'HI'
 *   · trustScore          — 0–100  (chit participation derived)
 *   · chitCyclesCompleted — 0–N
 *   · isAuthenticated     — boolean
 *   · userRole            — 'borrower' | 'ngo_admin' | null
 *
 * Auth actions:  login(role)  |  logout()  |  toggleRole()
 * Demo actions:  setTrustScoreManual(n)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from 'react'

// ─── Translation Map ──────────────────────────────────────────────────────────
// Bilingual copy for all views. Agents 3-5 consume `t` from this map.
export const T = {
    EN: {
        // ── App Shell ──
        appName: 'SheVest',
        poweredBy: 'Powered by SheVest',
        partnerLabel: 'NGO Partner',
        langToggle: 'हिं',

        // ── Bottom Nav ──
        navChitHub: 'Chit Hub',
        navP2P: 'Marketplace',
        navLegal: 'Legal Shield',

        // ── ChitHub View ──
        activeChit: 'Active Chit Pool',
        potValue: 'Pot Value',
        members: 'Members',
        auctionCountdown: 'Days to Auction',
        myInstallment: 'My Monthly Installment',
        payInstallment: '💰 Pay Monthly Installment',
        paying: 'Verifying Payment…',
        paySuccess: 'Payment Confirmed! +5 Trust Points',
        cycle: 'Cycle',
        of: 'of',
        cycleComplete: 'Cycle Complete 🎉',
        chitCycles: 'Chit Cycles Completed',
        trustScore: 'Trust Score',
        trustGate: 'Unlock P2P at 80+',
        progress: 'Progress',

        // ── P2P Marketplace ──
        p2pTitle: 'P2P Micro-Loans',
        p2pSubtitle: 'Verified community borrowers',
        lockedTitle: 'Marketplace Locked',
        lockedBody: 'Complete 3 Chit cycles to unlock your P2P lending access.',
        lockedCta: 'Go to Chit Hub →',
        loanSeeks: 'Seeks',
        loanDays: 'days',
        loanRate: 'Rate',
        loanVerified: 'Verified',
        fundLoan: 'Fund This Loan',
        purpose: 'Purpose',
        matchScore: 'Trust Match',

        // ── Legal Shield ──
        legalTitle: 'AI Legal Bodyguard',
        legalSubtitle: 'Describe your situation — Gemini drafts your FIR.',
        reportThreat: '🚨 Report Threat',
        chatPlaceholder: 'Describe harassment or threat…',
        sendMessage: 'Send',
        autoTranslated: 'Auto-translated from Hindi',
        firAnalysis: 'Gemini Auto-FIR Analysis in Progress…',
        aiTyping: 'SheVest AI is analyzing…',
        downloadPdf: '↓ Download Legal PDF',
        closeModal: '✕ Close',

        // ── FIR Modal ──
        firTitle: 'Auto-FIR Draft',
        firSubtitle: 'Indian Penal Code · BNS 2023',
        firSection: 'BNS Section 308(2)',
        firOffence: 'Extortion — Financial Harassment',
        firComplainant: 'Complainant',
        firAccused: 'Accused',
        firIncident: 'Incident Summary',
        firLoading: 'Gemini is analyzing your statement…',
        firReady: 'FIR Draft Ready',
        firWarning: 'This is an AI-generated draft. Verify with a legal professional before filing.',

        // ── General ──
        verified: 'Verified',
        pending: 'Pending',
        active: 'Active',
        loading: 'Loading…',
    },

    HI: {
        // ── App Shell ──
        appName: 'शीवेस्ट',
        poweredBy: 'ShेVest द्वारा संचालित',
        partnerLabel: 'NGO साझेदार',
        langToggle: 'EN',

        // ── Bottom Nav ──
        navChitHub: 'चिट हब',
        navP2P: 'बाज़ार',
        navLegal: 'कानूनी ढाल',

        // ── ChitHub View ──
        activeChit: 'सक्रिय चिट पूल',
        potValue: 'पॉट मूल्य',
        members: 'सदस्य',
        auctionCountdown: 'नीलामी में दिन',
        myInstallment: 'मेरी मासिक किस्त',
        payInstallment: '💰 मासिक किस्त भरें',
        paying: 'भुगतान सत्यापित हो रहा है…',
        paySuccess: 'भुगतान की पुष्टि हुई! +5 विश्वास अंक',
        cycle: 'चक्र',
        of: 'का',
        cycleComplete: 'चक्र पूरा हुआ 🎉',
        chitCycles: 'पूर्ण चिट चक्र',
        trustScore: 'विश्वास स्कोर',
        trustGate: '80+ पर P2P अनलॉक करें',
        progress: 'प्रगति',

        // ── P2P Marketplace ──
        p2pTitle: 'P2P सूक्ष्म-ऋण',
        p2pSubtitle: 'सत्यापित सामुदायिक उधारकर्ता',
        lockedTitle: 'बाज़ार बंद है',
        lockedBody: 'P2P ऋण एक्सेस अनलॉक करने के लिए 3 चिट चक्र पूरे करें।',
        lockedCta: 'चिट हब पर जाएं →',
        loanSeeks: 'मांग',
        loanDays: 'दिन',
        loanRate: 'दर',
        loanVerified: 'सत्यापित',
        fundLoan: 'ऋण वित्त करें',
        purpose: 'उद्देश्य',
        matchScore: 'विश्वास मिलान',

        // ── Legal Shield ──
        legalTitle: 'AI कानूनी अंगरक्षक',
        legalSubtitle: 'अपनी स्थिति बताएं — Gemini आपकी FIR तैयार करेगा।',
        reportThreat: '🚨 खतरा रिपोर्ट करें',
        chatPlaceholder: 'उत्पीड़न या धमकी का वर्णन करें…',
        sendMessage: 'भेजें',
        autoTranslated: 'हिंदी से स्वतः अनुवादित',
        firAnalysis: 'Gemini Auto-FIR विश्लेषण जारी है…',
        aiTyping: 'SheVest AI विश्लेषण कर रहा है…',
        downloadPdf: '↓ कानूनी PDF डाउनलोड करें',
        closeModal: '✕ बंद करें',

        // ── FIR Modal ──
        firTitle: 'Auto-FIR मसौदा',
        firSubtitle: 'भारतीय दंड संहिता · BNS 2023',
        firSection: 'BNS धारा 308(2)',
        firOffence: 'जबरन वसूली — वित्तीय उत्पीड़न',
        firComplainant: 'शिकायतकर्ता',
        firAccused: 'आरोपी',
        firIncident: 'घटना सारांश',
        firLoading: 'Gemini आपका बयान विश्लेषण कर रहा है…',
        firReady: 'FIR मसौदा तैयार',
        firWarning: 'यह AI द्वारा तैयार मसौदा है। दाखिल करने से पहले किसी कानूनी विशेषज्ञ से सत्यापित करें।',

        // ── General ──
        verified: 'सत्यापित',
        pending: 'लंबित',
        active: 'सक्रिय',
        loading: 'लोड हो रहा है…',
    },
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null)

// ─── Custom Hook — must be used inside <AppProvider> ─────────────────────────
export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within <AppProvider>')
    return ctx
}

// Convenience alias for language-only consumers
export function useLanguage() {
    const { lang, toggleLang } = useApp()
    return { lang, toggleLang }
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Trust score increment per paid installment
const TRUST_PER_INSTALLMENT = 5

// Trust points awarded when a full chit cycle completes
const TRUST_PER_CYCLE = 20

// Number of installments that constitute one chit cycle
const INSTALLMENTS_PER_CYCLE = 12

// P2P unlock gate
export const P2P_TRUST_GATE = 80

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
    // ── Core state ──────────────────────────────────────────────────────────────
    const [lang, setLang] = useState('EN')
    const [trustScore, setTrustScore] = useState(20)   // new registrant baseline
    const [chitCyclesCompleted, setChitCycles] = useState(0)
    const [installmentsPaidThisCycle, setInstPaid] = useState(3) // demo mid-cycle

    // ── Auth state ───────────────────────────────────────────────────────────────
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState(null) // 'borrower' | 'ngo_admin'

    // ── Actions ──────────────────────────────────────────────────────────────────

    const toggleLang = useCallback(() => {
        setLang(l => (l === 'EN' ? 'HI' : 'EN'))
    }, [])

    /**
     * recordInstallmentPaid
     * Called when user taps "Pay Monthly Installment" in ChitHub.
     * - Increments trust score by TRUST_PER_INSTALLMENT (capped at 100)
     * - Tracks installments within current cycle
     * - When INSTALLMENTS_PER_CYCLE reached, closes the cycle:
     *     · Awards TRUST_PER_CYCLE bonus
     *     · Increments chitCyclesCompleted
     *     · Resets installment counter
     */
    const recordInstallmentPaid = useCallback(() => {
        setInstPaid(prev => {
            const next = prev + 1
            if (next >= INSTALLMENTS_PER_CYCLE) {
                // Cycle complete — bonus trust + new cycle
                setTrustScore(s => Math.min(100, s + TRUST_PER_INSTALLMENT + TRUST_PER_CYCLE))
                setChitCycles(c => c + 1)
                return 0 // reset installment counter
            }
            setTrustScore(s => Math.min(100, s + TRUST_PER_INSTALLMENT))
            return next
        })
    }, [])

    /**
     * setTrustScoreManual — for demo/testing overrides
     */
    const setTrustScoreManual = useCallback((score) => {
        setTrustScore(Math.max(0, Math.min(100, score)))
    }, [])

    // ── Auth actions ─────────────────────────────────────────────────────────────

    /**
     * login(role) — called by Login view (real OTP path) and demo quick-login.
     * Sets authenticated=true and assigns the user role.
     */
    const login = useCallback((role) => {
        setUserRole(role)
        setIsAuthenticated(true)
    }, [])

    /**
     * logout — clears auth state, resets demo trust score.
     */
    const logout = useCallback(() => {
        setIsAuthenticated(false)
        setUserRole(null)
    }, [])

    /**
     * toggleRole — used by DemoGodMode to swap roles during a live pitch.
     */
    const toggleRole = useCallback(() => {
        setUserRole(prev => prev === 'borrower' ? 'ngo_admin' : 'borrower')
    }, [])

    // ── Derived state ────────────────────────────────────────────────────────────

    const isP2PUnlocked = trustScore >= P2P_TRUST_GATE
    const installmentsLeft = INSTALLMENTS_PER_CYCLE - installmentsPaidThisCycle
    const cycleProgress = (installmentsPaidThisCycle / INSTALLMENTS_PER_CYCLE) * 100
    const t = T[lang]

    // ── Memoised context value ───────────────────────────────────────────────────
    const value = useMemo(() => ({
        // State
        lang,
        trustScore,
        chitCyclesCompleted,
        installmentsPaidThisCycle,

        // Auth state
        isAuthenticated,
        userRole,

        // Actions
        toggleLang,
        recordInstallmentPaid,
        setTrustScoreManual,

        // Auth actions
        login,
        logout,
        toggleRole,

        // Derived
        isP2PUnlocked,
        installmentsLeft,
        cycleProgress,
        t,

        // Constants (exposed for views)
        P2P_TRUST_GATE,
        INSTALLMENTS_PER_CYCLE,
        TRUST_PER_INSTALLMENT,
    }), [
        lang, trustScore, chitCyclesCompleted, installmentsPaidThisCycle,
        isAuthenticated, userRole,
        toggleLang, recordInstallmentPaid, setTrustScoreManual,
        login, logout, toggleRole,
        isP2PUnlocked, installmentsLeft, cycleProgress, t,
    ])

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
