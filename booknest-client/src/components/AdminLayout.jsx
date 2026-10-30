import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiPlusSquare, FiUsers, FiTag, FiMail, FiUser, FiLogOut, FiHome, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../services/api';

const items = [
  ['/admin', 'Dashboard', FiGrid, true],
  ['/admin/books', 'Books Catalog', FiBook],
  ['/admin/books/new', 'Add New Book', FiPlusSquare],
  ['/admin/users', 'User Accounts', FiUsers],
  ['/admin/categories', 'Categories', FiTag],
  ['/admin/messages', 'Reader Messages', FiMail],
  ['/admin/profile', 'Admin Profile', FiUser],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="admin">
      <aside className="side">
        <Link to="/admin" className="logo" style={{ color: '#FFFFFF', marginBottom: 32 }}>
          <span className="logo-badge" style={{ width: 34, height: 34 }}><FiBookOpen /></span>
          <span>BookNest Admin</span>
        </Link>

        <nav className="side-nav">
          {items.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end}>
              <Icon /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#A1BFB8', borderRadius: 'var(--r-sm)' }}>
            <FiHome /> <span>View Reader Site</span>
          </Link>
          <button
            onClick={() => { logout(); nav('/login'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#E87A6E', width: '100%', background: 'none', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.94rem' }}
          >
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
