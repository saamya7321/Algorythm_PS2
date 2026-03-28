import React from 'react';

const LEVEL_COLORS = {
  'Beginner':  { bg: '#14532d', accent: '#4ade80', text: '#bbf7d0' },
  'Recycler':  { bg: '#1e3a5f', accent: '#60a5fa', text: '#bfdbfe' },
  'Eco Hero':  { bg: '#3b1f6b', accent: '#a78bfa', text: '#ede9fe' },
  'Guardian':  { bg: '#7c2d12', accent: '#fb923c', text: '#ffedd5' },
};

export default function EcoLevel({ level, next, idx, totalItems, totalCarbon, showProgress = true }) {
  const colors = LEVEL_COLORS[level.name] || LEVEL_COLORS['Beginner'];
  const progress = next
    ? Math.min(100, Math.round(
        ((totalItems - level.minItems) / (next.minItems - level.minItems)) * 100
      ))
    : 100;

  return (
    <div className="eco-level-card" style={{ background: colors.bg, borderColor: colors.accent + '44' }}>
      <div className="level-left">
        <span className="level-icon">{level.icon}</span>
        <div>
          <p className="level-name" style={{ color: colors.accent }}>{level.name}</p>
          <p className="level-sub" style={{ color: colors.text }}>Level {idx + 1}</p>
        </div>
      </div>
      {showProgress && next && (
        <div className="level-right">
          <p className="level-next" style={{ color: colors.text }}>
            Next: {next.icon} {next.name}
          </p>
          <div className="level-bar-bg">
            <div
              className="level-bar-fill"
              style={{ width: `${progress}%`, background: colors.accent }}
            />
          </div>
          <p className="level-progress-text" style={{ color: colors.text }}>
            {next.minItems - totalItems} items to go
          </p>
        </div>
      )}
      {!next && (
        <div className="level-right">
          <p className="level-max" style={{ color: colors.accent }}>Max level reached! 🏆</p>
        </div>
      )}
    </div>
  );
}
