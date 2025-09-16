import React, { useMemo, useCallback, useState } from 'react';
import { FileText, Calendar, Edit, Trash2, User, CheckSquare, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteTableEntry } from '../../../store/slices/table/tableSlice';

const TableCard = React.memo(({ task, onEdit }) => {
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const formattedDate = useMemo(() => {
    const d = task?.createdAt ? new Date(task.createdAt) : null;
    return d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '';
  }, [task?.createdAt]);

  const statusStyles = useMemo(() => {
    const s = task?.status || '';
    if (s === 'Completed') return 'bg-green-100 text-green-800';
    if (s === 'In Progress') return 'bg-blue-100 text-blue-800';
    if (s === 'Open' || s === 'Pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-slate-100 text-slate-700';
  }, [task?.status]);

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    setErr('');
    if (!window.confirm(`Delete "${task?.title || 'this task'}"?`)) return;
    try {
      setBusy(true);
      await dispatch(deleteTableEntry(task._id)).unwrap?.() ?? dispatch(deleteTableEntry(task._id));
      // Success: slice removes from list
    } catch (ex) {
      setErr(ex?.message || 'Failed to delete.');
    } finally {
      setBusy(false);
    }
  }, [dispatch, task?._id, task?.title]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    if (onEdit) onEdit(task);
    else {
      // fallback UX if no onEdit provided
      // eslint-disable-next-line no-alert
      alert(`Editing task: ${task?.title || task?._id}`);
    }
  }, [onEdit, task]);

  const title = task?.title || 'Untitled Task';
  const desc = task?.description || 'No description provided.';
  const assignee = task?.employee_id?.name || '';

  // Note: checkList is the stored boolean in your model/slice
  const hasChecklist = !!task?.checkList;

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out p-5 flex flex-col justify-between"
      role="article"
      aria-label={title}
    >
      
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 leading-tight">
              {title}
            </h3>
          </div>
          {task?.status ? (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles}`}>
              {task.status}
            </span>
          ) : null}
        </div>

        {/* Body */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {desc}
        </p>

        {/* Meta */}
        <div className="space-y-2 text-xs text-slate-500 mb-5">
          {assignee ? (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>
                Assigned to:{' '}
                <span className="font-medium text-slate-700">{assignee}</span>
              </span>
            </div>
          ) : null}
          {hasChecklist ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="font-medium">Checklist Attached</span>
            </div>
          ) : null}
          {err ? (
            <div className="text-red-600">{err}</div>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Edit Task"
            disabled={busy}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-60"
            aria-label="Delete Task"
            disabled={busy}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

TableCard.displayName = 'TableCard';
export default TableCard;
