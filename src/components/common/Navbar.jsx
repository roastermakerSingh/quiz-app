import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const { admin, logout, resultsPublished, quizState } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast('Logged out successfully', 'info');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/',        label: 'मुख्य पृष्ठ' },
    { to: '/gallery', label: 'गैलरी' },
    { to: '/quiz',    label: quizState === 'active' ? 'क्विज़ 🟢' : 'क्विज़' },
    ...(resultsPublished ? [{ to: '/results', label: 'परिणाम 🏆' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <NavLink to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <span className="navbar__logo">🚩</span>
          <div>
            <div className="navbar__title">बजरंग दल एकसर</div>
            <div className="navbar__subtitle">JAI SHRI RAM</div>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div className="navbar__links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          {admin ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
              >
                ⚙️ Admin
              </NavLink>
              <button className="navbar__link navbar__link--logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="navbar__link navbar__link--admin">
              Admin Login
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-icon ${mobileOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="navbar__mobile">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {admin ? (
            <>
              <NavLink to="/admin" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>⚙️ Admin</NavLink>
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="navbar__mobile-link navbar__mobile-admin" onClick={() => setMobileOpen(false)}>
              Admin Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
