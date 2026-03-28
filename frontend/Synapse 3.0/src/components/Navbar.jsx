import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, BarChart3, FileText } from 'lucide-react';
import { AppContext } from '../App';

export default function Navbar() {
  const { pathname } = useLocation();
  const { totalItems } = useContext(AppContext);
  const active = (p) => pathname === p ? 'nav-item active' : 'nav-item';

  return (
    <nav className="bottom-nav">
      <Link to="/dashboard" className={active('/dashboard')}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/report" className={active('/report')}>
        <FileText size={20} />
        <span>Report</span>
      </Link>
      <Link to="/scan" className="nav-item-center">
        <div className="scan-fab">
          <Camera size={28} color="#0d1117" />
          {totalItems > 0 && <span className="fab-badge">{totalItems}</span>}
        </div>
      </Link>
      <Link to="/impact" className={active('/impact')}>
        <BarChart3 size={20} />
        <span>Impact</span>
      </Link>
      <Link to="/dashboard" className="nav-item" style={{ opacity: 0, pointerEvents: 'none' }}>
        {/* spacer */}
        <Home size={20} />
        <span>‎</span>
      </Link>
    </nav>
  );
}
