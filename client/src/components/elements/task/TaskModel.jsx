// src/components/elements/task/TaskModal.jsx
import { X, FileText } from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, resetTaskState } from '../../../store/slices/task/taskSlice';
import { getEmployees } from '../../../store/slices/employee/employeeSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const TaskModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '' });
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { loading: taskLoading, error: taskError } = useSelector((state) => state.tasks);
  const { employees } = useSelector((state) => state.employees);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;

  // Open: fetch employees for admin, set default assignedTo for employee, lock body scroll, Esc close
  useEffect(() => {
    if (!isOpen) return;

    if (isAdmin) {
      if ((employees?.length || 0) === 0) dispatch(getEmployees());
    } else {
      setFormData(prev => ({ ...prev, assignedTo: currentUser?.user?._id || '' }));
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dispatch, isOpen, isAdmin, employees?.length, currentUser, onClose]);

  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileUpload = useCallback((e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setFileName(selected.map((f) => f.name).join(', '));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ title: '', description: '', assignedTo: isAdmin ? '' : (currentUser?.user?._id || '') });
    setFiles([]);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    dispatch(resetTaskState());
  }, [dispatch, isAdmin, currentUser]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.assignedTo) {
      alert('Please fill out all required fields.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('assignedTo', formData.assignedTo);
    for (const f of files) data.append('document', f);

    try {
      await dispatch(createTask(data)).unwrap();
      alert('Task created successfully!');
      resetForm();
      onClose();
    } catch (err) {
      if (err?.name === 'CanceledError') {
        alert('Request was canceled. Please try again.');
      } else if (err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message || '')) {
        alert('Network slow or server busy. Upload timed out. Please retry.');
      } else {
        alert(err?.response?.data?.message || err?.message || 'Failed to create task');
      }
    }
  }, [dispatch, formData, files, onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0
        bg-black/50 backdrop-blur-md transition-opacity
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-task-title"
      onMouseDown={(e) => {
        // close when clicking the backdrop only
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto relative overflow-y-auto max-h-[90vh] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 id="assign-task-title" className="text-base sm:text-lg font-semibold text-orange-600">Assign Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Assign to (admin only) */}
          {isAdmin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Assign to</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-xs sm:text-sm"
                required
              >
                <option value="">-- Select Employee --</option>
                {Array.isArray(employees) && employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 truncate">{fileName || 'Upload Document(s)'}</span>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            </label>
          </div>

          {taskError && (
            <div className="text-sm text-red-600 font-medium">
              {taskError.message || 'An error occurred.'}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={taskLoading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              disabled={taskLoading}
            >
              {taskLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
