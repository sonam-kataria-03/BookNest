import { Link } from 'react-router-dom';
import { FiBookOpen, FiBookmark } from 'react-icons/fi';
import { fileUrl } from '../services/api';

const GRADIENTS = [
  'linear-gradient(145deg, #0D2821 0%, #174238 60%, #1F5448 100%)', // Emerald
  'linear-gradient(145deg, #3A1B14 0%, #5E2C20 60%, #7A3B2C 100%)', // Burgundy
  'linear-gradient(145deg, #12253B 0%, #1E3B5C 60%, #2A4F7A 100%)', // Midnight Navy
  'linear-gradient(145deg, #2B1838 0%, #46255C 60%, #5E327A 100%)', // Deep Plum
  'linear-gradient(145deg, #382910 0%, #5C431A 60%, #7A5923 100%)', // Warm Amber
  'linear-gradient(145deg, #132D33 0%, #204852 60%, #2D636F 100%)', // Petrol Teal
  'linear-gradient(145deg, #3D1525 0%, #5E203A 60%, #7E2B4D 100%)', // Rosewood
  'linear-gradient(145deg, #212913 0%, #354220 60%, #47582B 100%)', // Olive Grove
];

export const colorFor = (s = '') => GRADIENTS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];

export function Cover({ book }) {
  const bg = colorFor(book?.title || '');
  return (
    <div className="cover-wrapper">
      {book?.status === 'Unavailable' && (
        <span
          className="badge off"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 4,
            backdropFilter: 'blur(8px)',
            background: 'rgba(192, 57, 43, 0.92)',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            padding: '3px 9px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontWeight: 700
          }}
        >
          Unavailable
        </span>
      )}
      <div className="cover" style={{ background: bg }}>
        {book?.coverImage ? (
          <img src={fileUrl(book.coverImage)} alt={`Cover of ${book.title}`} />
        ) : (
          <div className="cover-fallback">
            <span className="cover-seal">✦</span>
            <div>
              <div className="cover-title-text">{book?.title}</div>
              <small style={{ color: 'var(--gold-300)', marginTop: 6, display: 'block', fontWeight: 600 }}>{book?.author}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookCard({ book, children }) {
  return (
    <div className="book-card-item">
      <Link to={`/books/${book._id}`} className="book">
        <Cover book={book} />
        <h3 className="book-title-heading">{book.title}</h3>
        <div className="book-author-sub">
          <span>{book.author}</span>
          {book.category?.name && (
            <>
              <span>·</span>
              <span style={{ color: 'var(--forest-600)', fontWeight: 600 }}>{book.category.name}</span>
            </>
          )}
        </div>
      </Link>
      {children}
    </div>
  );
}
