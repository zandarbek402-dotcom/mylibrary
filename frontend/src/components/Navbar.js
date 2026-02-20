import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          ConMat Transport
        </Link>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            🏠 Басты бет
          </Link>
          <Link to="/materials" onClick={() => setMobileMenuOpen(false)}>
            📦 Материалдар
          </Link>
          <Link to="/transport" onClick={() => setMobileMenuOpen(false)}>
            🚛 Тасымал маршруттары
          </Link>
          {isAdmin && (
            <Link to="/materials/new" onClick={() => setMobileMenuOpen(false)}>
              ➕ Материал қосу
            </Link>
          )}
          {isAdmin && (
            <Link to="/transport/new" onClick={() => setMobileMenuOpen(false)}>
              ➕ Маршрут қосу
            </Link>
          )}
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
            👤 Профиль
          </Link>
          <span className="user-info">
            👋 {user.username}
            {isAdmin && <span className="badge badge-success" style={{marginLeft: '8px', fontSize: '10px'}}>Admin</span>}
          </span>
          <button onClick={handleLogout}>
            🚪 Шығу
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

