/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '3px',
        lg: '4px',
        full: '9999px',
      },
      boxShadow: {
        DEFAULT: 'none',
        sm: '0 1px 2px 0 rgba(28,27,25,0.06)',
      },
      fontFamily: {
        display: ['Fraunces', '"Noto Serif Devanagari"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        /* Base */
        paper: '#FBF9F4',
        ink: { DEFAULT: '#1C1B19', muted: '#55524B' },
        border: '#D9D4C7',

        /* Institutional core */
        navy: { DEFAULT: '#0B2545', deep: '#081B33' },
        forest: '#14532D',

        /* Accent — CTA-only */
        turmeric: { DEFAULT: '#E7A614', deep: '#C48A0A' },

        /* Keep existing brand for backward compat */
        brand: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },

        /* Workflow status (my dashboard) */
        'st-submitted': '#6B7280',
        'st-review': '#B45309',
        'st-routed': '#1D4ED8',
        'st-progress': '#7C3AED',
        'st-funded': '#0F766E',
        'st-resolved': '#15803D',
        urgent: '#B91C1C',

        /* Workflow state tokens (friend's layout) */
        submitted: '#6B7280',
        'under-review': '#B45309',
        routed: '#1D4ED8',
        'in-progress': '#7C3AED',
        funded: '#0F766E',
        resolved: '#15803D',

        /* Category/domain palette (muted, not neon) */
        'cat-education': '#1D4ED8',
        'cat-health': '#BE123C',
        'cat-agriculture': '#4D7C0F',
        'cat-water': '#0891B2',
        'cat-environment': '#15803D',
        'cat-energy': '#B45309',
        'cat-urban': '#7C3AED',
        'cat-accessibility': '#0F766E',
        'cat-livelihood': '#92400E',
      },
    },
  },
  plugins: [],
};
