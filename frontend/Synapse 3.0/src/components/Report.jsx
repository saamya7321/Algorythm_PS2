import React, { useContext } from 'react';
import { AppContext } from '../App';

const CAT_COLORS = { Plastic:'#3b82f6', Paper:'#f59e0b', Metal:'#94a3b8', Glass:'#10b981', Organic:'#84cc16', Unclassified:'#8b5cf6' };
const CAT_ICONS  = { Plastic:'🧴', Paper:'📄', Metal:'🥫', Glass:'🍶', Organic:'🌿', Unclassified:'❓' };

export default function Report() {
  const { scans, todayScans, totalCarbon } = useContext(AppContext);

  const todayCats = todayScans.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});
  const todayCarbon = todayScans.reduce((s, x) => s + (x.carbonTotal || 0), 0);

  // Last 7 days summary
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = scans.filter(s => new Date(s.ts).toDateString() === d.toDateString());
    const cats = ds.reduce((a, s) => { a[s.category] = (a[s.category]||0)+1; return a; }, {});
    return {
      date: d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      total: ds.length,
      carbon: ds.reduce((s, x) => s + (x.carbonTotal || 0), 0),
      cats,
      isToday: d.toDateString() === new Date().toDateString(),
    };
  });

  return (
    <div className="page report-page">
      <h2 className="page-title">Daily Report</h2>

      {/* Today card */}
      <div className="today-card">
        <div className="today-header">
          <span className="today-badge">TODAY</span>
          <span className="today-date">{new Date().toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' })}</span>
        </div>

        {todayScans.length === 0 ? (
          <p className="today-empty">No scans yet today. Start scanning!</p>
        ) : (
          <>
            <div className="today-stats">
              <div className="today-stat">
                <p className="today-stat-val">{todayScans.length}</p>
                <p className="today-stat-label">Total Items</p>
              </div>
              <div className="today-stat">
                <p className="today-stat-val green">{todayCarbon}g</p>
                <p className="today-stat-label">CO₂ Saved</p>
              </div>
            </div>

            <div className="today-breakdown">
              {Object.entries(todayCats).map(([cat, count]) => (
                <div className="today-row" key={cat}>
                  <span className="today-icon">{CAT_ICONS[cat]}</span>
                  <span className="today-cat">{cat}</span>
                  <div className="today-pips">
                    {Array.from({ length: count }).map((_, i) => (
                      <span
                        key={i}
                        className="pip"
                        style={{ background: CAT_COLORS[cat] }}
                      />
                    ))}
                  </div>
                  <span className="today-count">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 7-day history */}
      <div className="section-card">
        <h3 className="section-title">Last 7 Days</h3>
        {weekly.map((day, i) => (
          <div className={`weekly-row ${day.isToday ? 'today-row-hl' : ''}`} key={i}>
            <div className="wr-left">
              <span className="wr-date">{day.date}</span>
              {day.isToday && <span className="wr-today-tag">today</span>}
            </div>
            <div className="wr-cats">
              {Object.entries(day.cats).map(([cat]) => (
                <span key={cat} className="wr-dot" style={{ background: CAT_COLORS[cat] }} title={cat} />
              ))}
            </div>
            <span className="wr-count">{day.total} items</span>
            <span className="wr-carbon green">{day.carbon}g</span>
          </div>
        ))}
      </div>

      {/* All-time summary */}
      <div className="section-card alltime-card">
        <h3 className="section-title">All Time</h3>
        <div className="alltime-grid">
          <div className="alltime-stat">
            <p className="alltime-val">{scans.length}</p>
            <p className="alltime-label">Items recycled</p>
          </div>
          <div className="alltime-stat">
            <p className="alltime-val green">{totalCarbon}g</p>
            <p className="alltime-label">CO₂ saved</p>
          </div>
          <div className="alltime-stat">
            <p className="alltime-val">
              {scans.length > 0
                ? Math.round(totalCarbon / scans.length)
                : 0}g
            </p>
            <p className="alltime-label">Avg per item</p>
          </div>
        </div>
      </div>

      <div className="dash-spacer" />
    </div>
  );
}
