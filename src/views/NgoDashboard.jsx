/**
 * views/NgoDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 4 — B2B2C NGO Admin Portal.
 *
 * Responsibilities:
 *  • List beneficiaries pending physical KYC verification
 *  • Allow manual KYC approval (bypassing DigiLocker when needed)
 *  • Override device-sharing limit for multi-user households
 *  • Summary stats at a glance
 *
 * Design rules:
 *  • Mobile-first PWA  →  max-w-md mx-auto min-h-screen
 *  • Amber PillTag for pending KYC, Emerald for verified
 *  • Danger/crimson only for high-risk flags
 *  • All heavy UI blocks use GlassCard
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  X,
  UserCheck,
  Building2,
  Handshake,
} from 'lucide-react';
import GlassCard    from '../components/atoms/GlassCard';
import PillTag      from '../components/atoms/PillTag';
import ActionButton from '../components/atoms/ActionButton';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PENDING_USERS = [
  {
    id: 'u1',
    name: 'Kavita Sharma',
    city: 'Bengaluru',
    phone: '+91 98400 12345',
    joinedDate: '28 Feb 2026',
    kycStatus: 'pending_physical',
    deviceShared: true,
    sharedWith: 2,
    chitGroup: 'Bengaluru Makers Circle',
    trustScore: 42,
    flagged: false,
  },
  {
    id: 'u2',
    name: 'Meera Pillai',
    city: 'Kochi',
    phone: '+91 94470 55678',
    joinedDate: '1 Mar 2026',
    kycStatus: 'pending_physical',
    deviceShared: false,
    sharedWith: 0,
    chitGroup: 'Kochi Weavers Pool',
    trustScore: 61,
    flagged: false,
  },
  {
    id: 'u3',
    name: 'Sunita Devi',
    city: 'Patna',
    phone: '+91 70050 99001',
    joinedDate: '27 Feb 2026',
    kycStatus: 'pending_physical',
    deviceShared: true,
    sharedWith: 3,
    chitGroup: 'Patna Tailors Guild',
    trustScore: 29,
    flagged: true,
  },
  {
    id: 'u4',
    name: 'Rani Kumari',
    city: 'Jaipur',
    phone: '+91 96100 44521',
    joinedDate: '3 Mar 2026',
    kycStatus: 'awaiting_docs',
    deviceShared: false,
    sharedWith: 0,
    chitGroup: 'Jaipur Artisans Circle',
    trustScore: 55,
    flagged: false,
  },
];

const STATS = [
  { label: 'Pending KYC', value: 4,  icon: Clock,       color: 'text-amber-600'  },
  { label: 'Verified',    value: 17, icon: ShieldCheck,  color: 'text-emerald-600'},
  { label: 'Active Chits',value: 6,  icon: Users,        color: 'text-stone-600'  },
];

// ── Mock vouch requests ───────────────────────────────────────────────────────
const INITIAL_VOUCH_REQUESTS = [
  {
    id: 'v1',
    name: 'Kavita Devi',
    city: 'Jaipur',
    currentScore: 58,
    requestedPts: 80,
    reason: 'Emergency capital for medical expense',
    chitGroup: 'Jaipur Artisans Circle',
  },
];

// ── Vouch request row ─────────────────────────────────────────────────────────
function VouchRequestRow({ req, onApprove, approving }) {
  return (
    <GlassCard padding="p-4" className="border-l-4 border-l-amber-400">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-amber-900">{req.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800">{req.name}</p>
          <p className="text-xs text-stone-500 mb-1">{req.city} · {req.chitGroup}</p>
          <p className="text-[11px] text-stone-600 leading-relaxed italic">"{req.reason}"</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-stone-500">
              Score: <span className="text-amber-600">{req.currentScore}</span>
              <span className="text-stone-400"> → </span>
              <span className="text-emerald-600">{req.requestedPts} pts</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <ActionButton
          variant="emerald"
          className="w-full justify-center text-xs"
          isLoading={approving === req.id}
          onClick={() => onApprove(req.id)}
        >
          <Handshake size={14} strokeWidth={2} aria-hidden="true" />
          Approve Vouch
        </ActionButton>
      </div>
    </GlassCard>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <GlassCard padding="p-4" className="flex-1 text-center">
      <Icon size={20} className={`${color} mx-auto mb-1`} strokeWidth={1.8} aria-hidden="true" />
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[11px] text-stone-500 font-medium leading-tight mt-0.5">{label}</p>
    </GlassCard>
  );
}

// ── Device override confirmation sheet ───────────────────────────────────────
function DeviceOverrideSheet({ user, onConfirm, onCancel, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className={[
        'fixed inset-x-4 bottom-6 z-50 max-w-md mx-auto',
        'bg-white/80 backdrop-blur-xl',
        'border border-amber-200/60',
        'rounded-2xl shadow-xl shadow-amber-900/10 p-5',
      ].join(' ')}
      role="alertdialog"
      aria-labelledby="override-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100/80 p-1.5 rounded-lg border border-amber-200/50">
            <Smartphone size={16} className="text-amber-600" strokeWidth={2} />
          </div>
          <h3 id="override-title" className="text-sm font-bold text-stone-800">
            Override Device Limit
          </h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-stone-100 transition-colors">
          <X size={16} className="text-stone-400" />
        </button>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed mb-4">
        <span className="font-semibold text-stone-800">{user?.name}</span>'s household
        currently has{' '}
        <span className="font-semibold text-amber-700">
          {user?.sharedWith + 1} users
        </span>{' '}
        on one device. Overriding will allow all members to maintain separate
        SheVest accounts on a shared smartphone.
      </p>

      <div className="flex gap-2">
        <ActionButton variant="ghost" onClick={onCancel} className="flex-1 justify-center text-xs">
          Cancel
        </ActionButton>
        <ActionButton
          variant="emerald"
          onClick={() => onConfirm(user?.id)}
          isLoading={isLoading}
          className="flex-1 justify-center text-xs"
        >
          Confirm Override
        </ActionButton>
      </div>
    </motion.div>
  );
}

// ── User KYC row ──────────────────────────────────────────────────────────────
function KycUserRow({ user, onApproveKyc, onOverrideDevice, approving, overriding }) {
  const [expanded, setExpanded] = useState(false);

  const statusLabel = user.kycStatus === 'pending_physical' ? 'Needs Site Visit' : 'Awaiting Docs';
  const statusColor = user.kycStatus === 'pending_physical' ? 'warning' : 'danger';

  return (
    <GlassCard
      padding="p-0"
      className={[
        'overflow-hidden',
        user.flagged && 'border-l-4 border-l-rose-400',
      ].filter(Boolean).join(' ')}
    >
      {/* ── Collapsed row ─────────────────────────────────────────────── */}
      <button
        type="button"
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-emerald-900">
            {user.name.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-semibold text-stone-800">{user.name}</p>
            {user.flagged && (
              <AlertTriangle size={13} className="text-rose-500" strokeWidth={2.5} aria-label="Flagged" />
            )}
          </div>
          <p className="text-xs text-stone-500 truncate">{user.city} · {user.chitGroup}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <PillTag colorType={statusColor} label={statusLabel} />
          <ChevronRight
            size={16}
            className={`text-stone-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* ── Expanded detail panel ──────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/40 pt-3 space-y-3">
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Phone',     user.phone],
                  ['Joined',    user.joinedDate],
                  ['Trust Pts', user.trustScore],
                  ['Device',    user.deviceShared ? `Shared (${user.sharedWith + 1} users)` : 'Personal'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-stone-50/60 rounded-lg p-2">
                    <p className="text-stone-400 font-medium mb-0.5">{k}</p>
                    <p className="text-stone-700 font-semibold">{v}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <ActionButton
                  variant="emerald"
                  className="flex-1 justify-center text-xs"
                  isLoading={approving === user.id}
                  onClick={() => onApproveKyc(user.id)}
                >
                  <UserCheck size={14} strokeWidth={2} aria-hidden="true" />
                  Approve KYC
                </ActionButton>

                {user.deviceShared && (
                  <ActionButton
                    variant="ghost"
                    className="flex-1 justify-center text-xs"
                    isLoading={overriding === user.id}
                    onClick={() => onOverrideDevice(user)}
                  >
                    <Smartphone size={14} strokeWidth={2} aria-hidden="true" />
                    Override Device
                  </ActionButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

// ── View ──────────────────────────────────────────────────────────────────────
export default function NgoDashboard() {
  const [users, setUsers]               = useState(MOCK_PENDING_USERS);
  const [approvingId, setApprovingId]   = useState(null);
  const [overrideTarget, setOverrideTarget] = useState(null); // user object
  const [overridingId, setOverridingId] = useState(null);
  const [vouchRequests, setVouchRequests] = useState(INITIAL_VOUCH_REQUESTS);
  const [approvingVouchId, setApprovingVouchId] = useState(null);

  // ── Vouch approval ───────────────────────────────────────────────────────
  const handleApproveVouch = async (reqId) => {
    setApprovingVouchId(reqId);
    await new Promise((r) => setTimeout(r, 1400));
    setVouchRequests((prev) => prev.filter((v) => v.id !== reqId));
    setApprovingVouchId(null);
  };

  // ── KYC approval ────────────────────────────────────────────────────────
  const handleApproveKyc = async (userId) => {
    setApprovingId(userId);
    // Simulate async verification call
    await new Promise((r) => setTimeout(r, 1400));
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setApprovingId(null);
  };

  // ── Device override ──────────────────────────────────────────────────────
  const handleOverrideConfirm = async (userId) => {
    setOverridingId(userId);
    await new Promise((r) => setTimeout(r, 1200));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, deviceShared: false, sharedWith: 0 } : u
      )
    );
    setOverridingId(null);
    setOverrideTarget(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* ── Page wrapper (mobile-first) ─────────────────────────────────── */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-4 pb-24">

        {/* ── Top bar ───────────────────────────────────────────────────── */}
        <div className="pt-12 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-emerald-100/80 p-2 rounded-xl border border-emerald-200/50">
              <Building2 size={20} className="text-emerald-700" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-950">NGO Admin Portal</h1>
              <p className="text-xs text-stone-500">SheVest Partner Dashboard</p>
            </div>
          </div>
        </div>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <div className="flex gap-3 mb-6">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Pending KYC list ──────────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
            Pending Verification
          </h2>
          <PillTag colorType="warning" label={`${users.length} pending`} />
        </div>

        {users.length === 0 ? (
          <GlassCard padding="p-8" className="text-center">
            <CheckCircle2
              size={36}
              className="text-emerald-400 mx-auto mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm font-semibold text-stone-700">All caught up!</p>
            <p className="text-xs text-stone-400 mt-1">No pending verifications.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <KycUserRow
                key={user.id}
                user={user}
                onApproveKyc={handleApproveKyc}
                onOverrideDevice={setOverrideTarget}
                approving={approvingId}
                overriding={overridingId}
              />
            ))}
          </div>
        )}

        {/* ── Pending Vouch Requests ──────────────────────────────────── */}
        <div className="mt-8 mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
            Pending Vouch Requests
          </h2>
          <PillTag colorType="warning" label={`${vouchRequests.length} pending`} />
        </div>

        {vouchRequests.length === 0 ? (
          <GlassCard padding="p-6" className="text-center">
            <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-stone-700">No pending vouches</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {vouchRequests.map((req) => (
              <VouchRequestRow
                key={req.id}
                req={req}
                onApprove={handleApproveVouch}
                approving={approvingVouchId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Device Override Sheet ──────────────────────────────────────── */}
      <AnimatePresence>
        {overrideTarget && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40"
              onClick={() => setOverrideTarget(null)}
            />
            <DeviceOverrideSheet
              key="sheet"
              user={overrideTarget}
              onConfirm={handleOverrideConfirm}
              onCancel={() => setOverrideTarget(null)}
              isLoading={overridingId === overrideTarget?.id}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
