// src/pages/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
// import JSR from './JSR.png'
// import FairyLights from '../components/FairyLights';
// import '../index.css';
import './home.css';

import { useLoading } from '../components/loading';

const Home = () => {
    const heroContentRef = useRef(null);
    const heroImageRef = useRef(null);
    const navigate = useNavigate();


    const { register  } = useLoading();
    useEffect(() => {
        const waitForHeroImage = () =>
          new Promise((resolve) => {
            // Grab the element (via ref if present, else query once it exists)
            const getImg = () => heroImageRef.current?.querySelector('img');
    
            const attach = (img) => {
              if (!img) {
                // wait for it to appear in the DOM
                const mo = new MutationObserver(() => {
                  const node = getImg();
                  if (node) {
                    mo.disconnect();
                    attach(node);
                  }
                });
                mo.observe(document.body, { childList: true, subtree: true });
                // safety timer in case observer never fires
                setTimeout(() => { mo.disconnect(); resolve(); }, 8000);
                return;
              }
    
              // resolve when fully decoded (no layout jank)
              if ('decode' in img) {
                img.decode().then(resolve).catch(resolve);
              } else if (img.complete) {
                resolve();
              } else {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
              }
            };
    
            attach(getImg());
          });
    
        // Register the factory (must be a function that returns a fresh promise)
        register(() => waitForHeroImage());
      }, [register]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
            if (heroContentRef.current) {
              heroContentRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
              heroContentRef.current.style.willChange = 'transform';
            }
            if (heroImageRef.current) {
              heroImageRef.current.style.transform = `translateY(${scrolled * 0.2}px)`;
              heroImageRef.current.style.willChange = 'transform';
            }
            ticking = false;
          });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Kick once for initial layout
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll, { passive: true });
      }, []);
      

    return (
        <>
            {/* <FairyLights /> */}
            <div className="ultimate-container style: { width: '100%'margin: '0 auto' }">

            <section className="hero">
                <div className="hero-content" ref={heroContentRef}>
                    <div className="greeting">Welcome to my universe</div>
                    <h1 >Jaitika Singh<br />Rathore</h1>
                    <div className="subtitle">Chaotic. Dreamy. Ambitious.</div>
                    <p className="intro-text">
                        Welcome to my corner of the universe. I'm a soul who lives in the margins, turning heartbreak into poetry and chaos into something cinematic. This isn't just a website; it's a collection of <em>late-night thoughts</em>, <em>ambitious daydreams</em>, and the stories that shape me. Come on in.
                    </p>
                </div>

                <div className="hero-image-container" ref={heroImageRef}>
                    <div className="image-wrapper">
                        <div className="polaroid-frame">
                            <img src="https://i.ibb.co/GfhCs4fr/JSR-4-1.webp" border="0" alt="Jaitika Singh Rathore" loading="eager" fetchPriority='high' decoding='async' />
                            <div className="polaroid-caption">living in the margins ✨</div>
                        </div>
                    </div>
                    <div className="dreamcatcher">✧</div>
                    <div className="star-doodle star-1">✦</div>
                    <div className="star-doodle star-2">✧</div>
                    <div className="star-doodle star-3">✶</div>
                </div>
            </section>

            <section className="nav-cards">
                <div className="card" onClick={() => navigate('/blueprint')}>
                    <span className="card-icon">📖</span>
                    <h3>The Blueprint</h3>
                    <p>A glimpse into who I am — the chaotic soul wrapped in fairy lights and ambitious dreams.</p>
                    <div className="card-quote">"I'm exceptionally good at giving love to people"</div>
                </div>
                <div className="card" onClick={() => navigate('/journal')}>
                    <span className="card-icon">🌙</span>
                    <h3>Late Night Thoughts</h3>
                    <p>The journal entries, the heartbreaks turned poetry, the moments that made me who I am.</p>
                    <div className="card-quote">"Everything happens for a reason"</div>
                </div>
                <div className="card" onClick={() => navigate('/sphere')}>
                    <span className="card-icon">✨</span>
                    <h3>The Sphere</h3>
                    <p>Where ambition meets creativity — my professional journey in food technology and marketing.</p>
                    <div className="card-quote">"Chaotic, dreamy, and ambitious"</div>
                </div>
                <div className="card" onClick={() => navigate('/mixtape')}>
                    <span className="card-icon">🎵</span>
                    <h3>The Mixtape</h3>
                    <p>A collection of little things that make me, me — from Vienna by Billy Joel to cold coffee at sunrise.</p>
                    <div className="card-quote">"Roslyn by Bon Iver on a quiet rainy day"</div>
                </div>
            </section>

            <section className="belief-section">
                <h2>I live by</h2>
                <p className="belief-text">
                    <span>Everything happens for a reason.</span> Whatever is yours will come to you, and if it doesn't, it's still yours. And whatever is not yours, it will leave — sooner or later.
                </p>
            </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;