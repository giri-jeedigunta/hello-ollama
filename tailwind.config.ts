import typography from '@tailwindcss/typography';

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}', // Add this if you have components
  ],
  theme: {
    extend: {
        colors: {
            // Futuristic color palette
            primary: '#3498fe', // Electric blue
            secondary: '#7b2ff7', // Electric purple
            accent: '#00f2ea', // Cyan
            highlight: '#ff2a6d', // Neon pink
            dark: '#1a1a2e', // Deep space blue
        },        
    },
  },
  plugins: [typography],
};

export default config;