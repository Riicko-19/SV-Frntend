/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — SheVest App Shell & Router
 *
 * Route Map:
 *   /            → redirect → /chithub
 *   /chithub     → ChitHub     (Save & Prove)
 *   /p2p         → P2PMarketplace (Borrow & Grow)
 *   /legal       → LegalChat   (AI Legal Bodyguard)
 *
 * Shell: PWA phone-sized container (max-w-md, h-screen)
 *   Fixed glass header (B2BHeader) + scrollable content + fixed BottomNav
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import B2BHeader from './components/B2BHeader'

// ─── Lazy-load views for code-splitting ──────────────────────────────────────
const ChitHub = lazy(() => import('./views/ChitHub'))
const P2PMarketplace = lazy(() => import('./views/P2PMarketplace'))
const LegalChat = lazy(() => import('./views/LegalChat'))

// ─── Loading Skeleton shown during lazy load ──────────────────────────────────
function PageSkeleton() {
    return (
        <div className="flex-1 flex flex-col gap-4 p-5 overflow-hidden">
            {[1, 2, 3].map(i => (
                <div
                    key={i}
                    className="glass-card p-5 h-28 relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.08}s` }}
                >
                    <div className="shimmer absolute inset-0 rounded-3xl" />
                    <div className="h-4 bg-stone-100/80 rounded-full w-2/3 mb-3" />
                    <div className="h-3 bg-stone-100/60 rounded-full w-1/2" />
                </div>
            ))}
        </div>
    )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                {/*
          PWA phone shell:
          • max-w-md centers on desktop, fills on mobile
          • h-screen with overflow-hidden prevents body scroll
          • flex-col stacks Header → Content → BottomNav
        */}
                <div
                    className="
            relative w-full max-w-md mx-auto h-screen
            flex flex-col overflow-hidden
            shadow-[0_0_80px_rgba(31,38,135,0.12)]
          "
                >
                    {/* ── Subtle inner border shimmer ring (glass effect) ── */}
                    <div
                        className="absolute inset-0 pointer-events-none z-50"
                        style={{
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
                            borderRadius: 0,
                        }}
                    />

                    {/* ── Fixed white-label partner header ── */}
                    <B2BHeader />

                    {/* ── Scrollable route content ── */}
                    <main className="flex-1 overflow-hidden relative">
                        <Suspense fallback={<PageSkeleton />}>
                            <Routes>
                                {/* Default redirect */}
                                <Route path="/" element={<Navigate to="/chithub" replace />} />

                                {/* Core views */}
                                <Route path="/chithub" element={<ChitHub />} />
                                <Route path="/p2p" element={<P2PMarketplace />} />
                                <Route path="/legal" element={<LegalChat />} />

                                {/* Legacy route aliases (graceful redirect) */}
                                <Route path="/dashboard" element={<Navigate to="/chithub" replace />} />
                                <Route path="/market" element={<Navigate to="/p2p" replace />} />

                                {/* 404 fallback */}
                                <Route path="*" element={<Navigate to="/chithub" replace />} />
                            </Routes>
                        </Suspense>
                    </main>

                    {/* ── Fixed bottom navigation ── */}
                    <BottomNav />
                </div>
            </BrowserRouter>
        </AppProvider>
    )
}
