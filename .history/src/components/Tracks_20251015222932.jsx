// Tracks.jsx
import React, { useEffect, useState } from "react";
import "./tracks.css";

/**
 * Firebase (modular) with graceful fallback just like Mixtape.js.
 * Reuses existing app if already initialized.
 * Path used: db/mixtape/tracks
 */
let initializeApp, getDatabase, ref, onValue, getApps;
try {
  ({ initializeApp, getApps } = await import("firebase/app"));
  ({ getDatabase, ref, onValue } = await import("firebase/database"));
} catch {
  initializeApp = window?.firebase?.initializeApp;
  getDatabase = window?.firebaseDatabase?.getDatabase;
  ({ ref, onValue } = window?.firebaseDatabase ?? {});
  getApps = () => window?.firebaseApps || [];
}

// Same config as Mixtape.js so we don't spawn phantom apps.
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

export default function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let db;
    try {
      if (!initializeApp) throw new Error("Firebase SDK not found");
      const app =
        (getApps && getApps().length && getApps()[0]) ||
        initializeApp(firebaseConfig);
      db = getDatabase(app);
    } catch (e) {
      console.error("Firebase init (Tracks) error:", e);
      setErr("Music is offline.");
      setLoading(false);
      return;
    }

    // Listen to your tracks at: db/mixtape/tracks
    // Expected item shape:
    // { vibe: string, name: string, by: string, url: string }
    const tracksRef = ref(db, "db/mixtape/tracks");

    const unsub = onValue(
      tracksRef,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setTracks([]);
          return;
        }
        const obj = snap.val() || {};
        const list = Object.values(obj)
          .map((row) => ({
            vibe: String(row?.vibe ?? ""),
            title: String(row?.name ?? row?.title ?? ""),
            by: String(row?.by ?? row?.singer ?? row?.writer ?? ""),
            href: String(row?.url ?? row?.href ?? ""),
            addedAt: Number(row?.addedAt ?? 0),
          }))
          .filter((t) => t.title && /^https?:\/\//i.test(t.href))
          .sort((a, b) => b.addedAt - a.addedAt || a.title.localeCompare(b.title))
          .map(({ addedAt, ...rest }) => rest);
        setTracks(list);
      },
      (e) => {
        console.error("Tracks fetch error:", e);
        setErr("Couldn’t fetch tracks.");
        setLoading(false);
      }
    );
    return () => typeof unsub === "function" && unsub();
  }, []);

  if (err) {
    return <div className="tracks-fallback">{err}</div>;
  }

  return (
    <div className="tracks-scroll">
      <div className="tracks-grid">
        {loading && (
          <div className="tracks-skel">
            <div className="shimmer" />
            <div className="shimmer" />
            <div className="shimmer" />
          </div>
        )}

        {!loading && tracks.length === 0 && (
          <div className="tracks-empty">
            Add your first song to <code>db/mixtape/tracks</code>.
          </div>
        )}

        {tracks.map((t, i) => (
          <a
            key={`${t.title}-${i}`}
            className="track-card"
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.vibe || ""} ${t.title}${t.by ? " — " + t.by : ""} on Spotify`}
          >
            <span className="spark-ring" aria-hidden />
            <span className="bullet" aria-hidden>
              {/* minimal Spotify-ish glyph */}
              <svg viewBox="0 0 24 24" className="spot-glyph">
                <circle cx="12" cy="12" r="10" />
                <path d="M6.5 10.3c4.1-1.2 7.9-.9 11.1.7" />
                <path d="M7.4 13.1c3.5-1 6.7-.7 9.4.6" />
                <path d="M8.5 15.6c2.6-.7 5-.5 7.1.4" />
              </svg>
            </span>
            <div className="track-copy">
              {t.vibe ? <strong>{t.vibe}</strong> : <strong>—</strong>}
              <div className="title-line">
                <small>“{t.title}”{t.by ? ` — ${t.by}` : ""}</small>
              </div>
            </div>
            <span className="go-chip">Play on Spotify ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
