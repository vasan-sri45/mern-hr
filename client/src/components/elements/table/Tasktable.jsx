import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import { deleteTableEntry } from '../../../store/slices/table/tableSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import EditTaskModal from './EditTaskTable';

// --- Reusable Helper Functions ---
const truncateText = (text, maxLength = 25) => {
  if (!text) return 'N/A';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// --- Memoized Sub-Component for Mobile View ---
const MobileTaskCard = React.memo(({ task, handleView, handleEdit, handleDelete, isAdmin }) => (
  <div className="p-4">
    <div className="text-center mb-4">
      <p className="font-bold text-slate-800">{truncateText(task.title)}</p>
      <p className="text-sm text-slate-500 mt-1">{truncateText(task.description)}</p>
    </div>
    <div className="flex justify-center items-center gap-2 border-t border-slate-200 pt-3">
      <button onClick={() => handleView(task._id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200">
        <Eye size={16}/> View
      </button>
      <button onClick={() => handleEdit(task)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
        <Edit size={16}/> Edit
      </button>
      {isAdmin && (
        <button onClick={() => handleDelete(task._id, task.title)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200">
          <Trash2 size={16}/> Delete
        </button>
      )}
    </div>
  </div>
));
MobileTaskCard.displayName = 'MobileTaskCard';

// --- Memoized Sub-Component for Desktop View ---
const DesktopTaskRow = React.memo(({ task, handleView, handleEdit, handleDelete, isAdmin }) => (
  <tr className="hover:bg-slate-50">
    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{task.title}</td>
    <td className="px-6 py-4">{truncateText(task.description)}</td>
    <td className="px-6 py-4">{truncateText(task.content)}</td>
    <td className="px-6 py-4 whitespace-nowrap">{new Date(task.createdAt).toLocaleDateString()}</td>
    <td className="px-6 py-4 text-right">
      <div className="flex items-center justify-end space-x-2">
        <button onClick={() => handleView(task._id)} className="p-1 text-green-600 hover:text-green-800" title="View"><Eye size={16}/></button>
        <button onClick={() => handleEdit(task)} className="p-1 text-blue-600 hover:text-blue-800" title="Edit"><Edit size={16}/></button>
        {isAdmin && <button onClick={() => handleDelete(task._id, task.title)} className="p-1 text-red-600 hover:text-red-800" title="Delete"><Trash2 size={16}/></button>}
      </div>
    </td>
  </tr>
));
DesktopTaskRow.displayName = 'DesktopTaskRow';

// --- Main TaskTable Component ---
const TaskTable = ({ tasks }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const isAdmin = currentUser?.user?.role === 'admin';

  const handleDelete = useCallback((taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      dispatch(deleteTableEntry(taskId));
    }
  }, [dispatch]);

  const handleEdit = useCallback((task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  }, []);
  
  const handleView = useCallback((taskId) => {
    navigate(`/table/detail/${taskId}`);
  }, [navigate]);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  }, []);
  
  if (!tasks || tasks.length === 0) {
    return <div className="p-6 text-center text-slate-500 font-medium">No tasks found for this group.</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* --- Mobile Card View (Default Layout) --- */}
        <div className="divide-y divide-slate-200 md:hidden">
          {tasks.map(task => (
            <MobileTaskCard
              key={task._id}
              task={task}
              handleView={handleView}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        {/* --- Desktop Table View (Hidden on Mobile) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Content</th>
                <th scope="col" className="px-6 py-3">Created On</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tasks.map(task => (
                <DesktopTaskRow
                  key={task._id}
                  task={task}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditModalOpen && <EditTaskModal task={selectedTask} onClose={handleCloseModal} />}
    </>
  );
};

export default TaskTable;
