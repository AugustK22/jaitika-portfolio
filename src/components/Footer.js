// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          {/* <div className="footer-logo">JS</div> */}
          <p className="footer-tagline">
            slow down you crazy child, you're so ambitious for a juvenile
          </p>
        </div>

        <div className="footer-links">
          <h6 className="footer-heading">Explore</h6>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/journal">Journal</Link>
            </li>
            <li>
              <Link to="/mixtape">Mixtape</Link>
            </li>
            <li>
              <Link to="/blueprint">Blueprint</Link>
            </li>
            <li>
              <Link to="/links">Links Hub</Link>
            </li>
          </ul>
        </div>

        <div className="footer-actions">
          <h6 className="footer-heading">Stay In Touch</h6>
          <p className="footer-note">
            Living in the margins, one story at a time. Let&rsquo;s keep the
            dialogue going.
          </p>
          <a
            className="footer-button"
            href="mailto:jaitikarathore@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Say hello
          </a>
        </div>
      </div>

      <div className="footer-meta">
        <p className="footer-rights">
          &copy; {currentYear} Jaitika Singh Rathore. All rights reserved.
        </p>
        <p className="footer-credits">
          Crafted with care. Hosted on GitHub Pages.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
