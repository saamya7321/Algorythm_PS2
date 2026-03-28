import React, { useContext } from 'react';
import { AppContext, getLevel } from '../App';
import EcoLevel from '../components/EcoLevel';
import ImpactVisual from '../components/ImpactVisual';
import { Leaf, Zap, BarChart3, ChevronRight } from 'lucide-react';

const CAT_COLORS = { Plastic:'#3b82f6', Paper:'#f59e0b', Metal:'#94a3b8', Glass:'#10b981', Organic:'#84cc16', Unclassified:'#8b5cf6' };

export default function Dashboard() {
  const { scans, totalCarbon, totalItems, todayScans, ECO_LEVELS } = useContext(AppContext);
  const { level, next, idx } = getLevel(totalItems, totalCarbon);

  const catCounts = scans.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});
  const topCat = Object.entries(catCounts).sort((a,b) => b[1]-a[1])[0];

  const stats = [
    { label: 'Carbon Saved',  value: `${totalCarbon}g`, icon: <Leaf size={18} color="#3fb950" /> },
    { label: 'Items Sorted',  value: totalItems,         icon: <Zap  size={18} color="#f59e0b" /> },
    { label: 'Today',         value: todayScans.length,  icon: <BarChart3 size={18} color="#3b82f6" /> },
  ];

  return (
    <div className="page dashboard-page">
      <header className="dash-header">
        <div>
          <p className="dash-greet">Good work,</p>
          <h2 className="dash-title">Eco Dashboard</h2>
        </div>
        <div className="dash-level-badge" title={level.name}>
          <span>{level.icon}</span>
          <span className="dlb-name">{level.name}</span>
        </div>
      </header>

      {/* Eco Level Card */}
      <EcoLevel
        level={level} next={next} idx={idx}
        totalItems={totalItems} totalCarbon={totalCarbon}
      />

      {/* Stats row */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            {s.icon}
            <p className="stat-val">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Impact equivalencies */}
      {totalCarbon > 0 && <ImpactVisual carbonGrams={totalCarbon} />}

      {/* Category breakdown */}
      {Object.keys(catCounts).length > 0 && (
        <div className="section-card">
          <h3 className="section-title">Material Breakdown</h3>
          {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat, count]) => {
            const pct = Math.round((count / totalItems) * 100);
            return (
              <div className="cat-bar-row" key={cat}>
                <span className="cat-bar-name">{cat}</span>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{ width: `${pct}%`, background: CAT_COLORS[cat] || '#8b5cf6' }}
                  />
                </div>
                <span className="cat-bar-pct">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent scans */}
      {scans.length > 0 && (
        <div className="section-card">
          <h3 className="section-title">Recent Scans</h3>
          {scans.slice(0, 5).map((s, i) => (
            <div className="recent-row" key={i}>
              <div
                className="recent-dot"
                style={{ background: CAT_COLORS[s.category] || '#8b5cf6' }}
              />
              <div className="recent-info">
                <span className="recent-cat">{s.category}</span>
                <span className="recent-time">
                  {new Date(s.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className="recent-carbon">+{s.carbonTotal}g</span>
              <ChevronRight size={14} color="#4b5563" />
            </div>
          ))}
        </div>
      )}

      {scans.length === 0 && (
        <div className="empty-dash">
          <p className="empty-icon">◎</p>
          <p>Scan your first item to get started!</p>
        </div>
      )}

      <div className="dash-spacer" />
    </div>
  );
}
