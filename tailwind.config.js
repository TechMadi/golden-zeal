/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/golden-zeal/src/**/*.{html,ts}',
    './projects/admin-golden-zeal/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'gz-black': '#1f1f1f',
        'gz-ivory': '#f6f3ee',
        'gz-charcoal': '#333333',
        'gz-gold': '#d4af37',
        'gz-green': '#0f4d2e',
        'gz-clay': '#8c3b2e',
        'gz-olive': '#6e7468',
        'gz-sand': '#e4ddcf',
      },
    },
  },
  plugins: [],
};
