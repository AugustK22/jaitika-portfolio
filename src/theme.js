// src/theme.js

// Light theme variables
const lightTheme = {
    '--gradient-background': 'linear-gradient(135deg, #fef6f0 0%, #fdf2f8 50%, #f0f9ff 100%)',
    '--surface-card': 'rgba(255, 255, 255, 0.7)',
    '--text-primary': '#4a4a4a',
    '--text-heading': '#2d2d2d',
    '--accent-blue': '#81c6d9',
    '--accent-pink': '#f4b1c2',
    '--accent-gold': '#d4af37',
    '--hero-gradient-start': '#760eb7',
    '--hero-gradient-end': '#c61052',
    '--card-shadow': '0 8px 25px rgba(0, 0, 0, 0.08)',
    '--surface-border': 'rgba(129, 198, 217, 0.25)',
    // Add any other specific light mode variables you need
  };
  
  // Dark theme variables
  const darkTheme = {
    '--gradient-background': 'radial-gradient(circle at top, #0f172a 0%, #0b1120 45%, #020617 100%)',
    '--surface-card': 'rgba(17, 24, 39, 0.78)',
    '--text-primary': '#e2e8f0',
    '--text-heading': '#f8fafc',
    '--accent-blue': '#7dd3e8',
    '--accent-pink': '#f9a8d4',
    '--accent-gold': '#facc15',
    '--hero-gradient-start': '#7dd3e8',
    '--hero-gradient-end': '#f9a8d4',
    '--card-shadow': '0 20px 40px rgba(8, 11, 23, 0.6)',
    '--surface-border': 'rgba(125, 211, 232, 0.25)',
    // Add any other specific dark mode variables you need
  };
  
  export const themes = {
    light: lightTheme,
    dark: darkTheme,
  };