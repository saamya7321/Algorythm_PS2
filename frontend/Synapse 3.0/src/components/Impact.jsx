import React, { useContext } from 'react';
import { AppContext } from '../App';
import ImpactVisual from './ImpactVisual';
import { ShieldCheck, Info, PieChart } from 'lucide-react';

const CAT_COLORS = { Plastic:'#3b82f6', Paper:'#f59e0b', Metal:'#94a3b8', Glass:'#10b981', Organic:'#84cc16', Unclassified:'#8b5cf6' };

export default function Impact() {
  const { scans, totalCarbon, totalItems, feedback } = useContext(AppContext);

  const catCounts = scans.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  const materials = Object.entries(catCounts).map(([name, count]) => ({
    name, count,
    color: CAT_COLORS[name] || '#8b5cf6',
    percent: Math.round((count / Math.max(totalItems, 1)) * 100),
  }));

  // Weekly data (last 7 days)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayScans = scans.filter(s => new Date(s.ts).toDateString() === d.toDateString());
    return {
      label: d.toLocaleDateString([], { weekday: 'short' }),
      count: dayScans.length,
      carbon: dayScans.reduce((sum, s) => sum + (s.carbonTotal || 0), 0),
    };
  });
  const maxCount = Math.max(...weekDays.map(d => d.count), 1);

  const aiAccuracy = feedback.length > 0
    ? Math.round((feedback.filter(f => f.aiCategory === f.userCategory).length / feedback.length) * 100)
    : null;

  return (
    <div className="page impact-page">
      <h2 className="page-title">Sustainability Analysis</h2>

      {/* Big impact number */}
      <div className="impact-hero">
        <p className="impact-hero-num">{totalCarbon}g</p>
        <p className="impact-hero-sub">CO₂ saved total</p>
        <p className="impact-hero-items">{totalItems} items correctly recycled</p>
      </div>

      {/* Emotional equivalencies */}
      {totalCarbon > 0 && <ImpactVisual carbonGrams={totalCarbon} />}

      {/* Material distribution */}
      {materials.length > 0 && (
        <div className="section-card">
          <div className="section-row">
            <PieChart size={16} color="#3fb950" />
            <h3 className="section-title" style={{ marginBottom: 0 }}>Material Distribution</h3>
          </div>
          <div style={{ marginTop: 16 }}>
            {materials.map((m, i) => (
              <div className="cat-bar-row" key={i}>
                <span className="cat-bar-name" style={{ color: m.color }}>{m.name}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${m.percent}%`, background: m.color }} />
                </div>
                <span className="cat-bar-pct">{m.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly activity */}
      <div className="section-card">
        <h3 className="section-title">Weekly Activity</h3>
        <div className="week-chart">
          {weekDays.map((d, i) => (
            <div className="week-col" key={i}>
              <div className="week-bar-wrap">
                <div
                  className="week-bar"
                  style={{
                    height: `${(d.count / maxCount) * 100}%`,
                    background: d.count > 0 ? '#3fb950' : '#1f2937',
                  }}
                />
              </div>
              <span className="week-label">{d.label}</span>
              <span className="week-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Learning stats */}
      {feedback.length > 0 && (
        <div className="section-card">
          <h3 className="section-title">AI Learning Stats</h3>
          <div className="ai-stat-row">
            <div className="ai-stat">
              <p className="ai-stat-val">{feedback.length}</p>
              <p className="ai-stat-label">Corrections given</p>
            </div>
            {aiAccuracy !== null && (
              <div className="ai-stat">
                <p className="ai-stat-val">{aiAccuracy}%</p>
                <p className="ai-stat-label">AI accuracy</p>
              </div>
            )}
            <div className="ai-stat">
              <p className="ai-stat-val">🧠</p>
              <p className="ai-stat-label">Learning active</p>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain verification card */}
      <div className="section-card verify-card">
        <div className="verify-row">
          <ShieldCheck size={32} color="#3fb950" />
          <div>
            <h4 className="verify-title">Verified Activity</h4>
            <p className="verify-sub">Your recycling data is locally stored and tamper-proof.</p>
          </div>
        </div>
        <button className="verify-btn">
          <Info size={14} /> View Summary
        </button>
      </div>

      <p className="footer-note">Data from all your scanning sessions.</p>
      <div className="dash-spacer" />
    </div>
  );
}
