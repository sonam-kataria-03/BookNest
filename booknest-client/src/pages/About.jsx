import { Link } from 'react-router-dom';
import { FiBookOpen, FiBookmark, FiFeather, FiShield, FiHeart } from 'react-icons/fi';

export default function About() {
  return (
    <div className="container section" style={{ maxWidth: 840 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="hero-pill" style={{ color: 'var(--forest-800)', borderColor: 'var(--forest-200)', background: 'var(--forest-50)' }}>
          ✦ Our Philosophy
        </span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', margin: '14px 0' }}>
          Crafted for the Love of Reading
        </h1>
        <p className="muted" style={{ fontSize: '1.15rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          BookNest is an open digital library sanctuary engineered to remove friction between curious minds and timeless books.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 40, padding: '44px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 14 }}>The Vision</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          In an era of noisy screens and fragmented attention, BookNest provides a quiet, elegant sanctuary. We believe that discovering literature, expanding knowledge, and losing oneself in an extraordinary narrative should be effortless, beautiful, and accessible to everyone without paywalls or invasive tracking.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
          Every feature—from our distraction-free browser reader to our personal bookshelf—is designed with aesthetic reverence for the written word.
        </p>
      </div>

      <div className="benefits" style={{ marginBottom: 48 }}>
        <div className="benefit-card">
          <div className="benefit-icon-box"><FiBookOpen /></div>
          <h3>Instant Reading</h3>
          <p>Read directly in your browser without downloading heavy files or third-party e-readers.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon-box"><FiBookmark /></div>
          <h3>Curate Your World</h3>
          <p>Build your shelf, mark favorite passages, and keep your literary journey organized.</p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon-box"><FiShield /></div>
          <h3>Librarian Curation</h3>
          <p>Carefully managed by administrators who verify metadata, categories, and readable formats.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Link to="/books" className="btn gold lg">
          Explore the Collection Today
        </Link>
      </div>
    </div>
  );
}
