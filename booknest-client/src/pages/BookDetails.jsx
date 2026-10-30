import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiBookOpen, FiBookmark, FiArrowLeft, FiCalendar, FiUser, FiCheckCircle, FiLock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Cover } from '../components/BookCard';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [book, setBook] = useState(null);
  const [saved, setSaved] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.get(`/books/${id}`).then((r) => setBook(r.data)).catch(() => setMissing(true));
    if (user) {
      api.get('/saved').then((r) => setSaved(r.data.some((b) => b._id === id))).catch(() => {});
    }
  }, [id, user]);

  const needLogin = () => {
    toast.info('Please log in to read or save books.');
    nav('/login', { state: { from: `/books/${id}` } });
  };

  const toggle = async () => {
    if (!user) return needLogin();
    try {
      if (saved) {
        await api.delete(`/saved/${id}`);
        toast.success('Removed from My Books');
      } else {
        await api.post(`/saved/${id}`);
        toast.success('Saved to My Books');
      }
      setSaved(!saved);
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  if (missing) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1 style={{ fontSize: '2.4rem' }}>Book Not Found</h1>
        <p className="muted">The title you are looking for may have been moved or archived.</p>
        <Link to="/books" className="btn" style={{ marginTop: 16 }}>
          <FiArrowLeft /> Back to Collection
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p className="muted" style={{ fontSize: '1.2rem' }}>✦ Loading book details…</p>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Breadcrumb Trail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link to="/books" style={{ color: 'var(--text-secondary)' }}>Books</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{book.title}</span>
      </div>

      <div className="detail">
        <div>
          <Cover book={book} />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span className={`badge ${book.status === 'Available' ? 'on' : 'off'}`}>
              ● {book.status}
            </span>
          </div>
        </div>

        <div>
          <div className="detail-badge-group">
            {book.category?.name && <span className="tag">{book.category.name}</span>}
            {book.publishedYear && <span className="tag">{book.publishedYear}</span>}
            <span className="tag" style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', borderColor: 'var(--gold-200)' }}>
              Instant PDF Reader
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 12 }}>
            {book.title}
          </h1>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FiUser style={{ color: 'var(--forest-600)' }} /> <b>{book.author}</b>
            </span>
            {book.publishedYear && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FiCalendar style={{ color: 'var(--forest-600)' }} /> Published in {book.publishedYear}
              </span>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0', margin: '24px 0' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 10 }}>About this work</h3>
            <p style={{ maxWidth: '65ch', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
              {book.description || 'No summary has been provided for this title yet.'}
            </p>
          </div>

          <div className="actions">
            {book.status === 'Available' ? (
              user ? (
                <Link to={`/read/${book._id}`} className="btn gold lg">
                  <FiBookOpen /> Read Online Now
                </Link>
              ) : (
                <button className="btn gold lg" onClick={needLogin}>
                  <FiBookOpen /> Read Online Now
                </button>
              )
            ) : user?.role === 'admin' ? (
              <Link to={`/read/${book._id}`} className="btn ghost lg" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                <FiBookOpen /> Admin Preview (Unavailable)
              </Link>
            ) : (
              <button
                className="btn"
                disabled
                style={{
                  background: 'var(--card-subtle)',
                  color: 'var(--text-muted)',
                  border: '1.5px solid var(--border)',
                  cursor: 'not-allowed',
                  opacity: 0.75
                }}
              >
                <FiLock /> Currently Unavailable to Read
              </button>
            )}

            <button
              className={`btn ${saved ? 'ghost' : 'ghost'} lg`}
              onClick={toggle}
              style={saved ? { borderColor: 'var(--forest-600)', color: 'var(--forest-800)', background: 'var(--forest-50)' } : {}}
            >
              {saved ? (
                <>
                  <FiCheckCircle style={{ color: 'var(--ok)' }} /> Saved to My Books
                </>
              ) : (
                <>
                  <FiBookmark /> Save for Later
                </>
              )}
            </button>
          </div>

          {book.status === 'Unavailable' && user?.role !== 'admin' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'var(--danger-light)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--danger)',
              marginTop: 18,
              fontSize: '0.92rem',
              fontWeight: 600,
              border: '1px solid rgba(192, 57, 43, 0.2)'
            }}>
              <FiLock style={{ fontSize: '1.1rem', flexShrink: 0 }} />
              <span>This title is currently marked as unavailable. Readers cannot open or read it.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
