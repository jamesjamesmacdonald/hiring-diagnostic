import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette (locked, see BUILD_SPEC.md Section 12)
        navy: '#1F3A5F',
        blue: {
          DEFAULT: '#2E75B6',
          light: '#D5E8F0',
        },
        gold: '#FCE5B6',
        grey: {
          light: '#F2F2F2',
          medium: '#BFBFBF',
        },
        // Funnel stage status colours
        status: {
          tight: '#16A34A', // green-600, score >= 80
          functional: '#CA8A04', // amber-600, score 60-79
          leaking: '#DC2626', // red-600, score 40-59
          broken: '#7F1D1D', // red-900, score 0-39
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'eyebrow': ['0.75rem', { lineHeight: '1rem', fontWeight: '700', letterSpacing: '0.1em' }],
      },
      letterSpacing: {
        wide: '0.1em',
      },
      maxWidth: {
        'content': '720px', // Diagnostic flow max width
        'page': '1080px', // Result page max width
      },
    },
  },
  plugins: [],
};

export default config;
