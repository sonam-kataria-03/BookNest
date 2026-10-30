import { useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../services/api';

const blank = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/contact', form);
      toast.success('Your message has been received. Our librarians will respond shortly.');
      setForm(blank);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1>Get in Touch</h1>
        <p className="muted" style={{ maxWidth: 480, margin: '0 auto', fontSize: '1.05rem' }}>
          Have a book request, feedback, or need assistance? Reach out to our library curators.
        </p>
      </div>

      <form className="panel" onSubmit={submit}>
        <div className="two">
          <label className="field">
            <span>Your Name</span>
            <input required placeholder="Jane Doe" value={form.name} onChange={set('name')} />
          </label>
          <label className="field">
            <span>Your Email</span>
            <input type="email" required placeholder="you@domain.com" value={form.email} onChange={set('email')} />
          </label>
        </div>

        <label className="field">
          <span>Subject</span>
          <input required placeholder="e.g. Requesting a new title or edition" value={form.subject} onChange={set('subject')} />
        </label>

        <label className="field">
          <span>Your Message</span>
          <textarea rows={5} required placeholder="Write your inquiry here…" value={form.message} onChange={set('message')} />
        </label>

        <button className="btn gold" disabled={busy} style={{ width: '100%', padding: '14px', marginTop: 10 }}>
          <FiSend /> {busy ? 'Dispatching Message…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
