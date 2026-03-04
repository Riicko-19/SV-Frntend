/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
            },
            colors: {
                ivory: {
                    50: '#FAFAF7',
                    100: '#F5F5EE',
                    200: '#EEEDE3',
                },
                brand: {
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },
                danger: {
                    50: '#FFF1F2',
                    100: '#FFE4E6',
                    400: '#FB7185',
                    500: '#F43F5E',
                    600: '#E11D48',
                    700: '#BE123C',
                    800: '#9F1239',
                }
            },
            backgroundImage: {
                'mesh-gradient': `
          radial-gradient(ellipse at 20% 20%, rgba(167, 243, 208, 0.45) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 10%, rgba(196, 230, 255, 0.35) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, rgba(221, 214, 254, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, rgba(167, 243, 208, 0.3) 0%, transparent 50%)
        `,
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.10)',
                'glass-xl': '0 24px 64px 0 rgba(31, 38, 135, 0.14)',
                'card-hover': '0 20px 60px 0 rgba(5, 150, 105, 0.15)',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
