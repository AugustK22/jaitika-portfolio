// src/components/Navbar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import './navbar.css';
const Navbar = ({ isDarkMode, onToggleTheme }) => {
  const links = [
    { path: '/', label: 'Home' },
    { path: '/blueprint', label: 'The Blueprint' },
    { path: '/journal', label: 'Late Night Thoughts' },
    { path: '/sphere', label: 'The Sphere' },
    { path: '/mixtape', label: 'The Mixtape' },
  ];

  const [collapsed, setCollapsed] = useState(true);
  const navId = 'primaryNav';

  return (
    <nav
      className="navbar navbar-expand-lg custom-navbar"
      data-bs-theme={isDarkMode ? 'dark' : 'light'}
      style={{ width: '85%', margin: '0 auto' }}
    >
      {/* Logo */}
      <NavLink to="/" className="navbar-brand logoJSNavLink order-1">JS</NavLink>

      {/* Theme toggle + hamburger stay outside collapse */}
      <div className="navbar-tools d-flex align-items-center gap-2 ms-auto order-2 order-lg-3">
        <button
          type="button"
          className="theme-toggle-icon"
          onClick={onToggleTheme}
          aria-label={`Activate ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <Sun size={24} strokeWidth={1.5} />
          ) : (
            <Moon size={24} strokeWidth={1.5} />
          )}
        </button>

        <button
          className="navbar-toggler ms-1"
          type="button"
          aria-label="Toggle navigation"
          aria-controls={navId}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(v => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>
      </div>

      {/* Navigation Links */}
      <div
        id={navId}
        className={`collapse navbar-collapse order-4 order-lg-2${collapsed ? '' : ' show'}`}
      >
        <div className="nav-right ms-lg-auto">
          <ul className="navbar-nav nav-links mb-2 mb-lg-0">
            {links.map(link => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={() => setCollapsed(true)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
