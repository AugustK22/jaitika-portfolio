// src/pages/Links.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Linkedin,
  Instagram,
  Youtube,
  Link as LinkIcon,
  Sparkles,
  Moon,
  Camera,
} from 'lucide-react';
import { FaPinterest, FaSnapchatGhost } from 'react-icons/fa';

export default function Links({ theme = 'light', onToggleTheme }) {
  const initialName = 'Jaitika Singh Rathore';
  const initialTitle = 'Creator \u2022 Storyteller \u2022 Journal';
  const profilePic =
    'https://i.ibb.co/393Vrtt8/Whats-App-Image-2025-10-24-at-21-27-36-e24cf0ec.webp';

  const isDark = theme === 'dark';

  const [burst, setBurst] = useState(false);
  const burstRef = useRef(null);

  useEffect(() => {
    if (!burst) return undefined;
    const id = window.setTimeout(() => setBurst(false), 900);
    return () => window.clearTimeout(id);
  }, [burst]);

  const [imgError, setImgError] = useState(false);
  const avatarUrl = profilePic || '';
  const initials = useMemo(
    () =>
      (initialName || '')
        .split(' ')
        .map(part => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join(''),
    [initialName]
  );

  const ensureHref = href => {
    if (!href) return href;
    if (/^https?:\/\//i.test(href)) return href;
    return `https://${href}`;
  };

  const links = [
    {
      id: 'pinterest',
      label: 'Pinterest',
      href: ensureHref('https://pin.it/5YJojwU1h'),
      icon: FaPinterest,
    },
    {
      id: 'snapchat',
      label: 'Snapchat',
      href: ensureHref(
        'https://www.snapchat.com/add/jaitika_rat9397?share_id=1uul4zkV73s&locale=en-GB'
      ),
      icon: FaSnapchatGhost,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: ensureHref(
        'https://in.linkedin.com/in/jaitika-singh-rathore-918648318'
      ),
      icon: Linkedin,
    },
    {
      id: 'site',
      label: 'Personal Site',
      href: ensureHref('https://jaitika.me'),
      icon: LinkIcon,
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: ensureHref('https://www.youtube.com/@Jsjunkjournal'),
      icon: Youtube,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: ensureHref(
        'https://www.instagram.com/jaitikarathore?igsh=MXF6N21hYXI0ajA1Mg=='
      ),
      icon: Instagram,
    },
  ];

  const palette = useMemo(
    () => ({
      background: 'var(--gradient-background)',
      overlay: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.04))',
      glassBg: 'var(--journal-glass-bg, rgba(255,255,255,0.65))',
      glassBorder: '1px solid var(--journal-glass-border, rgba(255,255,255,0.35))',
      glassShadow: 'var(--journal-shadow-soft, 0 12px 32px rgba(0,0,0,0.12))',
      avatarBorder: 'var(--surface-border, rgba(129,198,217,0.25))',
      heroGradient: 'linear-gradient(90deg,var(--hero-gradient-start), var(--hero-gradient-end))',
      pinkGlow: 'var(--journal-pink-glow, rgba(244,177,194,0.25))',
      surfaceCard: 'var(--surface-card)',
      surfaceOverlay: 'var(--surface-overlay)',
      surfaceBorder: '1px solid var(--surface-border)',
      cardShadow: 'var(--card-shadow)',
      textPrimary: 'var(--text-primary)',
      textSubtle: 'var(--text-subtle)',
      textHeading: 'var(--text-heading)',
      textMuted: 'var(--journal-text-muted)',
      buttonBg: 'var(--button-background)',
      buttonShadow: 'var(--button-shadow)',
      accent: 'var(--journal-pink)',
    }),
    []
  );

  const renderHost = href => {
    try {
      return new URL(href).host.replace(/^www\./, '');
    } catch {
      return href;
    }
  };

  return (
    <div
      className="links-page position-relative d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: '100vh',
        background: palette.background,
        color: palette.textPrimary,
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ pointerEvents: 'none', background: palette.overlay }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="container position-relative"
      >
        <div className="d-flex justify-content-end mb-4">
          <RouterLink
            to="/"
            className="btn btn-sm rounded-pill fw-semibold text-decoration-none"
            style={{
              background: palette.buttonBg,
              color: palette.textPrimary,
              boxShadow: palette.buttonShadow,
              border: '1px solid transparent',
            }}
          >
            Go Home
          </RouterLink>
        </div>

        <div
          className="card border-0 rounded-4 shadow-lg bg-transparent position-relative overflow-hidden"
          style={{
            backdropFilter: 'blur(18px)',
            background: palette.glassBg,
            border: palette.glassBorder,
            boxShadow: palette.glassShadow,
          }}
        >
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 gap-sm-4">
              <div className="position-relative flex-shrink-0 mx-auto mx-sm-0">
                <div
                  className="rounded-circle overflow-hidden border"
                  style={{
                    width: '6rem',
                    height: '6rem',
                    borderColor: palette.avatarBorder,
                  }}
                >
                  {!imgError && avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="profile"
                      onError={() => setImgError(true)}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center fw-semibold fs-4 text-uppercase"
                      style={{
                        backgroundImage: palette.heroGradient,
                        color: '#ffffff',
                      }}
                    >
                      {initials || <Camera size={28} />}
                    </div>
                  )}
                </div>
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-circle opacity-75"
                  style={{
                    width: '6.75rem',
                    height: '6.75rem',
                    filter: 'blur(32px)',
                    background: palette.pinkGlow,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <div className="text-center text-sm-start flex-grow-1">
                <h2
                  className="h4 mb-2"
                  style={{ color: palette.textHeading, letterSpacing: '0.02em' }}
                >
                  {initialName}
                </h2>
                <p className="mb-0 small" style={{ color: palette.textMuted }}>
                  {initialTitle}
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 mt-3 mt-sm-0">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setBurst(true)}
                  type="button"
                  className="btn btn-sm rounded-3 border-0"
                  style={{
                    background: palette.buttonBg,
                    boxShadow: palette.buttonShadow,
                    color: palette.textHeading,
                  }}
                  aria-label="Celebrate"
                >
                  <Sparkles size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (typeof onToggleTheme === 'function') {
                      onToggleTheme();
                    }
                  }}
                  type="button"
                  className="btn btn-sm rounded-3 border-0"
                  style={{
                    background: palette.buttonBg,
                    boxShadow: palette.buttonShadow,
                    color: palette.textHeading,
                  }}
                  aria-pressed={isDark}
                  aria-label="Toggle dark mode"
                >
                  <Moon size={18} />
                </motion.button>
              </div>
            </div>

            <div className="mt-4 mt-md-5">
              <div className="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-md-3">
                {links.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      className="col"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * index, duration: 0.35 }}
                    >
                      <motion.a
                        whileHover={{ translateY: -6 }}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-100 d-flex align-items-center text-decoration-none rounded-4 px-3 py-3 px-md-4"
                        style={{
                          background: palette.surfaceCard,
                          border: palette.surfaceBorder,
                          boxShadow: palette.cardShadow,
                          color: palette.textPrimary,
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 me-3 flex-shrink-0"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            background: palette.surfaceOverlay,
                          }}
                        >
                          <Icon size={20} style={{ color: palette.textHeading }} />
                        </div>
                        <div className="flex-grow-1">
                          <div
                            className="fw-semibold small text-uppercase"
                            style={{ letterSpacing: '0.04em', color: palette.textPrimary }}
                          >
                            {item.label}
                          </div>
                          <div
                            className="text-muted small"
                            style={{ color: palette.textSubtle }}
                          >
                            {renderHost(item.href)}
                          </div>
                        </div>
                        <div
                          className="d-none d-md-flex align-items-center small ms-2"
                          style={{ color: palette.textSubtle }}
                          aria-hidden="true"
                        >
                          {'\u2197'}
                        </div>
                      </motion.a>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center"
            style={{ pointerEvents: 'none' }}
          >
            <div
              ref={burstRef}
              className="position-relative w-100"
              style={{ maxWidth: '720px', marginTop: '7rem' }}
            >
              {Array.from({ length: 14 }).map((_, idx) => (
                <motion.span
                  key={idx}
                  initial={{ y: 0, x: 0, opacity: 1 }}
                  animate={{
                    y: -120 - Math.random() * 80,
                    x: (Math.random() - 0.5) * 480,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="position-absolute top-0 start-50"
                  style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '999px',
                    background: palette.accent,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
