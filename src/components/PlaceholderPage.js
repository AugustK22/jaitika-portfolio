// src/components/PlaceholderPage.js
import React from 'react';

const PlaceholderPage = ({ pageName, kicker }) => (
    <div style={{ textAlign: 'center', padding: '100px 40px', animation: 'fadeIn 1s ease-out' }}>
        <p style={{ fontFamily: "'Sacramento', cursive", fontSize: '1.8rem', color: '#81c6d9', marginBottom: '1rem' }}>{kicker}</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#2d2d2d' }}>{pageName}</h1>
        <p style={{ marginTop: '1.5rem', color: '#5a5a5a', lineHeight: '1.8' }}>This is a placeholder for the <strong>{pageName}</strong> page content.</p>
    </div>
);

export default PlaceholderPage;