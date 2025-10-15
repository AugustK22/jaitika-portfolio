// src/App.js
import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useLenis from './hooks/useLenis';
// import React, { Suspense, lazy } from 'react';
// 
// Import Components
import Navbar from './components/Navbar';
import FairyLights from './components/FairyLights';

// Import Pages
const Home = lazy(() => import('./pages/Home'));
const Blueprint = lazy(() => import('./pages/Blueprint'));
const Journal = lazy(() => import('./pages/Journal'));
const Mixtape = lazy(() => import('./pages/Mixtape'));
const Sphere = lazy(() => import('./pages/Sphere'));

function App() {
  // useLenis();
  const getInitialTheme = () => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const storedPreference = window.localStorage.getItem('theme');
    if (storedPreference === 'light' || storedPreference === 'dark') {
      return storedPreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setTheme(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <Router>
      {/* <FairyLights /> */}
      <div className="container">
      <Suspense fallback={null /* our global Preloader covers this */}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar isDarkMode={theme === 'dark'} onToggleTheme={toggleTheme} />
                <Home />
              </>
            }
          />
          <Route
            path="/blueprint"
            element={
              <>
                <Navbar isDarkMode={theme === 'dark'} onToggleTheme={toggleTheme} />
                <Blueprint />
              </>
            }
          />
          <Route path="/journal" element={<Journal />} />
          <Route
            path="/sphere"
            element={
              <>
                <Navbar isDarkMode={theme === 'dark'} onToggleTheme={toggleTheme} />
                <Sphere />
              </>
            }
          />
          <Route
            path="/mixtape"
            element={
              <>
                <Navbar isDarkMode={theme === 'dark'} onToggleTheme={toggleTheme} />
                <Mixtape />
              </>
            }
          />
        </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
