/**
 * views/BorrowerHub.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 4 — Primary borrower / member view.
 *
 * Sections (top → bottom):
 *  1. Greeting header
 *  2. TrustScoreRing — animated, with P2P unlock state
 *  3. Active Chit Fund pot summary card
 *  4. Repayment timeline — list of RepaymentItems
 *  5. Quick-action bar
 *
 * Design rules:
 *  • Mobile-first PWA  →  max-w-md mx-auto min-h-screen
 *  • Trust score changes animate the ring (prop drives framer-motion)
 *  • bg-stone-50 base, glass cards for all blocks
 *  • P2P entry point is blurred if trustScore < 80
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  CalendarDays,
  Users,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Bell,
} from 'lucide-react';
import GlassCard      from '../components/atoms/GlassCard';
import PillTag        from '../components/atoms/PillTag';
import ActionButton   from '../components/atoms/ActionButton';
import TrustScoreRing from '../components/molecules/TrustScoreRing';
import RepaymentItem  from '../components/molecules/RepaymentItem';
import AutoFirReviewModal from '../components/organisms/AutoFirReviewModal';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: 'Kavita',
  city: 'Bengaluru',
  trustScore: 74,
  chitGroup: {
    name: 'Bengaluru Makers Circle',
    members: 12,
    cycleMonth: 'March 2026',
    potValue: 9000,
    myContribution: 750,
    nextDrawDate: '15 Mar 2026',
    myPosition: 7,          // draw order
    totalCycles: 12,
    cyclesDone: 6,
  },
};

const MOCK_REPAYMENTS = [
  {
    id: 'r1',
    installmentLabel: 'Installment 7 of 12',
    amount: 750,
    dueDate: '15 Mar 2026',
    status: 'upcoming',
    chitName: 'Bengaluru Makers Circle',
  },
  {
    id: 'r2',
    installmentLabel: 'Installment 8 of 12',
    amount: 750,
    dueDate: '15 Apr 2026',
    status: 'upcoming',
    chitName: 'Bengaluru Makers Circle',
  },
  {
    id: 'r3',
    installmentLabel: 'Installment 6 of 12',
    amount: 750,
    dueDate: '15 Feb 2026',
    status: 'paid',
    chitName: 'Bengaluru Makers Circle',
  },
];

const MOCK_THREATS = [
  {
    id: 't1',
    senderName: 'Unknown +91 99200 xxxxx',
    timestamp: '2 Mar 2026, 9:14 AM',
    messageText:
      'Agar kal tak paise nahi diye toh ghar aa ke sabko bata denge. Sharam nahi aati?',
    isHighPriority: true,
  },
  {
    id: 't2',
    senderName: 'Unknown +91 99200 xxxxx',
    timestamp: '2 Mar 2026, 9:22 AM',
    messageText:
      'Last warning. Pay ₹3,500 by 5 PM or we will involve your employer.',
    isHighPriority: false,
  },
];

// ── Indian number formatter ───────────────────────────────────────────────────
const inr = (n) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

// ── Chit Fund Pot card ────────────────────────────────────────────────────────
function ChitPotCard({ chit }) {
  const cyclePct = Math.round((chit.cyclesDone / chit.totalCycles) * 100);

  return (
    <GlassCard padding="p-5" className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-stone-500 font-medium mb-0.5 uppercase tracking-wide">
            Active Chit Fund
          </p>
          <p className="text-base font-bold text-emerald-950">{chit.name}</p>
        </div>
        <PillTag colorType="trust" icon={Users} label={`${chit.members} Members`} />
      </div>

      {/* Pot value + cycle progress */}
      <div className="flex gap-3">
        {/* Pot value */}
        <div className="flex-1 bg-emerald-50/70 border border-emerald-100/60 rounded-xl p-3 text-center">
          <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide mb-1">
            Monthly Pool
          </p>
          <p className="text-xl font-bold text-emerald-800">{inr(chit.potValue)}</p>
        </div>

        {/* My contribution */}
        <div className="flex-1 bg-stone-50/60 border border-white/50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wide mb-1">
            My Share
          </p>
          <p className="text-xl font-bold text-stone-700">{inr(chit.myContribution)}</p>
        </div>
      </div>

      {/* Cycle progress bar */}
      <div>
        <div className="flex justify-between text-xs text-stone-500 mb-1.5">
          <span className="font-medium">{chit.cyclesDone} / {chit.totalCycles} cycles done</span>
          <span>Draw #{chit.myPosition} on {chit.nextDrawDate}</span>
        </div>
        <div className="h-2 w-full bg-stone-200/70 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${cyclePct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </div>
      </div>

      {/* Next draw date */}
      <div className="flex items-center gap-1.5 text-xs text-stone-500">
        <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
        <span>Next draw: <span className="font-semibold text-stone-700">{chit.nextDrawDate}</span></span>
        <span className="ml-auto text-emerald-600 font-semibold">{chit.cycleMonth}</span>
      </div>
    </GlassCard>
  );
}

