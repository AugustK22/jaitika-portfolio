// src/components/FairyLights.js
import React from 'react';

const FairyLights = () => {
    const lights = Array.from({ length: 40 }).map((_, i) => (
        <div
            key={i}
            className="light"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--duration': `${2 + Math.random() * 3}s`,
                '--delay': `${Math.random() * 3}s`,
            }}
        />
    ));
    return <div className="fairy-lights">{lights}</div>;
};

export default FairyLights;