import { X, FileText } from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../../../store/slices/task/taskSlice';
import { getEmployees } from '../../../store/slices/employee/employeeSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const TaskEdit = ({ isOpen, onClose, taskToEdit , showApproval = true, showRework = true }) => {
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '', checkList: 'not_approved', status: 'pending', rework: false });
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees || []);
  const taskLoading = useSelector((state) => state.tasks.loading);
  const taskError = useSelector((state) => state.tasks.error);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;

  useEffect(() => {
    if (!isOpen) return;

    // Load employees for admin
    if (isAdmin && employees.length === 0) {
      dispatch(getEmployees());
    }

    // Populate fields
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        assignedTo: (typeof taskToEdit.assignedTo === 'object' ? taskToEdit.assignedTo._id : taskToEdit.assignedTo) || '',
        checkList: taskToEdit.checkList || 'not_approved',
        status: taskToEdit.status || 'pending',
        rework: taskToEdit.rework || false,
      });
      setFiles([]);
      setFileName(Array.isArray(taskToEdit.documents) ? taskToEdit.documents.map((d) => d.originalName).join(', ') : '');
    }

    // Body scroll lock + Esc to close
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dispatch, isOpen, isAdmin, taskToEdit, employees.length, onClose]); // backdrop/blur handled via classes [7]

  const handleFileUpload = useCallback((e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setFileName(selected.map((f) => f.name).join(', '));
  }, []);

//   const handleInputChange = useCallback((e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => {
//     if (name === 'rework') return { ...prev, rework: value === 'true' };
//     return { ...prev, [name]: value };
//   });
// }, []);

const handleInputChange = useCallback((e) => {
  const { name, value } = e.target;
  setFormData((prev) => {
    if (name === 'rework') {
      return { ...prev, rework: value === 'true' };               // keep boolean coercion
    }
    if (name === 'checkList') {
      const isApproved = value === 'approved';
      return { ...prev, checkList: value, rework: isApproved ? false : prev.rework }; // auto-clear rework on approval
    }
    return { ...prev, [name]: value };
  });
}, []);

//   const handleSubmit = useCallback(async (e) => {
//   e.preventDefault();
//   if (!formData.title || !formData.description || !formData.assignedTo) {
//     alert('Please fill out all required fields.');
//     return;
//   }
//   const data = new FormData();
//   data.append('title', formData.title);
//   data.append('description', formData.description);
//   data.append('assignedTo', formData.assignedTo);
//   data.append('checkList', formData.checkList);
//   data.append('status', formData.status);
//   data.append('rework', String(formData.rework)); // ensure backend receives it
//   for (const f of files) data.append('document', f);

//   try {
//     await dispatch(updateTask({ taskId: taskToEdit._id, taskData: data })).unwrap();
//     onClose();
//   } catch (err) {
//     if (err?.name === 'CanceledError') {
//       alert('Request was canceled. Please try again.');
//     } else if (err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message || '')) {
//       alert('Network slow or server busy. Upload timed out. Please retry.');
//     } else {
//       alert(err?.response?.data?.message || err?.message || 'Failed to update task');
//     }
//   }
// }, [dispatch, formData, files, onClose, taskToEdit]);

const handleSubmit = useCallback(async (e) => {
  e.preventDefault();
  if (!formData.title || !formData.description || !formData.assignedTo) {
    alert('Please fill out all required fields.');
    return;
  }
  // const data = new FormData();
  // data.set('title', formData.title);
  // data.set('description', formData.description);
  // data.set('assignedTo', formData.assignedTo);
  // data.set('checkList', formData.checkList);
  // data.set('status', formData.status);
  // // Force rework=false if approved
  // const reworkToSend = formData.checkList === 'approved' ? 'false' : String(formData.rework);
  // data.set('rework', reworkToSend);

  // for (const f of files) data.append('document', f); // keep append for multi-file inputs

  const data = new FormData();
data.set('title', formData.title);
data.set('description', formData.description);
data.set('assignedTo', formData.assignedTo);
data.set('checkList', formData.checkList);
data.set('status', formData.status);
// Force rework=false if approved
const reworkToSend = formData.checkList === 'approved' ? 'false' : String(formData.rework);
data.set('rework', reworkToSend);
// keep append for multi-file
for (const f of files) data.append('document', f);

  try {
    await dispatch(updateTask({ taskId: taskToEdit._id, taskData: data })).unwrap();
    onClose();
  } catch (err) {
    if (err?.name === 'CanceledError') {
      alert('Request was canceled. Please try again.');
    } else if (err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message || '')) {
      alert('Network slow or server busy. Upload timed out. Please retry.');
    } else {
      alert(err?.response?.data?.message || err?.message || 'Failed to update task');
    }
  }
}, [dispatch, formData, files, onClose, taskToEdit]);


  if (!isOpen || !taskToEdit) return null;

  const canShowApproval = isAdmin && showApproval; // admin-only gate
  const canShowRework = isAdmin && showRework;                 // kept hidden in this route

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0
        bg-black/50 backdrop-blur-md transition-opacity
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop click closes
      }}
    >
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto relative overflow-y-auto max-h-[90vh] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 id="edit-task-title" className="text-base sm:text-lg font-semibold text-orange-600">Edit Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Assign to: admin only */}
          {isAdmin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Assign to</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full border rounded p-2 text-xs sm:text-sm" required>
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Approval</label>
            <select name="checkList" value={formData.checkList} onChange={handleInputChange} className="w-full border rounded p-2 text-xs sm:text-sm" required>
              <option value="not_approved">Not Approved</option>
              <option value="approved">Approved</option>
            </select>
          </div> */}

           {/* {showApproval && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Approval</label>
            <select
              name="checkList"
              value={formData.checkList}
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-xs sm:text-sm"
              required
            >
              <option value="not_approved">Not Approved</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        )} */}

              {canShowApproval && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Approval</label>
          <select
            name="checkList"
            value={formData.checkList}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs sm:text-sm"
            required
          >
            <option value="not_approved">Not Approved</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Task Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded p-2 text-xs sm:text-sm" required>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

         {/* <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rework</label>
          <select
            name="rework"
            value={String(formData.rework)}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs sm:text-sm"
            required
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div> */}

         {/* {showRework && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rework</label>
            <select
              name="rework"
              value={String(formData.rework)}
              onChange={handleInputChange}
              className="w-full border rounded p-2 text-xs sm:text-sm"
              required
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )} */}

         {/* {canShowRework && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rework</label>
          <select
            name="rework"
            value={String(formData.rework)}
            onChange={handleInputChange}
            className="w-full border rounded p-2 text-xs sm:text-sm"
            required
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      )} */}

      {canShowRework && (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rework</label>
    <select
      name="rework"
      value={String(formData.rework)}
      onChange={handleInputChange}
      className="w-full border rounded p-2 text-xs sm:text-sm"
      required
      disabled={formData.checkList === 'approved'}
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  </div>
)}


          <div>
            <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 truncate">{fileName || 'Upload new document(s)'}</span>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            </label>
          </div>

          {taskError && <div className="text-sm text-red-600 font-medium">{taskError.message || 'An error occurred'}</div>}

          <div className="flex justify-end pt-3">
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700" disabled={taskLoading}>
              {taskLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;
