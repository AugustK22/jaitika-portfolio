import React, { useCallback, useEffect, useRef, useState } from "react";
import { HeartHandshake, RefreshCcw } from "lucide-react";
import { fetchReflection } from "../services/reflectionService";

export default function ReflectionPanel({ entryId, entryContent }) {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const loadReflection = useCallback(async () => {
    if (!entryContent?.trim()) {
      setReflection("");
      setError("Add a few more thoughts above and I will meet you there.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextReflection = await fetchReflection(entryContent);
      if (!isMountedRef.current) {
        return;
      }
      setReflection(nextReflection);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }
      setError(err.message || "Your companion is quiet right now. Try again soon.");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [entryContent]);

  useEffect(() => {
    setReflection("");
    setError("");
    if (entryContent?.trim()) {
      loadReflection();
    } else {
      setError("Add a few more thoughts above and I will meet you there.");
    }
  }, [entryId, entryContent, loadReflection]);

  return (
    <div className="reflection-panel" aria-live="polite">
      <div className="reflection-panel__halo" aria-hidden />
      <div className="reflection-panel__content">
        <div className="reflection-panel__header">
          <div className="reflection-panel__title">
            <span className="reflection-panel__icon">
              <HeartHandshake size={18} />
            </span>
            <div className="reflection-panel__meta">
              <span className="reflection-panel__label">Journal Companion</span>
              <h3>Evening Reflection</h3>
            </div>
          </div>

          <button
            type="button"
            className="reflection-panel__reload"
            onClick={loadReflection}
            disabled={loading}
          >
            <RefreshCcw size={16} />
            <span>{loading ? "Listening..." : "Reload reflection"}</span>
          </button>
        </div>

        <div className="reflection-panel__body">
          {loading && !reflection && (
            <p className="reflection-panel__placeholder">
              Let me sit with your words just a moment longer...
            </p>
          )}

          {!loading && error && (
            <div className="reflection-panel__error">
              <p>{error}</p>
              <button type="button" onClick={loadReflection}>
                Try again
              </button>
            </div>
          )}

          {reflection && (
            <blockquote className="reflection-panel__quote">
              {reflection}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
