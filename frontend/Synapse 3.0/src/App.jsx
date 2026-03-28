import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Fixed paths to match your sidebar: src/components/
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Scan from './components/Scan';
import Impact from './components/Impact';
import Report from './components/Report';
import './App.css';

const ECO_LEVELS = [
  { name: 'Beginner',   icon: '🌱', minItems: 0,  minCarbon: 0   },
  { name: 'Recycler',   icon: '♻️', minItems: 10, minCarbon: 200 },
  { name: 'Eco Hero',   icon: '🌍', minItems: 25, minCarbon: 500 },
  { name: 'Guardian',   icon: '🛡️', minItems: 50, minCarbon: 1200},
];

export function getLevel(items, carbon) {
  let level = ECO_LEVELS[0];
  for (const l of ECO_LEVELS) {
    if (items >= l.minItems && carbon >= l.minCarbon) level = l;
  }
  const idx = ECO_LEVELS.indexOf(level);
  const next = ECO_LEVELS[idx + 1] || null;
  return { level, next, idx };
}

export const AppContext = React.createContext(null);

export default function App() {
  const [scans, setScans] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eco_scans') || '[]'); } catch { return []; }
  });
  const [feedback, setFeedback] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eco_feedback') || '[]'); } catch { return []; }
  });
  const [dualMode, setDualMode] = useState('fast'); 

  useEffect(() => {
    localStorage.setItem('eco_scans', JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    localStorage.setItem('eco_feedback', JSON.stringify(feedback));
  }, [feedback]);

  const addScan = (result) => {
    setScans(prev => [{ ...result, ts: Date.now() }, ...prev]);
  };

  const addFeedback = (entry) => {
    setFeedback(prev => [{ ...entry, ts: Date.now() }, ...prev]);
  };

  const totalCarbon = scans.reduce((s, x) => s + (x.carbonTotal || 0), 0);
  const totalItems  = scans.length;
  const todayScans  = scans.filter(s => {
    const d = new Date(s.ts);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <AppContext.Provider value={{ scans, addScan, totalCarbon, totalItems, todayScans, feedback, addFeedback, dualMode, setDualMode, ECO_LEVELS, getLevel }}>
      <BrowserRouter>
        <div className="app-root">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/report" element={<Report />} />
          </Routes>
          <Navbar />
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}