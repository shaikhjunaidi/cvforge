import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { FileText, LayoutTemplate, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="navbar">
      <div className="container flex-between">
        <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(74, 85, 162, 0.4)' }}>
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--primary)', fontSize: '1.5rem' }}>CVForge</span>
        </Link>
        <nav className="navbar-links">
          <Link to="/" className={isActive('/')}>
             Home
          </Link>
          <Link to="/templates" className={isActive('/templates')}>
             Templates
          </Link>
          <Link to="/create" className={`btn btn-primary ${isActive('/create')}`}>
             Create CV
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
