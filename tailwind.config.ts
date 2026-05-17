import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // NEW SOFT-PREMIUM BEAUTY-TECH TOKENS
        skin: {
          primary: 'rgb(var(--skin-primary) / <alpha-value>)',
          success: 'rgb(var(--skin-success) / <alpha-value>)',
          lavender: 'rgb(var(--skin-lavender) / <alpha-value>)',
          blue: 'rgb(var(--skin-blue-soft) / <alpha-value>)',
          mint: 'rgb(var(--skin-mint) / <alpha-value>)',
          neutral: 'rgb(var(--skin-bg) / <alpha-value>)',
          surface: 'rgb(var(--skin-surface) / <alpha-value>)',
          slate: 'rgb(var(--skin-text-primary) / <alpha-value>)',
          muted: 'rgb(var(--skin-text-secondary) / <alpha-value>)',
          border: 'rgb(var(--skin-lavender) / <alpha-value>)',
          violet: 'rgb(var(--skin-primary) / <alpha-value>)',
          pearl: 'rgb(var(--skin-bg) / <alpha-value>)',
          dark: 'rgb(var(--text-primary) / <alpha-value>)',
          graphite: 'rgb(var(--skin-graphite) / <alpha-value>)',
          rose: 'rgb(var(--status-danger) / <alpha-value>)',
          gold: 'rgb(var(--accent-gold) / <alpha-value>)',
          brand: {
            gold: '#c9a96e',
          },
          glow: 'rgb(var(--skin-primary) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--skin-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--skin-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--skin-text-secondary) / 0.6)',
        },
      },
      spacing: {
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'shimmer': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 20px rgba(201, 169, 110, 0.4), 0 0 40px rgba(201, 169, 110, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
