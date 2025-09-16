import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTableEntry } from '../../../store/slices/table/tableSlice';
import { X } from 'lucide-react';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const EditTaskTable = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const isAdmin = useMemo(() => currentUser?.user?.role === 'admin', [currentUser]);

  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    content: task.content || '',
    checkList: task.checkList ?? false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'checkList') {
      // value from <select> is a string — convert to boolean
      setFormData((prev) => ({ ...prev, checkList: value === 'true' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      title: (formData.title || '').trim(),
      description: (formData.description || '').trim(),
      content: (formData.content || '').trim(),
      // Only include checkList if user can change it; otherwise omit
      ...(isAdmin ? { checkList: !!formData.checkList } : {}),
    };

    // Basic validation
    if (!payload.title || !payload.description || !payload.content) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(
        updateTableEntry({
          entryId: task._id,
          updateData: payload,
        })
      ).unwrap();
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-4">Edit Task</h2>

        {errorMsg ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700">
              Content
            </label>
            <textarea
              name="content"
              id="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {isAdmin && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="checkList"
                id="status"
                // Normalize to string to keep select controlled without warnings
                value={String(formData.checkList)}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="bg-slate-200 text-slate-800 px-4 py-2 rounded-md mr-2 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskTable;
