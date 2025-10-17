// src/loading.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const LoadingCtx = createContext(null);

export function LoadingProvider({ children, timeoutMs = 10000 }) {
  const pendingRef = useRef(new Set());
  const [doneCount, setDoneCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Register a task factory; increments total and tracks finish.
  const register = useCallback((promiseFactory) => {
    setTotal((t) => t + 1);
    const p = Promise.resolve()
      .then(() => promiseFactory())
      .catch(() => {}) // never deadlock on failure
      .finally(() => {
        pendingRef.current.delete(p);
        setDoneCount((c) => c + 1);
      });
    pendingRef.current.add(p);
    return p;
  }, []);

  // Built-in tasks: fonts + any images present at the moment.
  useEffect(() => {
    const fontTask = () => (document.fonts?.ready ?? Promise.resolve());
    const imgTask = () => {
      const imgs = Array.from(document.images || []);
      return Promise.all(
        imgs.map((img) =>
          (img.decode ? img.decode() : Promise.resolve()).catch(() => {})
        )
      );
    };

    register(fontTask);
    register(imgTask);

    const timeout = setTimeout(() => setIsReady(true), timeoutMs);
    return () => clearTimeout(timeout);
  }, [register, timeoutMs]);

  // Flip ready only when everything registered so far is done.
  useEffect(() => {
    if (total > 0 && doneCount >= total) setIsReady(true);
  }, [doneCount, total]);

  const value = useMemo(
    () => ({ isReady, doneCount, total, register }),
    [isReady, doneCount, total, register]
  );

  return <LoadingCtx.Provider value={value}>{children}</LoadingCtx.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingCtx);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}
