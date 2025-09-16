// import React, { useEffect, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams, Link } from 'react-router-dom';
// import TaskTable from './Tasktable';
// import { ArrowLeft } from 'lucide-react';
// import { fetchTableEntries } from '../../../store/slices/table/tableSlice';

// const safeDecode = (val) => {
//   try { return typeof val === 'string' ? decodeURIComponent(val) : ''; }
//   catch { return String(val || ''); }
// };
// const norm = (s) => (s || '').toString().trim().toLowerCase();

// const TaskTablePage = () => {
//   const { heading: encodedHeading } = useParams();
//   const heading = safeDecode(encodedHeading);

//   const dispatch = useDispatch();
//   const { entries, status, error } = useSelector((state) => state.table);
//   const list = Array.isArray(entries) ? entries : [];

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchTableEntries());
//     }
//   }, [status, dispatch]);

//   const tasksForHeading = useMemo(() => {
//     const target = norm(heading || 'Uncategorized');
//     return list.filter(task => norm(task.heading || 'Uncategorized') === target);
//   }, [list, heading]);

//   if (status === 'loading') {
//     return <div className="text-center p-10 font-semibold">Loading tasks...</div>;
//   }

//   if (status === 'failed') {
//     return <div className="text-center p-10 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto py-8 px-4">
//       <Link to="/table" className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:underline">
//         <ArrowLeft size={16} />
//         Back to All Groups
//       </Link>

//       <h1 className="text-3xl font-bold text-slate-800 mb-6">
//         Tasks for: <span className="text-blue-600">{heading || 'Uncategorized'}</span>
//       </h1>

//       <TaskTable tasks={tasksForHeading} />
//     </div>
//   );
// };

// export default TaskTablePage;


// TaskTablePage.jsx (additions)
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import TaskTable from './Tasktable';
import { ArrowLeft, Plus } from 'lucide-react';
import { fetchTableEntries, createTableEntry } from '../../../store/slices/table/tableSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const safeDecode = (val) => { try { return typeof val === 'string' ? decodeURIComponent(val) : ''; } catch { return String(val || ''); } };
const norm = (s) => (s || '').toString().trim().toLowerCase();

const TaskTablePage = () => {
  const { heading: encodedHeading } = useParams();
  const heading = safeDecode(encodedHeading);

  const dispatch = useDispatch();
  const { entries, status, error } = useSelector((state) => state.table);
  const currentUser = useSelector(selectCurrentUser);
  const isEmployee = currentUser?.user?.role === 'employee';

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTableEntries());
    }
  }, [status, dispatch]);

  const tasksForHeading = useMemo(() => {
    const target = norm(heading || 'Uncategorized');
    return (Array.isArray(entries) ? entries : []).filter(
      (task) => norm(task.heading || 'Uncategorized') === target
    );
  }, [entries, heading]);

  if (status === 'loading') {
    return <div className="text-center p-10 font-semibold">Loading tasks...</div>;
  }
  if (status === 'failed') {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Link to="/table" className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:underline">
        <ArrowLeft size={16} />
        Back to All Groups
      </Link>

      {/* Header row: title + plus button for employees */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Tasks for: <span className="text-blue-600">{heading || 'Uncategorized'}</span>
        </h1>
        {isEmployee ? (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            aria-label="Add row"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="Add row"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <TaskTable tasks={tasksForHeading} />

      {isCreateOpen ? (
        <CreateRowModal
          heading={heading || 'Uncategorized'}
          onClose={() => setIsCreateOpen(false)}
          onCreate={async (values) => {
            // values => { title, description, content }
            await dispatch(
              createTableEntry({ heading: heading || 'Uncategorized', ...values })
            ).unwrap();
            setIsCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default TaskTablePage;

// Lightweight modal component for creating a row under the current heading
function CreateRowModal({ heading, onClose, onCreate }) {
  const dispatch = useDispatch(); // not strictly needed here, but fine if you prefer calling onCreate only
  const [form, setForm] = useState({ title: '', description: '', content: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErr('');
    const title = form.title.trim();
    const description = form.description.trim();
    const content = form.content.trim();
    if (!title || !description || !content) {
      setErr('Please fill in all required fields.');
      return;
    }
    try {
      setBusy(true);
      await onCreate({ title, description, content }); // unwrap handled in parent
    } catch (ex) {
      setErr(ex?.message || 'Failed to create row.');
    } finally {
      setBusy(false);
    }
  }, [form, onCreate]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Add Row</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-slate-800 rounded"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Readonly heading so employees can’t change it */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
            <input
              type="text"
              value={heading}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter a title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter a description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              name="content"
              rows={3}
              value={form.content}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter content"
            />
          </div>

          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
            >
              {busy ? 'Creating…' : 'Create Row'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
