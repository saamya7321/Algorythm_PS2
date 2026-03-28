import React, { useState } from 'react';

const CATEGORIES = ['Plastic', 'Paper', 'Metal', 'Glass', 'Organic'];

export default function SmartBinFeedback({ aiCategory, confidence, onFeedback, onSkip }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selected) return;
    onFeedback({ aiCategory, userCategory: selected, confidence });
    setSubmitted(true);
    setTimeout(() => onSkip(), 1200);
  };

  if (submitted) {
    return (
      <div className="feedback-card success">
        <span className="feedback-thanks-icon">🧠</span>
        <p className="feedback-thanks">Thanks! AI is learning from you.</p>
      </div>
    );
  }

  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <span className="feedback-icon">🤔</span>
        <div>
          <p className="feedback-title">AI is unsure</p>
          <p className="feedback-sub">
            Confidence: <strong>{confidence}%</strong> — I think it's <em>{aiCategory}</em>. Help me learn!
          </p>
        </div>
      </div>

      <p className="feedback-question">What material is this?</p>
      <div className="feedback-options">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`feedback-opt ${selected === cat ? 'selected' : ''} ${cat === aiCategory ? 'ai-guess' : ''}`}
            onClick={() => setSelected(cat)}
          >
            {cat}
            {cat === aiCategory && <span className="ai-tag">AI guess</span>}
          </button>
        ))}
      </div>

      <div className="feedback-actions">
        <button className="feedback-skip" onClick={onSkip}>Skip</button>
        <button className="feedback-submit" onClick={submit} disabled={!selected}>
          Teach AI →
        </button>
      </div>
    </div>
  );
}
