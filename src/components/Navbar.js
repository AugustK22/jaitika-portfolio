// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isDarkMode, onToggleTheme }) => {
    const links = [
        { path: '/', label: 'Home' },
        { path: '/blueprint', label: 'The Blueprint' },
        { path: '/journal', label: 'Late Night Thoughts' },
        { path: '/sphere', label: 'The Sphere' },
        { path: '/mixtape', label: 'The Mixtape' },
    ];
    // <style>
    //     nav{
    //         width: 75%;
    //         margin : 0 auto;
    //     }
    // </style>
    
    return (
        <nav style={{width: '85%', margin: '0 auto'}}>
            <NavLink to="/" className="logo">JS</NavLink>
            <div className="nav-right">
                <ul className="nav-links">
                    {links.map(link => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => isActive ? 'active' : ''}
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
                    aria-label={`Activate ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                    {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
