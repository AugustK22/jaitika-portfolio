import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "./mixtape.css";
import Tracks from "../components/Tracks";

// Firebase imports with graceful fallback
let initializeApp, getDatabase, ref, onValue, getApps;
try {
  ({ initializeApp, getApps } = await import("firebase/app"));
  ({ getDatabase, ref, onValue } = await import("firebase/database"));
} catch {
  initializeApp = window?.firebase?.initializeApp;
  getDatabase = window?.firebaseDatabase?.getDatabase;
  ({ ref, onValue } = window?.firebaseDatabase ?? {});
  getApps = () => (window?.firebaseApps || []);
}

const firebaseConfig = {
  apiKey: "AIzaSyC8lRd_rq5WWly4nE1-fVWNmDHWW9UVgx8",
  authDomain: "js-castle.firebaseapp.com",
  databaseURL: "https://js-castle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "js-castle",
  storageBucket: "js-castle.firebasestorage.app",
  messagingSenderId: "270553123263",
  appId: "1:270553123263:web:7c16052915360a21a6f90a",
  measurementId: "G-TCGW4B73F5",
};

const ROTATIONS = [-6, -3, -1, 2, 4, 5];

export default function Mixtape() {
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");

  // Handle Spotify iframe responsive resize
  useEffect(() => {
    const handleSpotifyResize = () => {
      const iframe = document.querySelector('.playlist-frame');
      if (iframe) {
        const parentWidth = iframe.parentElement.offsetWidth;
        const newHeight = parentWidth + 80; // Spotify's recommended ratio
        iframe.style.width = `${parentWidth}px`;
        iframe.style.height = `${newHeight}px`;
        // Force reload to apply new layout
        const src = iframe.src;
        iframe.src = src;
      }
    };

    // Initial sizing
    handleSpotifyResize();

    // Resize listener with debounce
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleSpotifyResize, 250);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    let db;
    try {
      if (!initializeApp) throw new Error("Firebase SDK not found");
      const app = (getApps && getApps().length && getApps()[0]) || initializeApp(firebaseConfig);
      db = getDatabase(app);
    } catch (e) {
      console.error("Firebase init error:", e);
      setPhotoError("Photos temporarily offline.");
      return;
    }

    const photosRef = ref(db, "db/mixtape/photos");
    const unsubscribe = onValue(
      photosRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPhotos([]);
          return;
        }
        const data = snapshot.val() || {};
        const photoList = Object.values(data)
          .map((item) => ({
            src: String(item?.url ?? ""),
            caption: String(item?.note ?? ""),
            addedAt: Number(item?.addedAt ?? 0),
          }))
          .filter((p) => /^https?:\/\//i.test(p.src))
          .sort((a, b) => b.addedAt - a.addedAt)
          .map(({ addedAt, ...rest }) => rest);
        setPhotos(photoList);
      },
      (error) => {
        console.error("Photos fetch error:", error);
        setPhotoError("Couldn't load photos.");
      }
    );
    return () => typeof unsubscribe === "function" && unsubscribe();
  }, []);

  return (
    <>
      <main className="mixtape-page">
        <div className="container">
          {/* Header */}
          <header className="page-header">
            <div className="kicker">the mixtape</div>
            <h1>My Simple Pleasures.</h1>
            <div className="subtitle">Chaotic · Dreamy · Ambitious · Cozy on purpose</div>
            <p className="intro">
              A messy, warm little room on the internet. Music to time-travel with, polaroids that
              refuse to sit straight, and tiny decisions that say a lot.
            </p>
          </header>

          {/* Music Section */}
          <section className="section music-section" aria-label="Music">
            <h2>A Soundtrack for the Soul.</h2>
            <div className="line" />

            <div className="music-grid">
              {/* Spotify Playlist */}
              <div className="playlist-card">
                <iframe
                  className="playlist-frame"
                  src="https://open.spotify.com/embed/playlist/320Mu0SXXYHQ9CsyC28V9e?utm_source=generator&theme=0"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Playlist"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* Tracks */}
              <div className="tracks-card card">
                <Tracks />
              </div>
            </div>
          </section>

          {/* Photo Gallery */}
          <section className="section moodboard-section" aria-label="Photo Gallery">
            <h2>Little things I keep like seashells.</h2>
            <div className="line" />

            {photoError && <div className="error-message">{photoError}</div>}

            <div className="moodboard">
              {photos.length === 0 && !photoError && (
                <div className="empty-state">No photos yet...</div>
              )}
              {photos.map((photo, index) => (
                <div
                  key={`${photo.src}-${index}`}
                  className="pin-container"
                  style={{ "--rot": `${ROTATIONS[index % ROTATIONS.length]}deg` }}
                >
                  <div className="pin-head" />
                  <figure className="pinned-photo">
                    <img
                      src={photo.src}
                      alt={photo.caption || `Memory ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                    {photo.caption && <figcaption className="photo-caption">{photo.caption}</figcaption>}
                  </figure>
                </div>
              ))}
            </div>
          </section>

          {/* This or That */}
          <section className="section card this-that-section" aria-label="Preferences">
            <h2>This or That</h2>
            <div className="line" />

            <div className="choices-grid">
              <div className="choice">
                <h3>
                  <span>Cold Coffee</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Hot Coffee</span>
                </h3>
                <div className="vs">picking the chill</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Cold Coffee</span>
                </div>
              </div>

              <div className="choice">
                <h3>
                  <span>Sunrise</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Sunset</span>
                </h3>
                <div className="vs">hope &gt; nostalgia</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Sunrise</span>
                </div>
              </div>

              <div className="choice">
                <h3>
                  <span>Oceans</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Mountains</span>
                </h3>
                <div className="vs">tide over pride</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Oceans</span>
                </div>
              </div>

              <div className="choice">
                <h3>
                  <span>Spontaneous</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Planned</span>
                </h3>
                <div className="vs">chaos dressed well</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Spontaneous</span>
                </div>
              </div>

              <div className="choice">
                <h3>
                  <span>Texting</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Calling</span>
                </h3>
                <div className="vs">poems over pauses</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Texting</span>
                </div>
              </div>

              <div className="choice">
                <h3>
                  <span>Savoury</span>
                  <span className="pill-mini" aria-label="versus">&gt;</span>
                  <span>Sweet</span>
                </h3>
                <div className="vs">salt before sugar</div>
                <div className="winner">
                  <strong>Winner:</strong>
                  <span className="winner-text">Savoury</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}