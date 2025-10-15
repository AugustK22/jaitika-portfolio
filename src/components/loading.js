import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const LoadingCtx = createContext(null);

export function LoadingProvider({ children, timeoutMs = 10000 }) {
  const tasksRef = useRef([]);
  const [doneCount, setDoneCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const register = (promiseFactory) => {
    // promiseFactory must return a fresh promise when called
    tasksRef.current.push(promiseFactory);
  };

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Build the full task list: fonts + images + user tasks
      const fontTask = () => document.fonts?.ready ?? Promise.resolve();
      const imgTask = () => {
        const imgs = Array.from(document.images || []);
        const decodes = imgs.map((img) =>
          (img.decode ? img.decode() : Promise.resolve()).catch(() => {})
        );
        return Promise.all(decodes);
      };

      const factories = [fontTask, imgTask, ...tasksRef.current];

      if (factories.length === 0) {
        setIsReady(true);
        return;
      }

      let completed = 0;
      const inc = () => setDoneCount(++completed);

      // Wrap each task to bump progress
      const running = factories.map((f) =>
        Promise.resolve()
          .then(() => f())
          .then(inc)
          .catch(inc)
      );

      const all = Promise.allSettled(running);

      // Timeout guard
      const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs, 'timeout'));

      const result = await Promise.race([all, timeout]);
      if (!cancelled) setIsReady(true);
      return result;
    }

    run();
    return () => { cancelled = true; };
  }, [timeoutMs]);

  const value = useMemo(() => ({
    isReady,
    doneCount,
    total: 2 + tasksRef.current.length, // fonts + images + custom
    register,
  }), [isReady, doneCount]);

  return (
    <LoadingCtx.Provider value={value}>
      {children}
    </LoadingCtx.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingCtx);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}
