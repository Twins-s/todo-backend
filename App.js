import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8080/todos";

// ── Иконки ────────────────────────────────────────────────────────────────
const IconCheck  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const IconTrash  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconEdit   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconBack   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>;
const IconPlus   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconSave   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconLoader = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{animation:"spin 1s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;

const styles = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:none; } }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',system-ui,sans-serif; background:#f1f5f9; min-height:100vh; color:#0f172a; }
  .app { max-width:680px; margin:0 auto; padding:32px 20px 60px; animation:fadeIn .3s ease; }
  .header { display:flex; align-items:center; gap:14px; margin-bottom:28px; }
  .header-icon { width:46px;height:46px;background:#3b82f6;border-radius:14px;display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;font-size:22px; }
  .header h1 { font-size:1.75rem;font-weight:700;color:#0f172a;letter-spacing:-.03em;line-height:1; }
  .header .subtitle { font-size:.875rem;color:#64748b;margin-top:3px; }
  .add-form { background:white;border:1px solid #e2e8f0;border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.05); }
  .form-row { display:flex;gap:10px; }
  .form-input { flex:1;padding:11px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:.95rem;font-family:inherit;background:#f8fafc;color:#0f172a;transition:border-color .15s,box-shadow .15s; }
  .form-input:focus { outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15);background:white; }
  .form-input::placeholder { color:#94a3b8; }
  .form-input.editing { border-color:#f59e0b;background:#fffbeb; }
  .form-input.editing:focus { border-color:#d97706;box-shadow:0 0 0 3px rgba(245,158,11,.15); }
  .btn-add { display:flex;align-items:center;gap:7px;padding:11px 18px;background:#3b82f6;color:white;border:none;border-radius:12px;font-size:.9rem;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;transition:background .15s,transform .1s; }
  .btn-add:hover { background:#2563eb; }
  .btn-add:active { transform:scale(.97); }
  .btn-add:disabled { background:#93c5fd;cursor:not-allowed; }
  .btn-save { background:#d97706; }
  .btn-save:hover { background:#b45309; }
  .form-error { font-size:.82rem;color:#ef4444;margin-top:8px;min-height:18px; }
  .stats-bar { display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding:0 2px; }
  .stat-pills { display:flex;gap:8px; }
  .pill { font-size:.8rem;font-weight:500;padding:4px 10px;border-radius:20px; }
  .pill-total { background:#f1f5f9;color:#475569; }
  .pill-done  { background:#dcfce7;color:#16a34a; }
  .pill-left  { background:#fef9c3;color:#a16207; }
  .btn-clear { font-size:.82rem;color:#ef4444;background:none;border:none;cursor:pointer;padding:5px 10px;border-radius:8px;font-family:inherit;font-weight:500;transition:background .15s; }
  .btn-clear:hover { background:#fee2e2; }
  .task-list { display:flex;flex-direction:column;gap:10px; }
  .task-card { background:white;border:1px solid #e2e8f0;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:box-shadow .18s,border-color .18s,transform .1s;animation:slideIn .22s ease; }
  .task-card:hover { border-color:#93c5fd;box-shadow:0 4px 14px rgba(59,130,246,.1);transform:translateY(-1px); }
  .task-card.editing-card { border-color:#f59e0b;box-shadow:0 4px 14px rgba(245,158,11,.15); cursor:default; transform:none; }
  .task-checkbox { width:22px;height:22px;border-radius:6px;border:2px solid #cbd5e1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s,border-color .15s;flex-shrink:0; }
  .task-checkbox.checked { background:#22c55e;border-color:#22c55e;color:white; }
  .task-body { flex:1;min-width:0; }
  .task-title { font-size:.97rem;font-weight:500;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .task-title.done { text-decoration:line-through;color:#94a3b8; }
  .task-meta { font-size:.75rem;color:#94a3b8;margin-top:2px; }
  .task-actions { display:flex;gap:4px;flex-shrink:0; }
  .btn-icon { width:34px;height:34px;border:none;border-radius:10px;background:transparent;color:#94a3b8;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s,color .15s; }
  .btn-icon.edit:hover { background:#fef9c3;color:#d97706; }
  .btn-icon.del:hover  { background:#fee2e2;color:#ef4444; }
  .inline-edit { flex:1;padding:6px 10px;border:1.5px solid #f59e0b;border-radius:8px;font-size:.95rem;font-family:inherit;background:#fffbeb;color:#0f172a; }
  .inline-edit:focus { outline:none; }
  .empty-state { text-align:center;padding:52px 20px;color:#94a3b8;border:2px dashed #e2e8f0;border-radius:20px;background:#fafcff; }
  .loading-state { text-align:center;padding:52px 20px;color:#64748b;display:flex;flex-direction:column;align-items:center;gap:14px; }
  .error-state { background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:20px;color:#dc2626;text-align:center; }
  .btn-retry { margin-top:10px;padding:8px 18px;background:#dc2626;color:white;border:none;border-radius:10px;font-size:.875rem;font-family:inherit;font-weight:500;cursor:pointer; }
  .progress-bar-wrap { background:#f1f5f9;border-radius:99px;height:6px;margin-bottom:20px;overflow:hidden; }
  .progress-bar { height:100%;background:#22c55e;border-radius:99px;transition:width .4s ease; }
  .detail-page { animation:fadeIn .25s ease; }
  .btn-back { display:inline-flex;align-items:center;gap:6px;font-size:.875rem;font-weight:500;color:#3b82f6;background:none;border:none;cursor:pointer;padding:8px 0;margin-bottom:20px;font-family:inherit; }
  .detail-card { background:white;border:1px solid #e2e8f0;border-radius:24px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06); }
  .detail-badge { display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-size:.8rem;font-weight:600;margin-bottom:20px; }
  .badge-done    { background:#dcfce7;color:#16a34a; }
  .badge-pending { background:#fef9c3;color:#a16207; }
  .detail-title { font-size:1.5rem;font-weight:700;color:#0f172a;letter-spacing:-.02em;line-height:1.3;margin-bottom:28px; }
  .detail-title.done { text-decoration:line-through;color:#94a3b8; }
  .detail-meta { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px; }
  .meta-item { background:#f8fafc;border-radius:14px;padding:14px 16px;border:1px solid #e2e8f0; }
  .meta-label { font-size:.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px; }
  .meta-value { font-size:1rem;font-weight:500;color:#1e293b; }
  .detail-actions { display:flex;gap:10px;flex-wrap:wrap; }
  .btn-primary { display:flex;align-items:center;gap:8px;padding:11px 20px;background:#3b82f6;color:white;border:none;border-radius:12px;font-size:.9rem;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s,transform .1s; }
  .btn-primary:hover { background:#2563eb; }
  .btn-primary.success { background:#16a34a; }
  .btn-primary.success:hover { background:#15803d; }
  .btn-danger { display:flex;align-items:center;gap:8px;padding:11px 20px;background:white;color:#ef4444;border:1.5px solid #fecaca;border-radius:12px;font-size:.9rem;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s; }
  .btn-danger:hover { background:#fee2e2; }
  .toast { position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:12px 20px;border-radius:12px;font-size:.875rem;font-weight:500;animation:fadeIn .3s ease;z-index:1000; }
`;

// ── Форматирование даты ───────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ru-RU", {
    day:"2-digit", month:"2-digit", year:"numeric",
    hour:"2-digit", minute:"2-digit"
  });
}

// ── Toast-уведомление ─────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

// ── Страница деталей ──────────────────────────────────────────────────────
function DetailPage({ task, onBack, onToggle, onDelete }) {
  if (!task) return null;
  return (
    <div className="detail-page">
      <button className="btn-back" onClick={onBack}><IconBack /> Назад</button>
      <div className="detail-card">
        <div className={`detail-badge ${task.completed ? "badge-done" : "badge-pending"}`}>
          {task.completed ? <><IconCheck /> Выполнено</> : "⏳ В процессе"}
        </div>
        <h2 className={`detail-title ${task.completed ? "done" : ""}`}>{task.title}</h2>
        <div className="detail-meta">
          <div className="meta-item"><div className="meta-label">ID</div><div className="meta-value">#{task.id}</div></div>
          <div className="meta-item"><div className="meta-label">Статус</div><div className="meta-value" style={{color: task.completed?"#16a34a":"#d97706"}}>{task.completed?"Завершена":"Активна"}</div></div>
          <div className="meta-item"><div className="meta-label">Создана</div><div className="meta-value" style={{fontSize:".85rem"}}>{formatDate(task.createdAt)}</div></div>
          <div className="meta-item"><div className="meta-label">Обновлена</div><div className="meta-value" style={{fontSize:".85rem"}}>{formatDate(task.updatedAt)}</div></div>
        </div>
        <div className="detail-actions">
          <button className={`btn-primary ${task.completed?"":"success"}`} onClick={() => onToggle(task.id, !task.completed)}>
            <IconCheck />{task.completed ? "Отметить активной" : "Отметить выполненной"}
          </button>
          <button className="btn-danger" onClick={() => { onDelete(task.id); onBack(); }}>
            <IconTrash /> Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Карточка задачи ───────────────────────────────────────────────────────
function TaskCard({ task, onClick, onToggle, onDelete, onSaveEdit, editingId, setEditingId }) {
  const [editVal, setEditVal] = useState(task.title);
  const isEditing = editingId === task.id;

  function handleCheckbox(e) { e.stopPropagation(); onToggle(task.id, !task.completed); }
  function handleDelete(e)   { e.stopPropagation(); onDelete(task.id); }
  function handleEdit(e)     { e.stopPropagation(); setEditVal(task.title); setEditingId(task.id); }

  function handleSave(e) {
    e.stopPropagation();
    if (editVal.trim()) { onSaveEdit(task.id, editVal.trim()); setEditingId(null); }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave(e);
    if (e.key === "Escape") { e.stopPropagation(); setEditingId(null); }
  }

  return (
    <div className={`task-card ${isEditing ? "editing-card" : ""}`}
         onClick={() => !isEditing && onClick(task)}>
      <div onClick={handleCheckbox}>
        <div className={`task-checkbox ${task.completed ? "checked" : ""}`}>
          {task.completed && <IconCheck />}
        </div>
      </div>

      <div className="task-body">
        {isEditing ? (
          <input className="inline-edit" value={editVal} autoFocus
            onChange={e => setEditVal(e.target.value)}
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}/>
        ) : (
          <>
            <div className={`task-title ${task.completed ? "done" : ""}`}>{task.title}</div>
            <div className="task-meta">#{task.id} · {formatDate(task.updatedAt)}</div>
          </>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <button className="btn-icon edit" onClick={handleSave} title="Сохранить"><IconSave /></button>
        ) : (
          <button className="btn-icon edit" onClick={handleEdit} title="Редактировать"><IconEdit /></button>
        )}
        <button className="btn-icon del" onClick={handleDelete} title="Удалить"><IconTrash /></button>
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [view, setView]         = useState("list");
  const [selected, setSelected] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast]       = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  // ── Загрузка всех задач с бэкенда ─────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
      setTasks(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── CREATE ─────────────────────────────────────────────────────────────
  async function addTask() {
    const title = newTitle.trim();
    if (!title) { setFormError("Введите название задачи"); return; }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.message || "Ошибка создания");
        return;
      }
      const created = await res.json();
      setTasks(prev => [created, ...prev]);
      setNewTitle(""); setFormError("");
      showToast("✅ Задача добавлена");
    } catch { setFormError("Нет связи с сервером"); }
  }

  // ── PATCH — переключить статус ─────────────────────────────────────────
  async function toggleTask(id, completed) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      });
      if (!res.ok) return;
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      if (selected?.id === id) setSelected(updated);
    } catch {}
  }

  // ── PUT — сохранить новое название ────────────────────────────────────
  async function saveEdit(id, title) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: task.completed })
      });
      if (!res.ok) return;
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      showToast("✏️ Задача обновлена");
    } catch {}
  }

  // ── DELETE ─────────────────────────────────────────────────────────────
  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.status === 204 || res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        showToast("🗑️ Задача удалена");
      }
    } catch {}
  }

  // ── DELETE completed ───────────────────────────────────────────────────
  async function clearCompleted() {
    try {
      const res = await fetch(`${API_URL}/completed`, { method: "DELETE" });
      if (!res.ok) return;
      const { deleted } = await res.json();
      setTasks(prev => prev.filter(t => !t.completed));
      showToast(`🗑️ Удалено выполненных: ${deleted}`);
    } catch {}
  }

  const total    = tasks.length;
  const done     = tasks.filter(t => t.completed).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const sorted   = [...tasks].sort((a,b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);

  if (view === "detail") return (
    <>
      <style>{styles}</style>
      <div className="app">
        <DetailPage task={selected}
          onBack={() => { setView("list"); setSelected(null); }}
          onToggle={toggleTask} onDelete={deleteTask}/>
        <Toast message={toast}/>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-icon">📋</div>
          <div>
            <h1>Мои задачи</h1>
            <div className="subtitle">Spring Boot + H2 Backend</div>
          </div>
        </div>

        <div className="add-form">
          <div className="form-row">
            <input className="form-input" type="text" placeholder="Новая задача..."
              value={newTitle} maxLength={255}
              onChange={e => { setNewTitle(e.target.value); setFormError(""); }}
              onKeyDown={e => e.key === "Enter" && addTask()}/>
            <button className="btn-add" onClick={addTask} disabled={loading}>
              <IconPlus /> Добавить
            </button>
          </div>
          {formError && <div className="form-error">{formError}</div>}
        </div>

        {!loading && !error && (
          <>
            <div className="stats-bar">
              <div className="stat-pills">
                <span className="pill pill-total">Всего: {total}</span>
                <span className="pill pill-done">✓ {done}</span>
                <span className="pill pill-left">⏳ {total - done}</span>
              </div>
              {done > 0 && <button className="btn-clear" onClick={clearCompleted}>Удалить выполненные</button>}
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{width:`${progress}%`}}/>
            </div>
          </>
        )}

        {loading && <div className="loading-state"><IconLoader/><p>Загружаем задачи с сервера...</p></div>}

        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <p style={{fontSize:".85rem",marginTop:"6px",opacity:.7}}>Убедитесь, что Spring Boot запущен на порту 8080</p>
            <button className="btn-retry" onClick={fetchTasks}>Повторить</button>
          </div>
        )}

        {!loading && !error && (
          <div className="task-list">
            {sorted.length === 0
              ? <div className="empty-state"><div style={{fontSize:"2.5rem",marginBottom:"12px",opacity:.4}}>📋</div><p>Задач пока нет. Добавьте первую!</p></div>
              : sorted.map(task => (
                  <TaskCard key={task.id} task={task}
                    onClick={t => { setSelected(t); setView("detail"); }}
                    onToggle={toggleTask} onDelete={deleteTask}
                    onSaveEdit={saveEdit} editingId={editingId} setEditingId={setEditingId}/>
                ))
            }
          </div>
        )}

        <Toast message={toast}/>
      </div>
    </>
  );
}
