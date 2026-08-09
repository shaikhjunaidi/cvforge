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
        <Link to="/" className="navbar-logo">
          CVForge
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
