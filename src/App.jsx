import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Dashboard from './views/Dashboard'
import Marketplace from './views/Marketplace'
import LegalBodyguard from './views/LegalBodyguard'

// ── Language Context ────────────────────────────────────────────────────────
export const LanguageContext = createContext({
    lang: 'EN',
    toggleLang: () => { },
})

export const useLanguage = () => useContext(LanguageContext)

// ── Translation Map ─────────────────────────────────────────────────────────
export const T = {
    EN: {
        activeCapital: 'Active Capital',
        trustScore: 'Trust Score',
        loansFunded: 'Loans Funded',
        repaymentRate: 'Repayment Rate',
        memberSince: 'Member Since',
        marketplace: 'Community',
        dashboard: 'Ledger',
        legal: 'Legal Shield',
        listView: 'List View',
        mapView: 'Map View',
        fundLoan: 'Fund This Loan',
        reportThreat: '🚨 Report Threat',
        chatPlaceholder: 'Type a message…',
        autoTranslated: 'Auto-translated from Hindi',
        firAnalysis: '🔍 Gemini Auto-FIR Analysis in Progress…',
        downloadPdf: '↓ Download Legal PDF',
        closeModal: '✕ Close',
        days: 'Days Active',
        sought: 'Seeks',
        verified: '✓ Verified',
        sendMessage: 'Send',
    },
    HI: {
        activeCapital: 'सक्रिय पूंजी',
        trustScore: 'विश्वास स्कोर',
        loansFunded: 'वित्तित ऋण',
        repaymentRate: 'पुनर्भुगतान दर',
        memberSince: 'सदस्य तब से',
        marketplace: 'समुदाय',
        dashboard: 'खाता बही',
        legal: 'कानूनी ढाल',
        listView: 'सूची दृश्य',
        mapView: 'मानचित्र',
        fundLoan: 'ऋण वित्त करें',
        reportThreat: '🚨 खतरा रिपोर्ट करें',
        chatPlaceholder: 'संदेश लिखें…',
        autoTranslated: 'हिंदी से स्वतः अनुवादित',
        firAnalysis: '🔍 Gemini Auto-FIR विश्लेषण जारी है…',
        downloadPdf: '↓ कानूनी PDF डाउनलोड करें',
        closeModal: '✕ बंद करें',
        days: 'सक्रिय दिन',
        sought: 'मांगता है',
        verified: '✓ सत्यापित',
        sendMessage: 'भेजें',
    },
}

// ── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
    const [lang, setLang] = useState('EN')
    const toggleLang = () => setLang(l => l === 'EN' ? 'HI' : 'EN')

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            <BrowserRouter>
                {/* PWA phone-sized shell */}
                <div className="relative w-full max-w-md mx-auto h-screen flex flex-col overflow-hidden shadow-2xl">
                    {/* Subtle inner border shimmer */}
                    <div className="absolute inset-0 pointer-events-none z-50 rounded-none
                          ring-1 ring-white/20" />

                    {/* Route content fills the middle */}
                    <div className="flex-1 overflow-hidden relative">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/market" element={<Marketplace />} />
                            <Route path="/legal" element={<LegalBodyguard />} />
                        </Routes>
                    </div>

                    {/* Fixed bottom nav */}
                    <BottomNav />
                </div>
            </BrowserRouter>
        </LanguageContext.Provider>
    )
}
