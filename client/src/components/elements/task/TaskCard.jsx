import React from 'react';
import { Eye, Trash2 } from 'lucide-react'; // removed Edit
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { useSelector } from 'react-redux';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const TaskCard = ({
  title,
  description,
  status = 'assigned',
  assignedTo,
  dueDate,
  onClick,
  onView,      // opens view/modal
  onDelete,    // admin-only
  deleting,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'rework': return 'border-yellow-500';
      case 'completed': return 'border-green-500';
      default: return 'border-orange-500';
    }
  };

  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getStatusColor()} hover:shadow-md transition-shadow flex flex-col justify-between min-h-[200px]`}>
      <div className="overflow-hidden" onClick={onClick} style={{ cursor: 'pointer' }}>
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate" title={title}>{title}</h3>
        {dueDate && <p className="text-xs text-gray-500 mb-2">{dueDate}</p>}
        <p className="text-xs sm:text-sm text-gray-700 mb-4 break-words"><strong>Work:</strong> {description}</p>
        <p className="text-xs sm:text-sm text-gray-700 mb-4 break-words"><strong>Name:</strong> {assignedTo}</p>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-gray-100 mt-2 space-x-2">
        <button
          onClick={onView || onClick}
          className="flex items-center space-x-1 px-3 py-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-md hover:bg-blue-100"
          aria-label="View task details"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>

        {isAdmin && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md ${deleting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

