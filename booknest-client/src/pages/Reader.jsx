import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiLock } from 'react-icons/fi';
import api, { fileUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Reader() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((r) => setBook(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isRestricted = book && book.status === 'Unavailable' && user?.role !== 'admin';

  return (
    <div className="reader">
      <div className="reader-bar">
        <Link to={`/books/${id}`} className="btn gold sm">
          <FiArrowLeft /> Return to Details
        </Link>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <b style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>
            {book?.title || (loading ? 'Loading title…' : 'Reader')}
          </b>
          {book?.author && (
            <span style={{ color: 'var(--gold-200)', fontSize: '0.85rem', marginLeft: 10 }}>
              by {book.author}
            </span>
          )}
          {book?.status === 'Unavailable' && user?.role === 'admin' && (
            <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginLeft: 12, fontWeight: 700, padding: '2px 8px', background: 'rgba(255,255,255,0.15)', borderRadius: 99 }}>
              Admin Preview (Unavailable to readers)
            </span>
          )}
        </div>
      </div>

      {book && (
        isRestricted ? (
          <div className="empty" style={{ margin: '80px auto', maxWidth: 560, padding: '48px 32px' }}>
            <div style={{ fontSize: '2.8rem', color: 'var(--danger)', marginBottom: 14 }}>
              <FiLock />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 10 }}>Book Unavailable for Reading</h2>
            <p className="muted" style={{ lineHeight: 1.6, marginBottom: 24 }}>
              <b>“{book.title}”</b> is currently listed as unavailable in the BookNest catalog. The reading view is restricted and cannot be opened at this time.
            </p>
            <Link to={`/books/${id}`} className="btn gold">
              Return to Book Details
            </Link>
          </div>
        ) : book.bookFile ? (
          <iframe
            title={book.title}
            src={fileUrl(book.bookFile)}
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <div className="empty" style={{ margin: '80px auto', maxWidth: 540 }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--forest-600)', marginBottom: 12 }}>
              <FiBookOpen />
            </div>
            <h3>No digital file attached yet</h3>
            <p className="muted">
              The administrator has not uploaded a readable PDF for this title yet.
            </p>
            <Link to={`/books/${id}`} className="btn ghost" style={{ marginTop: 12 }}>
              Back to Book Details
            </Link>
          </div>
        )
      )}
    </div>
  );
}
