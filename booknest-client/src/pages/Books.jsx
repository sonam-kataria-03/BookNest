import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import BookCard from '../components/BookCard';

export default function Books() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const [text, setText] = useState(search);
  const [books, setBooks] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/books', { params: { search, category } })
      .then((r) => setBooks(r.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const update = (next) => {
    const p = { search, category, ...next };
    Object.keys(p).forEach((k) => !p[k] && delete p[k]);
    setParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    update({ search: text });
  };

  const clearFilters = () => {
    setText('');
    setParams({});
  };

  return (
    <div className="container section">
      <div className="head-row">
        <div>
          <h1>Library Collection</h1>
          <p className="muted" style={{ margin: 0 }}>
            {loading ? 'Searching the catalog…' : `Showing ${books.length} title${books.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: 12,
          maxWidth: 620,
          marginBottom: 24,
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1.1rem'
            }}
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search titles, authors, or subjects…"
            aria-label="Search books"
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: 'var(--r-sm)',
              border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.96rem',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {text && (
            <button
              type="button"
              onClick={() => { setText(''); update({ search: '' }); }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4
              }}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>
        <button className="btn" type="submit">
          Search
        </button>
      </form>

      {/* Genre Filter Chips */}
      <div className="chips" style={{ marginBottom: 36 }}>
        <button
          className={`chip ${!category ? 'on' : ''}`}
          onClick={() => update({ category: '' })}
        >
          All Genres
        </button>
        {cats.map((c) => (
          <button
            key={c._id}
            className={`chip ${category === c._id ? 'on' : ''}`}
            onClick={() => update({ category: c._id })}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Book Grid or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>✦ Loading library titles…</p>
        </div>
      ) : books.length > 0 ? (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No books match your criteria</h3>
          <p className="muted">Try adjusting your keywords or selecting another category.</p>
          {(search || category) && (
            <button className="btn ghost" onClick={clearFilters} style={{ marginTop: 12 }}>
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
