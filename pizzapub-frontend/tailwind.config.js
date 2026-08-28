/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pub: {
          bg: '#0D0D0E',
          surface: '#17181A',
          card: '#202226',
          'card-hover': '#2A2D33',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          red: '#E63B20',
          'red-dark': '#B91C1C',
          orange: '#F27A1A',
          'orange-light': '#FB923C',
          yellow: '#F5C518',
          'yellow-light': '#FEF08A',
        },
        status: {
          novo: '#E63B20',
          preparo: '#F27A1A',
          pronto: '#F5C518',
          entregue: '#22C55E',
        }
      },
      backgroundImage: {
        'flame-gradient': 'linear-gradient(135deg, #E63B20 0%, #F27A1A 100%)',
        'amber-gradient': 'linear-gradient(135deg, #F27A1A 0%, #F5C518 100%)',
        'dark-card-gradient': 'linear-gradient(180deg, #25282F 0%, #17181A 100%)',
      },
      boxShadow: {
        'flame': '0 4px 20px -2px rgba(230, 59, 32, 0.45)',
        'amber': '0 4px 20px -2px rgba(242, 122, 26, 0.35)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'chip': '9999px',
      }
    },
  },
  plugins: [],
}
