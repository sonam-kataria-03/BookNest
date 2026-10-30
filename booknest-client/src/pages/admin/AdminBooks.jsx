import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit3, FiTrash2, FiBook } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg, fileUrl } from '../../services/api';
import { colorFor } from '../../components/BookCard';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/books', { params: { search: q } })
      .then((r) => setBooks(r.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [q]);

  const remove = async (b) => {
    if (!window.confirm(`Delete “${b.title}”? This action cannot be undone.`)) return;
    try {
      await api.delete(`/books/${b._id}`);
      toast.success('Book deleted from catalog');
      load();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <>
      <div className="head-row" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0 }}>Books Catalog</h1>
          <p className="muted" style={{ margin: 0 }}>Manage titles, covers, and uploaded PDF files.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              style={{
                padding: '10px 14px 10px 36px',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.92rem',
                width: 220,
                background: '#FFFFFF',
              }}
              placeholder="Search catalog…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Link to="/admin/books/new" className="btn gold sm">
            <FiPlus /> Add Book
          </Link>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 60 }}>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>
                  {b.coverImage ? (
                    <img className="thumb" src={fileUrl(b.coverImage)} alt="" />
                  ) : (
                    <div className="thumb" style={{ background: colorFor(b.title), display: 'grid', placeItems: 'center', color: '#fff', fontSize: '0.75rem' }}>
                      ✦
                    </div>
                  )}
                </td>
                <td>
                  <b>{b.title}</b>
                  {b.publishedYear && <span className="muted" style={{ display: 'block', fontSize: '0.82rem' }}>Year: {b.publishedYear}</span>}
                </td>
                <td>{b.author}</td>
                <td>
                  <span className="tag" style={{ padding: '2px 10px', fontSize: '0.78rem' }}>
                    {b.category?.name || 'General'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${b.status === 'Available' ? 'on' : 'off'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link to={`/admin/books/${b._id}/edit`} className="btn ghost sm" title="Edit book">
                      <FiEdit3 /> Edit
                    </Link>
                    <button className="btn danger sm" onClick={() => remove(b)} title="Delete book">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!books.length && !loading && (
              <tr>
                <td colSpan={6} className="muted" style={{ textAlign: 'center', padding: '40px' }}>
                  No books found. Click "+ Add Book" to upload one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
