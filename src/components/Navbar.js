// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = ({ isDarkMode, onToggleTheme }) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/blueprint", label: "The Blueprint" },
    { path: "/journal", label: "Late Night Thoughts" },
    { path: "/sphere", label: "The Sphere" },
    { path: "/mixtape", label: "The Mixtape" },
  ];

  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav">
        <NavLink to="/" className="logo" aria-label="Go to Home">
          JS
        </NavLink>

        {/* Desktop links */}
        <div className="nav-right">
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Activate ${isDarkMode ? "light" : "dark"} mode`}
          >
            {isDarkMode ? "Light" : "Dark"} Mode
          </button>

          {/* Burger (mobile only via CSS) */}
          <button
            className={`burger ${open ? "is-open" : ""}`}
            aria-label="Menu"
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <button
        className={`nav-backdrop ${open ? "show" : ""}`}
        aria-hidden={open ? "false" : "true"}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        id="mobile-drawer"
        className={`nav-drawer ${open ? "open" : ""}`}
        aria-hidden={open ? "false" : "true"}
      >
        <div className="drawer-head">
          <span className="logo">JS</span>
          <button
            className="drawer-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="drawer-links" role="menu">
          {links.map((link) => (
            <li key={link.path} role="none">
              <NavLink to={link.path} role="menuitem">
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="drawer-theme"
          onClick={() => {
            onToggleTheme?.();
          }}
        >
          {isDarkMode ? "Switch to Light" : "Switch to Dark"}
        </button>
      </aside>
    </header>
  );
};

export default Navbar;
