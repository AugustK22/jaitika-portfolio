// src/hooks/useThemeManager.js
import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { themes } from '../theme'; // Import our theme objects


export function useThemeManager() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const storedPreference = window.localStorage.getItem('theme');
    if (storedPreference === 'light' || storedPreference === 'dark') {
      return storedPreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // This is the core manual function
  const applyTheme = useCallback((themeName) => {
    const themeObject = themes[themeName];
    if (!themeObject) return;

    // Remove old class, add new one
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${themeName}-mode`);
    document.body.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-bs-theme', themeName === 'dark' ? 'dark' : 'light');

    const root = document.documentElement;
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(`${themeName}-mode`);
    root.setAttribute('data-theme', themeName);
    root.setAttribute('data-bs-theme', themeName === 'dark' ? 'dark' : 'light');

    // Manually set each CSS variable on the body's style
    for (const [key, value] of Object.entries(themeObject)) {
      document.body.style.setProperty(key, value);
    }
  }, []);

  // Effect to apply theme when state changes
  useLayoutEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme, applyTheme]);

  // Effect to listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      const newTheme = event.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  return [theme, toggleTheme];
}
