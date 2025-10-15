import React from 'react';
import { useLoading } from './loading';

export default function Preloader() {
  const { isReady, doneCount, total } = useLoading();
  const [exiting, setExiting] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const reduceMotion = React.useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Determinate progress tied to real tasks
  const pct = total > 0 ? Math.min(100, Math.round((doneCount / total) * 100)) : 100;

  // When ready, run exit animation then unmount visually
  React.useEffect(() => {
    if (!isReady) return;
    if (reduceMotion) {
      // No fancy motion; quick fade and hide
      setExiting(true);
      const t = setTimeout(() => setHidden(true), 300);
      return () => clearTimeout(t);
    }
    setExiting(true);
    const t = setTimeout(() => setHidden(true), 1200); // keep in sync with keyframes timing
    return () => clearTimeout(t);
  }, [isReady, reduceMotion]);

  if (hidden) return null;

  return (
    <div
      className={`loader-root ${exiting ? 'exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      <div className="loader-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <div className="loader-content">
        <div className="brand-mark" aria-hidden="true">
          {/* Use your initials/wordmark — change text if you like */}
          JSR
        </div>

        <div className="spinner" aria-hidden="true" />

        <div className="bar-wrap" aria-hidden="true">
          <div className="bar" style={{ width: `${pct}%` }} />
        </div>

        <div className="hint">
          Loading {pct}% · fonts · images · data
        </div>
      </div>
    </div>
  );
}
