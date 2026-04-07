import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const { admin, logout, resultsPublished, quizState, members } = useApp();
  const { toast }    = useToast();
  const navigate     = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = members.filter(m => m.status === 'pending').length;

  const handleLogout = () => {
    logout();
    navigate('/');
    toast('Logged out successfully', 'info');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/',         label: 'मुख्य पृष्ठ'                                    },
    { to: '/gallery',  label: 'गैलरी'                                           },
    { to: '/members',  label: 'सदस्य'                                           },
    { to: '/quiz',     label: quizState === 'active' ? 'क्विज़ 🟢' : 'क्विज़'  },
    { to: '/donation', label: '💛 दान'                                           },
    ...(resultsPublished ? [{ to: '/results', label: 'परिणाम 🏆' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo">🚩</span>
          <div>
            <div className="navbar__title">बजरंग दल एकसर</div>
            <div className="navbar__subtitle">JAI SHRI RAM</div>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div className="navbar__links">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
          {admin ? (
            <>
              <NavLink to="/admin"
                className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                ⚙️ Admin
                {pendingCount > 0 && (
                  <span className="navbar__badge">{pendingCount}</span>
                )}
              </NavLink>
              <button className="navbar__link navbar__link--logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="navbar__link navbar__link--admin">Admin Login</NavLink>
          )}
        </div>

        {/* Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {admin ? (
            <>
              <NavLink to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                ⚙️ Admin {pendingCount > 0 && `(${pendingCount} pending)`}
              </NavLink>
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="navbar__mobile-link navbar__mobile-admin" onClick={() => setMenuOpen(false)}>
              Admin Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
