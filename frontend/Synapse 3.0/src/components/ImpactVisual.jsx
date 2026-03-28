import React from 'react';

const EQUIVALENCIES = [
  { icon: '🌳', threshold: 50,   label: (g) => `Planting ${(g/50).toFixed(1)} seedlings` },
  { icon: '🚗', threshold: 1,    label: (g) => `Saving ${(g/250).toFixed(2)} km of car emissions` },
  { icon: '💡', threshold: 10,   label: (g) => `Powering a bulb for ${Math.round(g/10)} minutes` },
  { icon: '🚿', threshold: 20,   label: (g) => `${(g/30).toFixed(1)} fewer minutes of hot shower` },
  { icon: '📱', threshold: 5,    label: (g) => `${Math.round(g/5)} phone charges avoided` },
];

export default function ImpactVisual({ carbonGrams, compact = false }) {
  if (!carbonGrams || carbonGrams <= 0) return null;

  const relevant = EQUIVALENCIES.filter(e => carbonGrams >= e.threshold).slice(0, compact ? 2 : 3);

  return (
    <div className={`impact-visual ${compact ? 'compact' : ''}`}>
      {!compact && <p className="impact-title">Your real-world impact</p>}
      <div className="impact-grid">
        {relevant.map((e, i) => (
          <div className="impact-chip" key={i}>
            <span className="impact-eq-icon">{e.icon}</span>
            <span className="impact-eq-text">{e.label(carbonGrams)}</span>
          </div>
        ))}
        <div className="impact-chip highlight">
          <span className="impact-eq-icon">♻️</span>
          <span className="impact-eq-text">{carbonGrams}g CO₂ saved</span>
        </div>
      </div>
    </div>
  );
}
