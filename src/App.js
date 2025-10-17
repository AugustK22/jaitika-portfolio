// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
import { useThemeManager } from './hooks/useThemeManager';
// import { LoadingProvider } from './components/loading';
// import Preloader from './components/Preloader';
// import { Helmet } from 'react-helmet';



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
  // <Helmet>
  //       <link
  //         rel="preload"
  //         as="image"
  //         href="https://i.ibb.co/xKJ6GYnb/JSR-1.webp"
  //         // Optional: if you add a srcset, also add imagesrcset/imagesizes here
  //       />
  //     </Helmet>

  const [theme, toggleTheme] = useThemeManager();

  return (
    // <LoadingProvider timeoutMs={10000}>
    <Router>
      {/* <Preloader /> */}
      {/* <FairyLights /> */}
      <div className="app-shell">
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
    // </LoadingProvider>
  );
}

export default App;
