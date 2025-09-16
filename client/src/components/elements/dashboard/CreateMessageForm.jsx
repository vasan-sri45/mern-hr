import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage } from '../../../store/slices/message/messageSlice';
import { getEmployees } from '../../../store/slices/employee/employeeSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

const CreateMessageForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { employees = [], status: employeesStatus, error: employeesError } = useSelector(
    (state) => state.employees
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = useMemo(() => currentUser?.user?.role === ROLES.ADMIN, [currentUser]);
  const employeeOptions = useMemo(() => (Array.isArray(employees) ? employees : []), [employees]);

  // Fetch employees only when admin opens the dropdown and list is empty
  useEffect(() => {
    if (isAdmin && filterOpen && employeesStatus !== 'loading' && employeeOptions.length === 0) {
      dispatch(getEmployees());
    }
  }, [isAdmin, filterOpen, employeeOptions.length, employeesStatus, dispatch]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setRecipient('');
    setFilterOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      alert('Please fill in both the title and content.');
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      await dispatch(
        createMessage({
          title: cleanTitle,
          content: cleanContent,
          recipientId: recipient || null, // null → send to all
        })
      ).unwrap?.();
      resetForm();
    } catch (err) {
      // Optional: show toast/alert
      console.error('Failed to send message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Create a New Message</h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="message-title" className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            id="message-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter message title"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message-content" className="block text-sm font-medium text-slate-700 mb-1">
            Content
          </label>
          <textarea
            id="message-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter message content..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            required
          />
        </div>

        {isAdmin && (
          <div>
            <label htmlFor="assign-to" className="block text-sm font-medium text-slate-700 mb-1">
              Assign to (Optional)
            </label>
            <select
              id="assign-to"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onClick={() => setFilterOpen(true)}
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Send to All Employees</option>
              {employeeOptions.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>

            {/* Inline feedback when opening dropdown */}
            {filterOpen && employeesStatus === 'loading' && (
              <p className="text-xs text-slate-500 mt-1">Loading employees…</p>
            )}
            {filterOpen && employeesStatus === 'failed' && (
              <p className="text-xs text-red-600 mt-1" aria-live="assertive">
                {typeof employeesError === 'string'
                  ? employeesError
                  : 'Failed to load employees'}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMessageForm;
 

