import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Please choose a password with at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match. Please verify.');
    setError('');
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Your library account is ready. Welcome to BookNest!');
      nav('/books');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="panel" onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="logo-badge" style={{ width: 44, height: 44, margin: '0 auto 12px', fontSize: '1.3rem' }}>
            <FiBookOpen />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.85rem' }}>Create Account</h1>
          <p className="muted" style={{ fontSize: '0.92rem', margin: 0 }}>
            Join BookNest to read and save books for free.
          </p>
        </div>

        <label className="field">
          <span>Full Name</span>
          <input
            required
            placeholder="Jane Doe"
            value={form.name}
            onChange={set('name')}
          />
        </label>

        <label className="field">
          <span>Email Address</span>
          <input
            type="email"
            required
            placeholder="you@domain.com"
            value={form.email}
            onChange={set('email')}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={set('password')}
          />
        </label>

        <label className="field">
          <span>Confirm Password</span>
          <input
            type="password"
            required
            placeholder="Re-enter your password"
            value={form.confirm}
            onChange={set('confirm')}
          />
        </label>

        {error && <p className="err">{error}</p>}

        <button
          className="btn gold"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}
          disabled={busy}
        >
          {busy ? 'Creating Your Account…' : 'Join the Library'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem' }}>
          <p className="muted" style={{ margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--forest-700)', fontWeight: 700 }}>
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
