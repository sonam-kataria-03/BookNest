import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiTag, FiMail, FiPlus, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);

  useEffect(() => {
    api.get('/stats').then((r) => setS(r.data)).catch(() => {});
  }, []);

  if (!s) {
    return (
      <div style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
        <p>✦ Gathering library metrics…</p>
      </div>
    );
  }

  const tiles = [
    { label: 'Registered Readers', n: s.users, to: '/admin/users', icon: FiUsers },
    { label: 'Catalog Books', n: s.books, to: '/admin/books', icon: FiBook },
    { label: 'Active Categories', n: s.categories, to: '/admin/categories', icon: FiTag },
    { label: 'Reader Messages', n: s.messages, to: '/admin/messages', icon: FiMail },
  ];

  return (
    <>
      <div className="head-row" style={{ marginBottom: 32 }}>
        <div>
          <h1>Admin Overview</h1>
          <p className="muted" style={{ margin: 0 }}>
            Welcome, <b>{user?.name}</b>. Here is the pulse of the BookNest library.
          </p>
        </div>
        <Link to="/admin/books/new" className="btn gold sm">
          <FiPlus /> Add New Book
        </Link>
      </div>

      <div className="stats">
        {tiles.map(({ label, n, to, icon: Icon }) => (
          <Link key={label} to={to} className="stat">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span>{label}</span>
              <Icon style={{ color: 'var(--forest-600)', fontSize: '1.25rem' }} />
            </div>
            <b>{n}</b>
            <div style={{ fontSize: '0.82rem', color: 'var(--forest-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              Manage {label.toLowerCase()} <FiArrowRight />
            </div>
          </Link>
        ))}
      </div>

      <div className="head-row" style={{ marginTop: 44 }}>
        <div>
          <h2 style={{ fontSize: '1.45rem' }}>Recently Added Books</h2>
          <p className="muted" style={{ margin: 0 }}>Latest additions to the online collection.</p>
        </div>
        <Link to="/admin/books" className="btn ghost sm">
          View All Catalog
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Added Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {s.recentBooks && s.recentBooks.length > 0 ? (
              s.recentBooks.map((b) => (
                <tr key={b._id}>
                  <td>
                    <Link to={`/admin/books/${b._id}/edit`} style={{ fontWeight: 600, color: 'var(--forest-900)' }}>
                      {b.title}
                    </Link>
                  </td>
                  <td>{b.author}</td>
                  <td>
                    <span className="tag" style={{ padding: '2px 10px', fontSize: '0.78rem' }}>
                      {b.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${b.status === 'Available' ? 'on' : 'off'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="muted" style={{ textAlign: 'center', padding: '36px' }}>
                  No books added yet. Click "+ Add New Book" above to upload your first title.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
