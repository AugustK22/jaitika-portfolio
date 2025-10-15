// Tracks.jsx
import React from "react";
import "./tracks.css";

const tracks = [
  {
    vibe: "For Conquering the World:",
    title: "Vienna",
    by: "Billy Joel",
    href: "https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7?si=c3a6e237601548b1",
  },
  {
    vibe: "For a Quiet, Rainy Day:",
    title: "Roslyn",
    by: "Bon Iver, St. Vincent",
    href: "https://open.spotify.com/track/56ToH3YiSMT51y1H2dygOX?si=81ffb236bc2143ec",
  },
  {
    vibe: "For Pure, Uncomplicated Happiness:",
    title: "The entire Taylor Swift discography",
    by: "You know who",
    href: "https://open.spotify.com/playlist/37i9dQZF1DX5KpP2LN299J?si=Ccoi6oBiS6-SRFEtCIRZ8g",
  },
];

export default function Tracks() {
  return (
    <div className="tracks-grid">
      {tracks.map((t, i) => (
        <a
          key={i}
          className="track-card"
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.vibe} ${t.title} ${t.by ? "— " + t.by : ""} on Spotify`}
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
            <strong>{t.vibe}</strong>
            <div className="title-line">
              <small>“{t.title}”{t.by ? ` — ${t.by}` : ""}</small>
            </div>
          </div>
          <span className="go-chip">Play on Spotify ↗</span>
        </a>
      ))}
    </div>
  );
}
