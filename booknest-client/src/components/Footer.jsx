import { Link } from 'react-router-dom';
import { FiBookOpen, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span className="logo-badge" style={{ width: 32, height: 32, fontSize: '1rem' }}><FiBookOpen /></span>
            <b style={{ color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>BookNest</b>
          </Link>
          <p style={{ maxWidth: 360, margin: '6px 0 0', fontSize: '0.94rem', color: '#8CABA4', lineHeight: 1.6 }}>
            Your personal digital sanctuary for discovery, reading, and collecting unforgettable stories on every screen.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <Link to="/books">Browse Collection</Link>
          <Link to="/about">About Sanctuary</Link>
          <Link to="/contact">Reader Support</Link>
        </div>

        <div style={{ fontSize: '0.86rem', color: '#6A8780' }}>
          © {new Date().getFullYear()} BookNest Library. Built with care for readers worldwide.
        </div>
      </div>
    </footer>
  );
}
