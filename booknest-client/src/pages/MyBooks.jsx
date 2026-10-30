import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiTrash2, FiBookmark, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

export default function MyBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState(null);

  useEffect(() => {
    api.get('/saved')
      .then((r) => setBooks(r.data))
      .catch(() => setBooks([]));
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/saved/${id}`);
      setBooks(books.filter((b) => b._id !== id));
      toast.success('Removed from your shelf');
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  if (!books) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p className="muted" style={{ fontSize: '1.2rem' }}>✦ Loading your personal shelf…</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="head-row">
        <div>
          <h1>My Shelf</h1>
          <p className="muted" style={{ margin: 0 }}>
            {books.length} {books.length === 1 ? 'book' : 'books'} saved for your reading journey.
          </p>
        </div>
        <Link to="/books" className="btn ghost sm">
          Explore More Titles
        </Link>
      </div>

      {books.length > 0 ? (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b._id} book={b}>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {b.status === 'Available' ? (
                  <Link to={`/read/${b._id}`} className="btn gold sm" style={{ flex: 1, textDecoration: 'none' }}>
                    <FiBookOpen /> Read
                  </Link>
                ) : user?.role === 'admin' ? (
                  <Link to={`/read/${b._id}`} className="btn ghost sm" style={{ flex: 1, textDecoration: 'none', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                    <FiBookOpen /> Preview
                  </Link>
                ) : (
                  <button
                    className="btn ghost sm"
                    disabled
                    style={{ flex: 1, opacity: 0.65, cursor: 'not-allowed' }}
                    title="This book is currently unavailable to read"
                  >
                    <FiLock /> Unavailable
                  </button>
                )}
                <button
                  className="btn danger sm"
                  onClick={() => remove(b._id)}
                  title="Remove from shelf"
                  aria-label="Remove from shelf"
                >
                  <FiTrash2 />
                </button>
              </div>
            </BookCard>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div style={{ fontSize: '2.5rem', color: 'var(--forest-600)', marginBottom: 12 }}>
            <FiBookmark />
          </div>
          <h3>Your shelf is empty</h3>
          <p className="muted">
            When you find a title you'd like to read later, click "Save for Later" on its page.
          </p>
          <Link to="/books" className="btn gold" style={{ marginTop: 14 }}>
            Browse Library Collection
          </Link>
        </div>
      )}
    </div>
  );
}