// ── P2P teaser (locked when trust < 80) ─────────────────────────────────────
function P2PTeaser({ trustScore }) {
  const isLocked = trustScore < 80;

  return (
    <div className="relative w-full">
      <GlassCard padding="p-4" className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={20} className="text-emerald-600" strokeWidth={1.8} aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-emerald-950">P2P Marketplace</p>
              <p className="text-xs text-stone-500">Lend · Borrow · Grow</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-stone-400" aria-hidden="true" />
        </div>
      </GlassCard>

      {/* Lock overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl backdrop-blur-md bg-white/50 border border-white/40 flex items-center gap-3 px-4"
            aria-label="P2P Marketplace locked"
          >
            <div className="bg-amber-100/80 p-1.5 rounded-lg border border-amber-200/50 flex-shrink-0">
              <Wallet size={16} className="text-amber-600" strokeWidth={2} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-700">Locked — {80 - trustScore} pts needed</p>
              <p className="text-[11px] text-stone-400">Complete more Chit cycles to unlock</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── View ──────────────────────────────────────────────────────────────────────
export default function BorrowerHub() {
  const [user]                  = useState(MOCK_USER);
  const [repayments, setRepayments] = useState(MOCK_REPAYMENTS);
  const [payingId, setPayingId] = useState(null);
  const [firOpen, setFirOpen]   = useState(false);
  const [firLoading, setFirLoading] = useState(false);

  // ── Pay Now handler (optimistic UI) ────────────────────────────────────
  const handlePayNow = async (repaymentId) => {
    setPayingId(repaymentId);
    await new Promise((r) => setTimeout(r, 1600));
    setRepayments((prev) =>
      prev.map((r) => r.id === repaymentId ? { ...r, status: 'paid' } : r)
    );
    setPayingId(null);
  };

  // ── FIR generation ──────────────────────────────────────────────────────
  const handleGenerateFir = async (selectedMessages) => {
    setFirLoading(true);
    // Simulate generation delay (real impl → POST /api/fir/generate)
    await new Promise((r) => setTimeout(r, 2000));
    setFirLoading(false);
    setFirOpen(false);
    // TODO: open PDF preview
    console.info('FIR draft generated for messages:', selectedMessages.map((m) => m.id));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-4 pb-28">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="pt-12 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={14} className="text-emerald-500" strokeWidth={2.5} aria-hidden="true" />
              <p className="text-xs text-stone-500 font-medium">Good morning</p>
            </div>
            <h1 className="text-2xl font-bold text-emerald-950">
              {user.name} 👋
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">{user.city}</p>
          </div>

          {/* Legal Shield alert bell */}
          <button
            type="button"
            onClick={() => setFirOpen(true)}
            className="relative p-2.5 bg-rose-50/80 border border-rose-200/50 rounded-xl hover:bg-rose-100/60 transition-colors"
            aria-label="Open Legal Shield — 2 threats detected"
          >
            <ShieldAlert size={20} className="text-rose-600" strokeWidth={1.8} />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">{MOCK_THREATS.length}</span>
            </span>
          </button>
        </div>

        {/* ── Trust Score Ring ──────────────────────────────────────────── */}
        <GlassCard padding="py-6 px-4" className="w-full flex flex-col items-center mb-4">
          <TrustScoreRing score={user.trustScore} size={148} />
          <p className="text-xs text-stone-400 mt-3 text-center max-w-[220px] leading-relaxed">
            Pay your next installment to earn <span className="text-emerald-600 font-semibold">+6 pts</span> and get closer to P2P access.
          </p>
        </GlassCard>

        {/* ── Active Chit Fund pot ──────────────────────────────────────── */}
        <div className="mb-4">
          <ChitPotCard chit={user.chitGroup} />
        </div>

        {/* ── P2P Marketplace teaser ────────────────────────────────────── */}
        <div className="mb-6">
          <P2PTeaser trustScore={user.trustScore} />
        </div>

        {/* ── Repayment timeline ────────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
            Repayment Timeline
          </h2>
          <PillTag colorType="warning" icon={Bell} label="1 due soon" />
        </div>

        <div className="space-y-3">
          {repayments.map((r) => (
            <RepaymentItem
              key={r.id}
              installmentLabel={r.installmentLabel}
              amount={r.amount}
              dueDate={r.dueDate}
              status={r.status}
              chitName={r.chitName}
              isProcessing={payingId === r.id}
              onPayNow={() => handlePayNow(r.id)}
            />
          ))}
        </div>

      </div>

      {/* ── Auto FIR Review Modal ──────────────────────────────────────── */}
      <AutoFirReviewModal
        isOpen={firOpen}
        onClose={() => setFirOpen(false)}
        messages={MOCK_THREATS}
        isGenerating={firLoading}
        onGenerateFir={handleGenerateFir}
      />
    </div>
  );
}
