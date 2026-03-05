/**
 * components/molecules/ThreatMessageRow.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 2 — Chat bubble row for the Legal Shield threat review flow.
 *
 * Renders a single threatening message as a selectable chat bubble.
 * A checkbox lets the user mark it for inclusion in the AI FIR draft.
 * Selection state (checked) is controlled externally for use inside
 * AutoFirReviewModal which manages the list of selected message IDs.
 *
 * Design: Crimson/rose palette per SheVest rules (Legal Shield = danger).
 *
 * Props:
 *   id           — unique message identifier (string | number)
 *   senderName   — string  e.g. "Unknown +91 98xxx xxxxx"
 *   timestamp    — string  e.g. "12 Feb 2026, 10:43 AM"
 *   messageText  — string  the raw threatening message content
 *   isChecked    — boolean (controlled)
 *   onToggle     — (id) => void  called when checkbox changes
 *   isHighPriority — boolean  adds an extra "High Priority" badge
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, UserX } from 'lucide-react';
import PillTag from '../atoms/PillTag';

export default function ThreatMessageRow({
  id,
  senderName     = 'Unknown Sender',
  timestamp      = '',
  messageText    = '',
  isChecked      = false,
  onToggle,
  isHighPriority = false,
}) {
  const handleChange = () => onToggle?.(id);

  return (
    <motion.label
      htmlFor={`threat-msg-${id}`}
      layout
      className={[
        'flex items-start gap-3 p-3 rounded-xl cursor-pointer',
        'transition-colors duration-150',
        isChecked
          ? 'bg-rose-50/80 border border-rose-300/60 shadow-sm shadow-rose-100'
          : 'bg-white/50 border border-white/40 hover:bg-rose-50/40',
      ].join(' ')}
    >
      {/* ── Checkbox ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 mt-0.5">
        <input
          id={`threat-msg-${id}`}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          className="sr-only"
          aria-label={`Select message from ${senderName}`}
        />
        {/* Custom checkbox ring */}
        <motion.div
          animate={isChecked ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.2 }}
          className={[
            'w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors',
            isChecked
              ? 'bg-rose-500 border-rose-500'
              : 'bg-white border-stone-300',
          ].join(' ')}
          aria-hidden="true"
        >
          <AnimatePresence>
            {isChecked && (
              <motion.svg
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                viewBox="0 0 12 10"
                fill="none"
                className="w-3 h-2.5"
              >
                <path
                  d="M1 5l3.5 3.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Bubble body ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Sender row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <UserX size={13} className="text-rose-500 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
          <span className="text-xs font-semibold text-rose-700 truncate">
            {senderName}
          </span>
          {isHighPriority && (
            <PillTag colorType="danger" icon={AlertTriangle} label="High Priority" />
          )}
          {timestamp && (
            <span className="text-[10px] text-stone-400 ml-auto">{timestamp}</span>
          )}
        </div>

        {/* Message text bubble */}
        <div
          className={[
            'px-3 py-2 rounded-lg rounded-tl-sm text-sm leading-relaxed',
            'border',
            isChecked
              ? 'bg-rose-100/70 border-rose-200/60 text-rose-900'
              : 'bg-stone-50/80 border-stone-200/50 text-stone-700',
          ].join(' ')}
        >
          {messageText}
        </div>

        {/* Selection hint */}
        <p className="text-[10px] mt-1 text-stone-400">
          {isChecked ? '✓ Marked for FIR review' : 'Tap to include in report'}
        </p>
      </div>
    </motion.label>
  );
}
