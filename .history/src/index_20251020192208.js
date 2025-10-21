// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { LoadingProvider } from './components/loading';
import Preloader from './components/Preloader';

// Best guess hero URL ,  keep this the same as in Home.js
const HERO_URL = 'https://i.ibb.co/xKJ6GYnb/JSR-1.webp';

// Prewarm hero into the cache before React does anything.
try {
  const _pre = new Image();
  _pre.src = HERO_URL;
} catch { /* non-fatal */ }

const root = createRoot(document.getElementById('root'));
root.render(
  <LoadingProvider timeoutMs={12000}>
    {/* Global overlay that hides all routes until ready */}
    <Preloader />
    <App />
  </LoadingProvider>
);
