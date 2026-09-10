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
        display: ['Fraunces', 'Noto Serif Devanagari', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Hard government tokens
        paper: '#FBF9F4',
        ink: '#1C1B19',
        'ink-muted': '#55524B',
        border: '#D9D4C7',
        navy: '#0B2545',
        'navy-deep': '#081B33',
        forest: '#14532D',
        turmeric: '#E7A614',
        'turmeric-deep': '#C48A0A',

        // Workflow state tokens
        submitted: '#6B7280',
        'under-review': '#B45309',
        routed: '#1D4ED8',
        'in-progress': '#7C3AED',
        funded: '#0F766E',
        resolved: '#15803D',
        urgent: '#B91C1C',

        // Thematic domain tokens
        'cat-education': '#1D4ED8',
        'cat-health': '#BE123C',
        'cat-agriculture': '#4D7C0F',
        'cat-water': '#0891B2',
        'cat-environment': '#15803D',
        'cat-energy': '#B45309',
        'cat-urban': '#7C3AED',
        'cat-accessibility': '#0F766E',
        'cat-livelihood': '#92400E',

        // Backward compatibility
        brand: {
          50: '#FBF9F4',
          100: '#EAE6DB',
          500: '#0B2545',
          600: '#0B2545',
          700: '#081B33',
          900: '#040e1c',
        },
      },
    },
  },
  plugins: [],
};
