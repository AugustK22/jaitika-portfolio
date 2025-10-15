import React, { useEffect, useState } from "react";
// import FairyLights from "../components/FairyLights";
import Footer from "../components/Footer";
import "./mixtape.css";
import Tracks from "../components/Tracks";

// --- Firebase (modular SDK) with graceful fallback like Journal ---
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

const ROT = [-6, -3, -1, 2, 4, 5];

export default function Mixtape() {
  const [photos, setPhotos] = useState([]);
  const [phErr, setPhErr] = useState("");

  useEffect(() => {
    let db;
    try {
      if (!initializeApp) throw new Error("Firebase SDK not found");
      const app =
        (getApps && getApps().length && getApps()[0]) ||
        initializeApp(firebaseConfig);
      db = getDatabase(app);
    } catch (e) {
      console.error("Firebase init (Mixtape) error:", e);
      setPhErr("Photos offline.");
      return;
    }

    // Listen to /mixtape/photos where data is { "https://...img": "caption" }
    // Listen to /db/mixtape/photos where items are { url, note, addedAt }
const photosRef = ref(db, "db/mixtape/photos");

    const unsub = onValue(
      photosRef,
      (snap) => {
        if (!snap.exists()) {
          setPhotos([]);
          return;
        }
        const obj = snap.val() || {};
const list = Object.values(obj)
  .map((row) => ({
    src: String(row?.url ?? ""),
    caption: String(row?.note ?? ""),
    addedAt: Number(row?.addedAt ?? 0),
  }))
  .filter((p) => /^https?:\/\//i.test(p.src))
  .sort((a, b) => b.addedAt - a.addedAt) // newest first
  .map(({ addedAt, ...rest }) => rest);  // drop addedAt for UI
setPhotos(list);

      },
      (err) => {
        console.error("Photos fetch error:", err);
        setPhErr("Couldn’t fetch photos.");
      }
    );
    return () => typeof unsub === "function" && unsub();
  }, []);

  return (
    <>
      {/* <FairyLights /> */}

      <main className="mixtape-page">
        <div className="container">
          {/* Header */}
          <header className="page-header">
            <div className="kicker">the mixtape</div>
            <h1>My Simple Pleasures.</h1>
            <div className="subtitle">
              Chaotic · Dreamy · Ambitious — cozy on purpose
            </div>
            <p className="intro">
              A messy, warm little room on the internet. Music to time-travel
              with, polaroids that refuse to sit straight, and tiny decisions
              that say a lot.
            </p>
          </header>

          {/* MUSIC */}
          <section className="section card" aria-label="Music">
            <h2>A Soundtrack for the Soul.</h2>
            <div className="line" />
            <div className="music-grid">
              <div className="playlist-embed">
              + <iframe
   style={{ borderRadius: "12px" }}
   src="https://open.spotify.com/embed/playlist/320Mu0SXXYHQ9CsyC28V9e?utm_source=generator"
   width="100%"
   height="352"
   frameBorder="0"
   allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
   loading="lazy"
   title="Spotify Playlist Embed"
   referrerPolicy="strict-origin-when-cross-origin"
 />

              </div>

              <Tracks />
            </div>
          </section>

          {/* POLAROID GALLERY (Firebase-driven) */}
          {/* MOOD BOARD GALLERY (Firebase-driven) */}
          <section className="section moodboard-section" aria-label="Photo Gallery">
            <h2>Little things I keep like seashells.</h2>
            <div className="line" />

            {phErr && (
              <div className="muted" style={{ marginBottom: "16px", textAlign: "center" }}>
                {phErr}
              </div>
            )}

            <div className="moodboard">
              {(photos.length ? photos : []).map((p, i) => (
                <div
                  key={`${p.src}-${i}`}
                  className="pin-container"
                  style={{ "--rot": `${ROT[i % ROT.length]}deg` }}
                >
                  <div className="pin-head"></div>
                  <figure className="pinned-photo">
                    <img
                      src={p.src}
                      alt={p.caption ? p.caption : `Memory ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                    {p.caption && (
                      <figcaption className="photo-caption">
                        {p.caption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              ))}
            </div>
          </section>

          {/* THIS OR THAT */}
          <section className="section card" aria-label="This or That">
            <h2>This or That</h2>
            <div className="line" />
            <div className="this-that">
              <div className="choice">
                <h3>
                  <span>Cold Coffee</span>{" "}
                  <span className="pill-mini">&gt;</span>{" "}
                  <span>Hot Coffee</span>
                </h3>
                <div className="vs">picking the chill</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Cold Coffee</span>
                </div>
              </div>
              <div className="choice">
                <h3>
                  <span>Sunrise</span>{" "}
                  <span className="pill-mini">&gt;</span>{" "}
                  <span>Sunset</span>
                </h3>
                <div className="vs">hope &gt; nostalgia</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Sunrise</span>
                </div>
              </div>
              <div className="choice">
                <h3>
                  <span>Oceans</span>{" "}
                  <span className="pill-mini">&gt;</span>{" "}
                  <span>Mountains</span>
                </h3>
                <div className="vs">tide over pride</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Oceans</span>
                </div>
              </div>
              <div className="choice">
                <h3>
                  <span>Spontaneous</span>{" "}
                  <span className="pill-mini">&gt;</span>{" "}
                  <span>Planned</span>
                </h3>
                <div className="vs">chaos dressed well</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Spontaneous</span>
                </div>
              </div>
              <div className="choice">
                <h3>
                  <span>Texting</span>{" "}
                  <span className="pill-mini">&gt;</span>{" "}
                  <span>Calling</span>
                </h3>
                <div className="vs">poems over pauses</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Texting</span>
                </div>
              </div>
              <div className="choice">
                <h3>
                  <span>Savoury</span>{" "}
                  <span className="pill-mini">&gt;</span> <span>Sweet</span>
                </h3>
                <div className="vs">salt before sugar</div>
                <div className="opt">
                  <strong>Winner:</strong>
                  <span className="arrow">Savoury</span>
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
