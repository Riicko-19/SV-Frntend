/**
 * components/organisms/AutoFirReviewModal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT 3 — Legal Shield: human-in-the-loop FIR review modal.
 *
 * SAFETY RULES (from skills.md — STRICTLY ENFORCED):
 *  1. Never auto-generate FIR. User MUST review flagged messages first.
 *  2. "Generate FIR" button is DISABLED until:
 *       a) At least ONE ThreatMessageRow is selected.
 *       b) The BNS Section 240 acknowledgement checkbox is checked.
 *  3. Uses crimson/rose palette exclusively (Legal Shield = danger color).
 *
 * Props:
 *   isOpen          — boolean  controls modal visibility
 *   onClose         — () => void
 *   onGenerateFir   — (selectedMessages: Array) => void  called with selections
 *   messages        — Array<{ id, senderName, timestamp, messageText, isHighPriority }>
 *   isGenerating    — boolean  loading state for the generate button
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  X,
  FileText,
  AlertTriangle,
  CheckSquare,
} from 'lucide-react';
import ThreatMessageRow from '../molecules/ThreatMessageRow';
import ActionButton     from '../atoms/ActionButton';

// ── Backdrop ──────────────────────────────────────────────────────────────────
function Backdrop({ onClose }) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-rose-950/30 backdrop-blur-sm z-40"
      aria-hidden="true"
      onClick={onClose}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AutoFirReviewModal({
  isOpen        = false,
  onClose,
  onGenerateFir,
  messages      = [],
  isGenerating  = false,
}) {
  const [selectedIds, setSelectedIds]     = useState(new Set());
  const [acknowledged, setAcknowledged]   = useState(false);

  // Reset state each time modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setAcknowledged(false);
    }
  }, [isOpen]);

  // ── Selection handlers ─────────────────────────────────────────────────────
  const toggleMessage = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () =>
    setSelectedIds(new Set(messages.map((m) => m.id)));

  const clearAll = () => setSelectedIds(new Set());

  // ── Gate logic ─────────────────────────────────────────────────────────────
  const hasSelections   = selectedIds.size > 0;
  const canGenerate     = hasSelections && acknowledged;

  // ── Derive selected message objects for callback ─────────────────────────
  const handleGenerate = () => {
    if (!canGenerate) return;
    const selected = messages.filter((m) => selectedIds.has(m.id));
    onGenerateFir?.(selected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Centering overlay (click-outside closes) ──────────────── */}
          <motion.div
            key="fir-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          >
          {/* ── Modal card ───────────────────────────────────────────────── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fir-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[95vw] sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden bg-white/70 backdrop-blur-xl border border-rose-200/50 rounded-3xl shadow-xl shadow-rose-900/10"
          >
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-rose-100/60 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-rose-100/80 p-2 rounded-xl border border-rose-200/50">
                  <ShieldAlert size={20} className="text-rose-600" strokeWidth={2} />
                </div>
                <div>
                  <h2
                    id="fir-modal-title"
                    className="text-base font-bold text-rose-950"
                  >
                    Legal Shield — FIR Review
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    {messages.length} flagged message{messages.length !== 1 ? 's' : ''} detected
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <X size={18} className="text-stone-500" />
              </button>
            </div>

            {/* ── Warning banner ────────────────────────────────────────── */}
            <div className="mx-4 mt-3 flex-shrink-0 flex items-start gap-2.5 px-3 py-2.5 bg-amber-50/80 border border-amber-200/60 rounded-xl">
              <AlertTriangle
                size={15}
                className="text-amber-600 mt-0.5 flex-shrink-0"
                strokeWidth={2.5}
              />
              <p className="text-xs text-amber-800 leading-relaxed">
                Review the messages below carefully. Select the ones you wish
                to include in your First Information Report. This cannot be
                undone.
              </p>
            </div>

            {/* ── Select all / clear controls ───────────────────────────── */}
            {messages.length > 0 && (
              <div className="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                  Flagged Messages
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Select all
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs text-stone-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Message list (scrollable) ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 space-y-2 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                  <ShieldAlert size={32} strokeWidth={1.5} className="mb-2 opacity-40" />
                  <p className="text-sm">No flagged messages</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ThreatMessageRow
                    key={msg.id}
                    id={msg.id}
                    senderName={msg.senderName}
                    timestamp={msg.timestamp}
                    messageText={msg.messageText}
                    isHighPriority={msg.isHighPriority}
                    isChecked={selectedIds.has(msg.id)}
                    onToggle={toggleMessage}
                  />
                ))
              )}
            </div>

            {/* ── Footer: acknowledgement + CTA ─────────────────────────── */}
            <div className="border-t border-rose-100/60 px-4 py-4 space-y-3 flex-shrink-0 bg-white/40 backdrop-blur-sm rounded-b-3xl">

              {/* Selection count */}
              {hasSelections && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-700 font-semibold text-center"
                >
                  {selectedIds.size} message{selectedIds.size !== 1 ? 's' : ''} selected for report
                </motion.p>
              )}

              {/* ── BNS 240 acknowledgement (MANDATORY GATE) ──────────── */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id="bns-240-ack"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="sr-only"
                  />
                  <motion.div
                    animate={acknowledged ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.2 }}
                    className={[
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                      acknowledged
                        ? 'bg-rose-500 border-rose-500'
                        : 'bg-white border-stone-300 group-hover:border-rose-300',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    <AnimatePresence>
                      {acknowledged && (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <CheckSquare size={14} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  I confirm these are true threats and acknowledge{' '}
                  <span className="font-bold text-rose-700">
                    BNS Section 240
                  </span>{' '}
                  regarding providing false information to law enforcement.
                </p>
              </label>

              {/* ── Generate FIR button ──────────────────────────────────── */}
              <ActionButton
                variant="crimson"
                className="w-full justify-center"
                disabled={!canGenerate}
                isLoading={isGenerating}
                onClick={handleGenerate}
              >
                <FileText size={16} strokeWidth={2} aria-hidden="true" />
                Generate FIR Draft
              </ActionButton>

              {/* Hint text when gate is blocked */}
              <AnimatePresence>
                {!canGenerate && !isGenerating && (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-stone-400 text-center"
                  >
                    {!hasSelections
                      ? 'Select at least one message to continue'
                      : 'Check the acknowledgement above to proceed'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
