import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import NavBar from '../components/NavBar.jsx';
import useAuth from '../hooks/useAuth.js';
import Icon from '../components/Icon.jsx';
import TaskForm, { Modal } from '../components/TaskForm.jsx';
import NetworkPanel from '../components/NetworkPanel.jsx';
import { createItem, updateItem, deleteItem } from '../services/service.js';

export default function RootLayout() {
  const { user, loading: authLoading } = useAuth();
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.split('/')[1] || 'Home';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${page[0].toUpperCase() + page.slice(1)} | StudyFlow`;
  }, [location.pathname, page]);

  function openEditor(item = null) { setError(''); setEditor({ item }); }
  function openRemove(item) { setError(''); setRemoving(item); }
  function notify(message, type = 'success') { setNotice({ message, type }); }

  // Writes live in the layout, so visiting another page does not lose a save.
  async function save(type, item, values) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const result = type === 'create' ? await createItem(values)
        : type === 'remove' ? await deleteItem(item.id)
        : await updateItem(item.id, values);
      setRevision((value) => value + 1);
      setEditor(null);
      setRemoving(null);
      notify(type === 'remove' ? `Removed “${item.title}”.` : `Saved “${result.title}”.`);
      if (type === 'create') navigate(`/assignments/${result.id}`);
      if (type === 'remove') navigate('/assignments');
    } catch (failure) {
      setError(failure.message);
      notify(failure.message, 'error');
    } finally { setBusy(false); }
  }

  const context = { revision, busy, openEditor, openRemove,
    complete: (task) => save('update', task, { status: task.status === 'Completed' ? 'To do' : 'Completed' }) };

  return <div className="app-shell">
    <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main').focus(); }}>Skip to content</a>
    <NavBar />
    <main id="main" className="main-content" tabIndex={-1}>
      <header className="topbar"><span><span className="breadcrumb">Workspace</span><span className="slash">/</span><span className="capitalize">{page}</span></span><Link to={user ? "/profile" : "/login"} className="login-link"><Icon name="cap" size={18} />Student workspace <span>{authLoading ? "Checking session…" : user ? "My profile ↗" : "Log in ↗"}</span></Link></header>
      {busy && <div className="notice info" role="status"><span className="spinner small" />Saving your assignment…</div>}
      {notice && <div className={`notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}><span>{notice.message}</span><button aria-label="Dismiss notification" onClick={() => setNotice(null)}><Icon name="close" size={16} /></button></div>}
      <Outlet context={context} />
      <NetworkPanel onNotice={notify} />
      <footer className="page-footer"><span>StudyFlow · A calmer place to get things done.</span><span>Karas Yerassyl · KBTU</span></footer>
    </main>
    {editor && <TaskForm item={editor.item} busy={busy} error={error} onClose={() => !busy && setEditor(null)} onSave={(values) => save(editor.item ? 'update' : 'create', editor.item, values)} />}
    {removing && <Modal title="Remove this assignment?" busy={busy} onClose={() => !busy && setRemoving(null)}><p className="remove-description">“{removing.title}” will be removed from this browser.</p>{error && <p role="alert" className="inline-error">{error}</p>}<div className="modal-actions"><button autoFocus className="button secondary" disabled={busy} onClick={() => setRemoving(null)}>Keep assignment</button><button className="button danger" disabled={busy} onClick={() => save('remove', removing)}>Yes, remove</button></div></Modal>}
  </div>;
}
