import { useState } from 'react';
import { FiUser, FiCamera, FiCheck, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg, fileUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    fd.append('name', name);
    if (file) fd.append('profileImage', file);
    try {
      const { data } = await api.put(`/users/${user._id}`, fd);
      setUser(data);
      setFile(null);
      toast.success('Your profile has been saved successfully');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const preview = file ? URL.createObjectURL(file) : fileUrl(user.profileImage);

  return (
    <div className="container section" style={{ maxWidth: 680 }}>
      <div className="head-row">
        <div>
          <h1>Reader Profile</h1>
          <p className="muted" style={{ margin: 0 }}>Manage your personal details and identity.</p>
        </div>
      </div>

      <form className="panel" onSubmit={save}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            {preview ? (
              <img className="avatar" src={preview} alt="Profile" />
            ) : (
              <div className="avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem' }}>{user.name}</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="tag" style={{ background: 'var(--gold-100)', color: 'var(--gold-600)', borderColor: 'var(--gold-200)' }}>
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
              <span className={`badge ${user.status === 'Active' ? 'on' : 'off'}`}>
                {user.status}
              </span>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--forest-700)' }}>
              <FiCamera /> Change avatar picture
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <label className="field">
          <span>Full Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Registered Email Address</span>
          <input
            value={user.email}
            disabled
            style={{ background: 'var(--card-subtle)', color: 'var(--text-secondary)' }}
          />
          <small className="muted" style={{ display: 'block', marginTop: 4 }}>
            Email addresses are fixed to protect account security.
          </small>
        </label>

        <button className="btn gold" disabled={busy} style={{ marginTop: 12 }}>
          {busy ? 'Saving Profile…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
