import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiMenu, FiX, FiBookmark, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const close = () => setOpen(false);
  const out = () => { logout(); close(); nav('/'); };

  return (
    <header className="nav">
      <div className="container">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-badge"><FiBookOpen /></span>
          <span>BookNest</span>
        </Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={close}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/books">Collection</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user ? (
            <>
              <NavLink to="/my-books" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FiBookmark style={{ fontSize: '0.95rem' }} /> My Shelf
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FiShield style={{ fontSize: '0.95rem', color: 'var(--gold-500)' }} /> Admin
                </NavLink>
              )}
              <NavLink to="/profile" className="nav-user-pill">
                {user.profileImage ? (
                  <img src={fileUrl(user.profileImage)} alt="" className="nav-avatar-mini" />
                ) : (
                  <span className="nav-avatar-mini">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                )}
                <span>{user.name.split(' ')[0]}</span>
              </NavLink>
              <button className="link" onClick={out} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <FiLogOut style={{ fontSize: '0.9rem' }} /> Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn gold sm" style={{ textDecoration: 'none' }}>
                Join Free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
