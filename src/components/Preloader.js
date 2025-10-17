// src/Preloader.js
import React, { useEffect, useState } from 'react';
import { useLoading } from './loading';

export default function Preloader() {
  const { isReady, doneCount, total } = useLoading();

  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [displayedPct, setDisplayedPct] = useState(0);

  const basePct = total ? Math.min(100, Math.round((doneCount / total) * 100)) : 15;
  const targetPct = isReady ? 100 : Math.min(97, basePct);

  // Smoothly animate progress towards the latest target percentage.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedPct(prev => {
        const diff = targetPct - prev;
        if (Math.abs(diff) <= 0.4) {
          clearInterval(intervalId);
          return targetPct;
        }
        return prev + diff * 0.35;
      });
    }, 32);

    return () => clearInterval(intervalId);
  }, [targetPct]);

  // Play exit animation, then unmount as soon as data is ready.
  useEffect(() => {
    if (isReady && displayedPct >= 99.2 && !leaving) {
      setLeaving(true);
    }
  }, [isReady, displayedPct, leaving]);

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(() => setGone(true), 480); // keep in sync with .overlay transition
      return () => clearTimeout(t);
    }
  }, [leaving]);

  if (gone) return null;

  const pct = Math.min(100, Math.max(0, displayedPct));

  return (
    <div className={`overlay ${leaving ? 'overlay--leaving' : ''}`} aria-hidden={isReady}>
      {/* Inline CSS for easy drop-in */}
      <style>{`
        :root {
          --bg: #07070a;
          --fg: #fafafa;
          --muted: rgba(255,255,255,.12);
          --accent: #8ec5ff;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background:
            radial-gradient(1200px 600px at 50% 120%, rgba(142,197,255,.07), transparent 60%),
            radial-gradient(800px 400px at 0% 0%, rgba(255,149,241,.07), transparent 60%),
            var(--bg);
          color: var(--fg);
          display: grid;
          place-items: center;
          overflow: hidden;
          transition: opacity 480ms ease, filter 480ms ease;
        }
        .overlay--leaving {
          opacity: 0;
          filter: blur(1px);
          pointer-events: none;
        }

        /* Aurora sweep */
        .aurora {
          position: absolute;
          inset: -20%;
          background: conic-gradient(from 180deg at 50% 50%,
            rgba(142,197,255,.12),
            rgba(255,149,241,.12),
            rgba(180,255,215,.12),
            rgba(142,197,255,.12));
          mix-blend-mode: screen;
          filter: blur(60px) saturate(120%);
          animation: spin 28s linear infinite;
        }

        /* Floating stars */
        .stars { position: absolute; inset: 0; pointer-events: none; }
        .star {
          position: absolute;
          width: 2px; height: 2px; border-radius: 50%;
          background: rgba(255,255,255,.85);
          opacity: .9;
          animation: float var(--dur) linear infinite;
          transform: translate3d(0,0,0);
        }
        .star:nth-child(3n) { width: 3px; height: 3px; opacity: .7; }
        .star:nth-child(5n) { width: 1px; height: 1px; opacity: .6; }

        /* Card */
        .card {
          position: relative;
          width: clamp(260px, 52vw, 420px);
          padding: 28px 24px 22px;
          background: rgba(255,255,255,.03);
          border: 1px solid var(--muted);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04);
          backdrop-filter: blur(6px);
        }

        .title {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji";
          font-weight: 600;
          letter-spacing: 0.2px;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
        }
        .blink {
          display: inline-grid;
          grid-auto-flow: column;
          gap: 2px;
          transform: translateY(-1px);
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor;
          opacity: .4;
          animation: blink 1.1s ease-in-out infinite;
        }
        .dot:nth-child(2){ animation-delay: .15s }
        .dot:nth-child(3){ animation-delay: .3s }

        .bar {
          width: 100%;
          height: 8px;
          background: var(--muted);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .barFill {
          height: 100%;
          width: ${pct}%;
          border-radius: 999px;
          background:
            linear-gradient(90deg, rgba(255,255,255,.9), rgba(255,255,255,.75)),
            repeating-linear-gradient(100deg, rgba(255,255,255,.25) 0 6px, rgba(255,255,255,.35) 6px 12px);
          transform: translateZ(0);
          transition: width 180ms linear;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 12px;
          opacity: .75;
          letter-spacing: .3px;
          font-variant-numeric: tabular-nums;
        }

        /* Reduced motion: chill the party */
        @media (prefers-reduced-motion: reduce) {
          .aurora, .star { animation: none !important; }
          .overlay, .barFill { transition: none !important; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes blink {
          0%, 100% { opacity: .35; transform: translateY(0) scale(.9); }
          50% { opacity: 1; transform: translateY(-1px) scale(1); }
        }

        @keyframes float {
          0%   { transform: translateY(110vh); }
          100% { transform: translateY(-10vh); }
        }
      `}</style>

      {/* Background glows & stars */}
      <div className="aurora" aria-hidden />

      <div className="stars" aria-hidden>
        {Array.from({ length: 32 }).map((_, i) => {
          // randomize positions + durations deterministically-ish
          const left = Math.floor(((i * 127.3) % 100)) + '%';
          const delay = ((i * 73) % 120) / 10;      // 0..12s
          const dur = 10 + ((i * 37) % 80) / 5;     // 10..26s
          return (
            <span
              key={i}
              className="star"
              style={{
                left,
                bottom: '-5vh',
                animationDelay: `${delay}s`,
                ['--dur']: `${dur}s`,
              }}
            />
          );
        })}
      </div>

      {/* Card content */}
      <div className="card" role="status" aria-live="polite">
        <div className="title">
          Loading
          <span className="blink" aria-hidden>
            <span className="dot" /><span className="dot" /><span className="dot" />
          </span>
        </div>

        <div className="bar" aria-hidden>
          <div className="barFill" />
        </div>

        <div className="meta">
          <span>{doneCount}/{Math.max(1,total)} tasks</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
