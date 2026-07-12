/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1220',
        card: '#111827',
        border: '#1F2937',
        primary: '#3B82F6',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B'
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.35)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
