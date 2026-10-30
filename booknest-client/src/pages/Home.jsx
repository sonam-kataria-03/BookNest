import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiBookmark, FiSmartphone, FiArrowRight, FiStar, FiCompass } from 'react-icons/fi';
import api from '../services/api';
import BookCard from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.get('/books').then((r) => setBooks(r.data)).catch(() => {});
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
  }, []);

  const go = (e) => {
    e.preventDefault();
    nav(`/books?search=${encodeURIComponent(q)}`);
  };

  const featuredBook = books[0] || null;

  return (
    <>
      {/* Editorial Hero Showcase */}
      <section className="hero">
        <div className="container">
          <div>
            <div className="hero-pill">
              <FiStar /> Curated Digital Library
            </div>
            <h1>
              Where Stories Find Their <span className="gold-text">Nest</span>.
            </h1>
            <p>
              Discover an ever-growing collection of literature, fiction, and knowledge. Read seamlessly in your browser with zero paywalls.
            </p>
            <form className="hero-searchbar" onSubmit={go}>
              <FiSearch />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, author, or keyword…"
                aria-label="Search books"
              />
              <button className="btn gold" style={{ flexShrink: 0 }}>
                Explore
              </button>
            </form>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <b>{cats.length || '7+'}</b>
                <span>Genres</span>
              </div>
              <div className="hero-stat-item">
                <b>100%</b>
                <span>Open Access</span>
              </div>
              <div className="hero-stat-item">
                <b>Any Device</b>
                <span>Online Reader</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-book-stage">
              <div className="hero-floating-card">
                <div className="hero-card-header">
                  <span className="hero-card-tag">Editor's Spotlight</span>
                  <div style={{ display: 'flex', gap: 4, color: 'var(--gold-400)', fontSize: '0.85rem' }}>
                    <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
                  </div>
                </div>
                <div className="hero-book-mock">
                  <div className="hero-book-mini-cover">
                    <span>✦ BookNest</span>
                    <small style={{ color: 'var(--gold-200)', fontSize: '0.72rem' }}>Exclusive</small>
                  </div>
                  <div className="hero-book-meta">
                    <h3>{featuredBook ? featuredBook.title : 'The Quiet Harbour'}</h3>
                    <p>{featuredBook ? `by ${featuredBook.author}` : 'by Meera Kapoor'}</p>
                    <div className="hero-badge-pill">
                      {featuredBook?.status === 'Unavailable' ? (
                        <span style={{ color: 'var(--gold-200)', fontWeight: 600 }}>● Currently Unavailable</span>
                      ) : (
                        <><FiBookOpen /> Instant In-Browser Reader</>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
                  <Link
                    to={featuredBook ? `/books/${featuredBook._id}` : '/books'}
                    className="btn gold sm"
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    {featuredBook?.status === 'Unavailable' ? 'View Details' : 'Start Reading'} <FiArrowRight />
                  </Link>
                  <Link to="/books" className="btn ghost sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                    All Titles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="section container">
        <div className="head-row">
          <div>
            <h2>Featured Books</h2>
            <p className="muted" style={{ margin: 0 }}>Hand-picked titles waiting to be explored.</p>
          </div>
          <Link to="/books" className="btn ghost sm">
            View All Collection <FiArrowRight />
          </Link>
        </div>

        {books.length > 0 ? (
          <div className="grid">
            {books.slice(0, 4).map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Library Collection Is Being Curated</h3>
            <p className="muted">Log in as admin to add books to your shelves, or browse categories below.</p>
          </div>
        )}
      </section>

      {/* Genre Exploration */}
      {cats.length > 0 && (
        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="head-row">
            <div>
              <h2>Browse by Category</h2>
              <p className="muted" style={{ margin: 0 }}>Filter books by your favorite literary genre.</p>
            </div>
          </div>
          <div className="chips">
            {cats.map((c) => (
              <Link key={c._id} className="chip" to={`/books?category=${c._id}`}>
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* More Books if available */}
      {books.length > 4 && (
        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="head-row">
            <div>
              <h2>More Titles to Explore</h2>
              <p className="muted" style={{ margin: 0 }}>Continue expanding your horizons.</p>
            </div>
          </div>
          <div className="grid">
            {books.slice(4, 8).map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      )}

      {/* Reader Benefits */}
      <section className="section container">
        <div className="benefits">
          <div className="benefit-card">
            <div className="benefit-icon-box">
              <FiBookOpen />
            </div>
            <h3>Read in Your Browser</h3>
            <p>Open full PDFs directly inside our built-in reader. Zero downloads, zero installations required.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon-box">
              <FiBookmark />
            </div>
            <h3>Your Personal Shelf</h3>
            <p>Save titles to your personal shelf with one click so you can resume anytime from any device.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon-box">
              <FiSmartphone />
            </div>
            <h3>Fluid on Every Screen</h3>
            <p>Thoughtfully engineered typography and layout that feels natural on phones, tablets, and desktops.</p>
          </div>
        </div>
      </section>

      {/* Invitation CTA */}
      <div className="container" style={{ padding: '0 0 40px' }}>
        <section className="cta">
          <h2>Start Your Reading Journey</h2>
          <p>Join thousands of readers who enjoy open access to books, personal shelves, and instant reading.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn gold lg">
              Create Free Account
            </Link>
            <Link to="/books" className="btn ghost lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Explore Library First
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
