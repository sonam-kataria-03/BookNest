import { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiShield, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg, fileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data)).catch(() => {});
  }, []);

  const toggle = async (u) => {
    const status = u.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/users/${u._id}`, { status });
      setUsers(users.map((x) => (x._id === u._id ? { ...x, status } : x)));
      toast.success(`${u.name} is now ${status.toLowerCase()}`);
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1>Registered Users</h1>
        <p className="muted" style={{ margin: 0 }}>Review reader profiles and manage account activity.</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reader</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Access Control</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {u.profileImage ? (
                      <img src={fileUrl(u.profileImage)} alt="" className="nav-avatar-mini" />
                    ) : (
                      <div className="nav-avatar-mini">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <b>{u.name}</b>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <span className="tag" style={{ fontSize: '0.8rem', background: u.role === 'admin' ? 'var(--gold-100)' : 'var(--forest-50)', color: u.role === 'admin' ? 'var(--gold-600)' : 'var(--forest-800)' }}>
                    {u.role === 'admin' ? 'Admin' : 'Reader'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${u.status === 'Active' ? 'on' : 'off'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  {u._id === me?._id ? (
                    <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      Current User
                    </span>
                  ) : (
                    <button
                      className={`btn ${u.status === 'Active' ? 'danger' : 'ghost'} sm`}
                      onClick={() => toggle(u)}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan={6} className="muted" style={{ textAlign: 'center', padding: '36px' }}>
                  No users found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
