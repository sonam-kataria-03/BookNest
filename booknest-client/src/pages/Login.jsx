import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name}`);
      nav(u.role === 'admin' ? '/admin' : state?.from || '/books');
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
          <h1 style={{ margin: '0 0 6px', fontSize: '1.85rem' }}>Welcome Back</h1>
          <p className="muted" style={{ fontSize: '0.92rem', margin: 0 }}>
            Enter your credentials to access your reading sanctuary.
          </p>
        </div>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ margin: 0 }}>Password</span>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.85rem', color: 'var(--forest-600)', fontWeight: 600 }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
          />
        </label>

        <button
          className="btn gold"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }}
          disabled={busy}
        >
          {busy ? 'Opening Sanctuary…' : 'Log In to BookNest'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem' }}>
          <p className="muted" style={{ margin: 0 }}>
            New to the library?{' '}
            <Link to="/register" style={{ color: 'var(--forest-700)', fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
