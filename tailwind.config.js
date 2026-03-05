/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ─── Typography ───────────────────────────────────────────────────
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
                display: ['"Plus Jakarta Sans"', 'ui-sans-serif'],
            },
            fontSize: {
                '2xs': ['0.65rem', { lineHeight: '1rem' }],
            },

            // ─── Brand Color Palettes ─────────────────────────────────────────
            colors: {
                // Ivory / Stone — Base backgrounds
                ivory: {
                    50: '#FAFAF7',
                    100: '#F5F5EE',
                    200: '#EEEDE3',
                    300: '#E0DFCF',
                },

                // Emerald / Forest Green — Trust, Success, CTA
                brand: {
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',  // primary
                    600: '#059669',  // hover
                    700: '#047857',  // deep
                    800: '#065F46',
                    900: '#064E3B',
                    950: '#022C22',
                },

                // Crimson / Rose Red — Danger, Legal, Threat
                danger: {
                    50: '#FFF1F2',
                    100: '#FFE4E6',
                    200: '#FECDD3',
                    300: '#FDA4AF',
                    400: '#FB7185',
                    500: '#F43F5E',  // primary
                    600: '#E11D48',  // hover
                    700: '#BE123C',  // deep
                    800: '#9F1239',
                    900: '#881337',
                    950: '#4C0519',
                },

                // Amber — Warnings, Pending status
                amber: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                },

                // Neutral slate — FIR modal, dark overlays
                slate: {
                    800: '#1E293B',
                    850: '#172033',
                    900: '#0F172A',
                    950: '#020617',
                },
            },

            // ─── Mesh Gradient Background ─────────────────────────────────────
            backgroundImage: {
                'mesh-gradient': `
          radial-gradient(ellipse at 15% 15%, rgba(167, 243, 208, 0.55) 0%, transparent 52%),
          radial-gradient(ellipse at 85%  8%, rgba(196, 230, 255, 0.42) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 82%, rgba(221, 214, 254, 0.28) 0%, transparent 52%),
          radial-gradient(ellipse at  8% 88%, rgba(167, 243, 208, 0.38) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(240, 253, 250, 0.60) 0%, transparent 68%)
        `,
                'mesh-gradient-danger': `
          radial-gradient(ellipse at 20% 20%, rgba(254, 205, 211, 0.45) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(253, 164, 175, 0.30) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 241, 242, 0.55) 0%, transparent 65%)
        `,
                'trust-gradient': 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
                'danger-gradient': 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                'glass-shine': 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.05) 100%)',
            },

            // ─── Box Shadows ──────────────────────────────────────────────────
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.10)',
                'glass-xl': '0 24px 64px 0 rgba(31, 38, 135, 0.14)',
                'card-hover': '0 20px 60px 0 rgba(5, 150, 105, 0.15)',
                'trust': '0 8px 32px 0 rgba(16, 185, 129, 0.30)',
                'trust-lg': '0 16px 48px 0 rgba(16, 185, 129, 0.40)',
                'danger': '0 8px 32px 0 rgba(244, 63, 94, 0.35)',
                'danger-lg': '0 16px 48px 0 rgba(244, 63, 94, 0.45)',
                'inset-glass': 'inset 0 1px 0 rgba(255,255,255,0.6)',
            },

            // ─── Border Radius ────────────────────────────────────────────────
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },

            // ─── Backdrop Blur ────────────────────────────────────────────────
            backdropBlur: {
                xs: '2px',
                '3xl': '48px',
            },

            // ─── Animations ───────────────────────────────────────────────────
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                'pulse-ring': {
                    '0%': { boxShadow: '0 0 0 0 rgba(225, 29, 72, 0.55)' },
                    '70%': { boxShadow: '0 0 0 14px rgba(225, 29, 72, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(225, 29, 72, 0)' },
                },
                'pulse-trust': {
                    '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.55)' },
                    '70%': { boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
                },
                'modal-slide-up': {
                    from: { opacity: '0', transform: 'translateY(48px) scale(0.95)' },
                    to: { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                'score-fill': {
                    from: { strokeDashoffset: '251' },
                    to: { strokeDashoffset: 'var(--target-dashoffset)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.7' },
                    '50%': { opacity: '1' },
                },
                'typing-dot': {
                    '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.4' },
                    '40%': { transform: 'scale(1)', opacity: '1' },
                },
                'scan-line': {
                    '0%': { transform: 'translateY(0%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
            animation: {
                'shimmer': 'shimmer 1.6s infinite linear',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                'pulse-trust': 'pulse-trust 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                'modal-slide-up': 'modal-slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                'fade-up': 'fade-up 0.5s ease both',
                'float': 'float 3s ease-in-out infinite',
                'score-fill': 'score-fill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'typing-dot': 'typing-dot 1.4s infinite ease-in-out both',
                'scan-line': 'scan-line 2s linear infinite',
            },

            // ─── Spacing ──────────────────────────────────────────────────────
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '88': '22rem',
                '100': '25rem',
            },

            // ─── Z-Index ──────────────────────────────────────────────────────
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
        },
    },
    plugins: [],
}
