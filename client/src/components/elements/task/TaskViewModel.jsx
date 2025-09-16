// src/components/elements/task/TaskViewModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const TaskViewModal = ({ isOpen, onClose, task, canEdit, onEdit }) => {
  if (!isOpen || !task) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0
        transition-opacity duration-200
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-view-title"
    >
      {/* Backdrop: black + blur */}
      <div
        className="
          absolute inset-0
          bg-black/50
          backdrop-blur-sm
        "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div className="relative bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 id="task-view-title" className="text-base sm:text-lg font-semibold text-gray-800">
            Task Details
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close dialog">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {task.image?.url && (
          <img
            src={task.image.url}
            alt={task.title || 'Task image'}
            className="w-full h-48 object-cover rounded-md border mb-3"
          />
        )}

        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 break-words">{task.title}</h3>
          <p className="text-gray-600 text-sm break-words">{task.description}</p>
        </div>

        {Array.isArray(task.documents) && task.documents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Documents</h4>
            <ul className="space-y-2">
              {task.documents.map((doc) => (
                <li key={doc.url || doc._id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <span className="truncate w-2/3">{doc.originalName}</span>
                  <a
                    href={doc.url}
                    download={doc.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs transition-colors"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Close
          </button>
          {canEdit && (
            <button onClick={onEdit} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
              Edit Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;

