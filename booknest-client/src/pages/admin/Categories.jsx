import { useEffect, useState } from 'react';
import { FiTag, FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../../services/api';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);
  const load = () => api.get('/categories').then((r) => setCats(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, form);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', form);
        toast.success('Category created successfully');
      }
      setForm({ name: '', description: '' });
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const edit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, description: c.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete the “${c.name}” category? This may affect books in this category.`)) return;
    try {
      await api.delete(`/categories/${c._id}`);
      toast.success('Category deleted');
      load();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1>Book Categories</h1>
        <p className="muted" style={{ margin: 0 }}>Create and organize genres for reader discovery.</p>
      </div>

      <form className="panel" onSubmit={submit} style={{ marginBottom: 32, maxWidth: 820 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>
          {editing ? 'Edit Category' : 'Create New Category'}
        </h3>
        <div className="two">
          <label className="field">
            <span>Category Name</span>
            <input
              required
              placeholder="e.g. Science Fiction, Philosophy"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Description</span>
            <input
              placeholder="Brief overview of books in this genre"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
        </div>
        <div className="row-actions">
          <button className="btn gold sm">
            {editing ? 'Save Changes' : <><FiPlus /> Add Category</>}
          </button>
          {editing && (
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c._id}>
                <td>
                  <span className="tag" style={{ fontSize: '0.86rem' }}>
                    {c.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.description || '—'}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn ghost sm" onClick={() => edit(c)} title="Edit category">
                      <FiEdit3 />
                    </button>
                    <button className="btn danger sm" onClick={() => remove(c)} title="Delete category">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!cats.length && (
              <tr>
                <td colSpan={3} className="muted" style={{ textAlign: 'center', padding: '36px' }}>
                  No categories defined yet. Use the form above to add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
