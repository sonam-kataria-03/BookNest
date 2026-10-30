import { Fragment, useEffect, useState } from 'react';
import { FiMail, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../services/api';

export default function Messages() {
  const [msgs, setMsgs] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.get('/contact').then((r) => setMsgs(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1>Reader Inquiries</h1>
        <p className="muted" style={{ margin: 0 }}>Messages and book requests received via the Contact page.</p>
      </div>

      {msgs.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Received</th>
                <th style={{ width: 100 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {msgs.map((m) => (
                <Fragment key={m._id}>
                  <tr>
                    <td>
                      <b>{m.name}</b>
                      <small className="muted" style={{ display: 'block', fontSize: '0.84rem' }}>{m.email}</small>
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.subject}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn ghost sm"
                        onClick={() => setOpen(open === m._id ? null : m._id)}
                      >
                        {open === m._id ? <><FiChevronUp /> Hide</> : <><FiChevronDown /> View</>}
                      </button>
                    </td>
                  </tr>
                  {open === m._id && (
                    <tr>
                      <td colSpan={4} style={{ background: 'var(--card-subtle)', padding: '20px 24px' }}>
                        <div style={{ borderLeft: '3px solid var(--forest-600)', paddingLeft: 16 }}>
                          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--forest-600)', fontWeight: 700, letterSpacing: '0.05em' }}>
                            Full Reader Message:
                          </span>
                          <p style={{ margin: '8px 0 0', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                            {m.message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <div style={{ fontSize: '2.5rem', color: 'var(--forest-600)', marginBottom: 12 }}>
            <FiMail />
          </div>
          <h3>No reader messages yet</h3>
          <p className="muted">Messages sent through the reader Contact form will appear here.</p>
        </div>
      )}
    </>
  );
}
