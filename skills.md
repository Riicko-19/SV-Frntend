# SheVest Frontend Architecture & Design Rules

## 1. Project Context & Mission
SheVest is a B2B2C FinTech Progressive Web App (PWA) designed exclusively for unbanked Indian women in the informal economy (tailors, street vendors, domestic workers). It bypasses formal credit scores (CIBIL) by digitizing traditional "Chit Funds" to build a mathematical Trust Score, which then unlocks a secure P2P micro-lending marketplace. 
**The X-Factor:** It includes an AI-powered "Auto-FIR" Legal Bodyguard to protect women from digital extortion and predatory recovery agents.

## 2. Tech Stack & Architecture
- **Framework:** React 18+ with Vite.
- **Styling:** Tailwind CSS v3+.
- **Animations:** `framer-motion` for fluid state transitions and micro-interactions.
- **Icons:** `lucide-react`.
- **Layout Constraint (STRICT):** Mobile-first PWA. All primary views must be constrained to a mobile viewport (`max-w-md mx-auto min-h-screen`).
- **File Structure:** Adhere to Atomic Design principles (`components/atoms`, `components/molecules`, `components/organisms`, `views`).

## 3. The Design System (STRICTLY ENFORCE)
We use a "Soft 3D Glassmorphism" aesthetic to feel premium, safe, and transparent.
- **Base Background:** Ivory / Off-white (`bg-stone-50`).
- **Glass Components:** All cards, modals, and heavy UI blocks MUST use frosted glass utilities: `bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg`.
- **Typography:** `font-sans` mapped to "Plus Jakarta Sans". Text must be soft but readable: Dark Olive/Charcoal (`text-emerald-950` or `text-stone-800`).
- **Color Palette & Psychology:**
  - **Trust / Positive Action:** Emerald / Forest Green (`bg-emerald-500`, `text-emerald-700`). Used for Chit Fund payments, Trust Score boosts, and successful KYC.
  - **Danger / Legal Shield:** Crimson Red / Rose (`bg-rose-500`, `text-rose-700`, `border-rose-500/50`). Used EXCLUSIVELY for the Auto-FIR chat UI and threat reporting.
  - **Alerts / Pending:** Amber / Yellow (`bg-amber-100`, `text-amber-700`). Used for upcoming EMIs and pending NGO verification.
- **FORBIDDEN COLORS:** Do NOT use pure black (`#000000`), deep blue, or purple anywhere in the UI.

## 4. FinTech & Cultural UI Rules
- **Currency Formatting:** Always use the Indian Rupee symbol (₹) and the Indian numbering system (e.g., ₹1,50,000, not ₹150,000).
- **Tone & Copy:** Must be empathetic, highly accessible, and culturally relevant to rural/semi-urban Indian women. Avoid complex Western banking jargon (e.g., use "Monthly Pool" instead of "Amortized Escrow"). Use localized placeholder names (e.g., "Kavita", "Bengaluru Makers Circle").
- **Trust Score UI:** Changes to the Trust Score must be highly visual. When a user pays an installment, animate the score incrementing and use a green pulse effect.
- **The P2P Gateway Lock:** If `trustScore < 80`, the P2P Marketplace MUST be blurred out using a frosted glass overlay (`backdrop-blur-md`) with a lock icon, explaining that more Chit cycles are needed.

## 5. Security & AI Safety UI Logic
- **Human-in-the-loop (AI FIR):** The Legal Shield must NEVER instantly generate a PDF. It must first display a `ThreatReview` modal showing the specific flagged messages.
- **Legal Compliance Checkbox:** The FIR generation button MUST be disabled until the user checks a box stating: "I confirm these are true threats and acknowledge BNS Section 240 regarding false information."
- **Fractional Funding:** Loan cards in the P2P market must show progress bars (e.g., "₹2,000 / ₹5,000 Funded") and include a tactile slider for lenders to choose partial funding amounts.
- **NGO Admin Overrides:** Ensure Admin views include UI elements to manually verify users (bypassing DigiLocker if needed) and override device limits (for households sharing a single smartphone).