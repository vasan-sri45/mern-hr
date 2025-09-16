import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const TaskCards = () => {
  const { taskID } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const currentUser = useSelector(selectCurrentUser);

  const task = useMemo(() => {
    return tasks?.find(t => String(t._id) === String(taskID) || String(t.id) === String(taskID));
  }, [tasks, taskID]);

  if (loading) return <div className="flex justify-center items-center min-h-40">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!task) return <div className="text-gray-500 text-center py-8">Task not found</div>;

  const userId = currentUser?.user?._id;
  const isAdmin = currentUser?.user?.role === ROLES.ADMIN;
  const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo;
  const isOwner = userId && assignedId && String(userId) === String(assignedId);
  const canEdit = isAdmin || isOwner;

  return (
    <div className="max-w-md w-full mx-auto mt-8 p-4 bg-white rounded-lg shadow-md flex flex-col items-center gap-4 sm:p-8">
      <img
        src={task.image?.url}
        alt={task.title || "Task image"}
        className="w-full max-w-xs h-48 object-cover rounded-md border mb-2 shadow-sm"
      />
      <div className="w-full text-center">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 break-words">{task.title}</h1>
        <p className="text-gray-600 text-sm sm:text-base break-words">{task.description}</p>
      </div>

      {Array.isArray(task.documents) && task.documents.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-base font-semibold mb-3 text-left">Documents</h2>
          <ul className="space-y-2">
            {task.documents.map((doc) => (
              <li key={doc.url || doc._id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                <span className="truncate w-2/3">{doc.originalName}</span>
                <a
                  href={doc.url}
                  download={doc.originalName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs sm:text-sm transition-colors"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {canEdit && (
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate(`/task/edit/${task._id || task.id}`)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
          >
            Edit Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCards;
