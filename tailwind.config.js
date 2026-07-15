/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Near-black backgrounds (waitlist identity)
        ink: {
          DEFAULT: '#0B0B0C',
          900: '#101012',
          800: '#141416',
        },
        // Charcoal surfaces (cards on ink)
        card: {
          DEFAULT: '#141416',
          2: '#18181B',
          3: '#1F1F23',
        },
        line: '#2c2c30',
        // Brand accent — electric yellow
        accent: {
          DEFAULT: '#E9EF3A',
          soft: 'rgba(233,239,58,0.12)',
        },
        // Text
        paper: '#F4F2EC',
        fg: {
          DEFAULT: '#F4F2EC',
          1: '#E7E5DD',
          2: '#c7c5bc',
          3: '#8a897f',
        },
        success: '#3DD68C',
      },
      fontFamily: {
        sans: ['Archivo', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '1180px',
        narrow: '760px',
      },
      boxShadow: {
        cta: '0 10px 34px rgba(233,239,58,0.22)',
        card: '0 8px 30px rgba(0,0,0,0.45)',
        float: '0 24px 60px rgba(0,0,0,0.55)',
      },
      borderRadius: {
        btn: '13px',
        card: '14px',
        lg2: '18px',
      },
      letterSpacing: {
        display: '-0.01em',
        tight2: '-0.015em',
        caps: '0.2em',
      },
    },
  },
  plugins: [],
}
