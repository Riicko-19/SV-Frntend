/**
 * components/molecules/RepaymentItem.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — Upcoming EMI / repayment row card.
 *
 * Combines GlassCard + PillTag + ActionButton into a single FinTech list item
 * representing one installment in the repayment timeline.
 *
 * Props:
 *   installmentLabel  — string  e.g. "Installment 3 of 12"
 *   amount            — number  e.g. 750
 *   dueDate           — string  e.g. "15 Mar 2026"
 *   status            — 'upcoming' | 'overdue' | 'paid'
 *   chitName          — string  e.g. "Bengaluru Makers Circle"
 *   onPayNow          — () => void  callback for Pay Now button
 *   isProcessing      — boolean  passed through to ActionButton isLoading
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Calendar, IndianRupee, CheckCircle2 } from 'lucide-react';
import GlassCard  from '../atoms/GlassCard';
import PillTag    from '../atoms/PillTag';
import ActionButton from '../atoms/ActionButton';

// Map status → PillTag colorType + label
const STATUS_CONFIG = {
  upcoming: { colorType: 'warning', label: 'Due Soon',  icon: Calendar     },
  overdue:  { colorType: 'danger',  label: 'Overdue',   icon: IndianRupee  },
  paid:     { colorType: 'trust',   label: 'Paid',      icon: CheckCircle2 },
};

// Indian number formatting  e.g.  1500 → "1,500"
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export default function RepaymentItem({
  installmentLabel = 'Installment 1 of 12',
  amount           = 500,
  dueDate          = '—',
  status           = 'upcoming',
  chitName         = '',
  onPayNow,
  isProcessing     = false,
}) {
  const cfg        = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  const isPaid     = status === 'paid';
  const isOverdue  = status === 'overdue';

  return (
    <GlassCard
      padding="p-4"
      className={[
        'w-full',
        // Subtle left accent border per status
        isOverdue && 'border-l-4 border-l-rose-400',
        isPaid    && 'border-l-4 border-l-emerald-400',
        !isPaid && !isOverdue && 'border-l-4 border-l-amber-300',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Row 1: label + status pill ───────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-stone-500 font-medium mb-0.5">{chitName}</p>
          <p className="text-sm font-semibold text-stone-800">{installmentLabel}</p>
        </div>
        <PillTag colorType={cfg.colorType} icon={cfg.icon} label={cfg.label} />
      </div>

      {/* ── Row 2: amount + due date ─────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-emerald-950 leading-none">
            ₹{formatINR(amount)}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Due&nbsp;
            <span className={isOverdue ? 'text-rose-600 font-semibold' : 'text-stone-500'}>
              {dueDate}
            </span>
          </p>
        </div>

        {/* Pay Now — hidden when already paid */}
        {!isPaid && (
          <ActionButton
            variant={isOverdue ? 'crimson' : 'emerald'}
            isLoading={isProcessing}
            onClick={onPayNow}
            className="text-xs px-4 py-2"
          >
            Pay Now
          </ActionButton>
        )}

        {isPaid && (
          <CheckCircle2 size={28} className="text-emerald-500" strokeWidth={1.8} />
        )}
      </div>
    </GlassCard>
  );
}
