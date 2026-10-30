import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiFileText, FiImage, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../../services/api';

const blank = { title: '', author: '', category: '', publishedYear: '', status: 'Available', description: '' };

export default function BookForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(blank);
  const [cats, setCats] = useState([]);
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api.get('/categories').then((r) => {
      setCats(r.data);
      if (!id && r.data[0]) setForm((f) => ({ ...f, category: r.data[0]._id }));
    });
    if (id) {
      api.get(`/books/${id}`).then(({ data: b }) => {
        setForm({
          title: b.title,
          author: b.author,
          category: b.category?._id || '',
          publishedYear: b.publishedYear || '',
          status: b.status,
          description: b.description || ''
        });
      });
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (cover) fd.append('coverImage', cover);
    if (file) fd.append('bookFile', file);
    setBusy(true);
    try {
      if (id) {
        await api.put(`/books/${id}`, fd);
      } else {
        await api.post('/books', fd);
      }
      toast.success(id ? 'Book updated successfully' : 'New book added to library');
      nav('/admin/books');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/books" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 12 }}>
          <FiArrowLeft /> Back to Books Catalog
        </Link>
        <h1>{id ? 'Edit Book Details' : 'Add New Book to Collection'}</h1>
        <p className="muted" style={{ margin: 0 }}>
          {id ? 'Update metadata, book description, and digital assets.' : 'Upload cover art and PDF file for reader browser access.'}
        </p>
      </div>

      <form className="panel" onSubmit={submit} style={{ maxWidth: 820 }}>
        <div className="two">
          <label className="field">
            <span>Book Title</span>
            <input required placeholder="e.g. The Quiet Harbour" value={form.title} onChange={set('title')} />
          </label>

          <label className="field">
            <span>Author</span>
            <input required placeholder="e.g. Meera Kapoor" value={form.author} onChange={set('author')} />
          </label>

          <label className="field">
            <span>Literary Category</span>
            <select required value={form.category} onChange={set('category')}>
              {cats.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Publication Year</span>
            <input type="number" min="1000" max="2100" placeholder="e.g. 2024" value={form.publishedYear} onChange={set('publishedYear')} />
          </label>
        </div>

        <label className="field">
          <span>Catalog Status</span>
          <select value={form.status} onChange={set('status')}>
            <option value="Available">Available (Visible to all readers)</option>
            <option value="Unavailable">Unavailable (Archived)</option>
          </select>
        </label>

        <label className="field">
          <span>Description / Synopsis</span>
          <textarea rows={5} placeholder="Write a summary or synopsis of the book…" value={form.description} onChange={set('description')} />
        </label>

        <div className="two" style={{ marginTop: 24, padding: '20px', background: 'var(--card-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
          <label className="field" style={{ margin: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiImage style={{ color: 'var(--forest-600)' }} /> Cover Image (JPG, PNG, WEBP)
            </span>
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
            {cover && <small style={{ color: 'var(--ok)', fontWeight: 600, display: 'block', marginTop: 4 }}>✓ {cover.name}</small>}
          </label>

          <label className="field" style={{ margin: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiFileText style={{ color: 'var(--forest-600)' }} /> Book File (PDF for In-Browser Reader)
            </span>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
            {file && <small style={{ color: 'var(--ok)', fontWeight: 600, display: 'block', marginTop: 4 }}>✓ {file.name}</small>}
          </label>
        </div>

        {id && (
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: 14 }}>
            Tip: Leave the file selectors empty if you want to keep the existing cover and PDF files.
          </p>
        )}

        <div className="row-actions" style={{ marginTop: 32 }}>
          <button className="btn gold" disabled={busy}>
            {busy ? 'Saving Book Data…' : id ? 'Update Book' : 'Publish Book to Catalog'}
          </button>
          <button type="button" className="btn ghost" onClick={() => nav('/admin/books')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
