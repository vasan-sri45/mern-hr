import React, { useEffect, useMemo, useState, memo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listTasks,
  deleteTask,
  updateFolder,
  createTask
} from '../../../store/slices/folder/folderSlice';
import { FileText } from 'lucide-react'; // Assuming lucide-react is installed
import { selectCurrentUser } from '../../../store/slices/authSlice';

// --- Icon Components ---
const SearchIcon = ({ className = 'w-4 h-4 text-slate-400' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 2a8 8 0 1 0 4.9 14.4l4.35 4.35a1 1 0 1 0 1.42-1.42l-4.35-4.35A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12A6 6 0 0 1 10 4Z" />
  </svg>
);
const FolderGlyph = ({ className = 'w-6 h-6 text-blue-500' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10.59 4.59A2 2 0 0 0 9.17 4H4a2 2 0 0 0-2 2v1h20a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8h.01L2 6a2 2 0 0 1 2-2h5.17c.53 0 1.04.21 1.41.59l1.83 1.82H22a1 1 0 1 1 0 2H2" />
  </svg>
);
const DownloadIcon = ({ className = 'w-4 h-4 text-slate-400' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4.001 4a1 1 0 0 1-1.412 0l-4.001-4a1 1 0 1 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1Z" />
    <path d="M5 15a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 1 1 2 0v2h12v-2a1 1 0 0 1 1-1H5Z" />
  </svg>
);
const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 3a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h1v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-4V4a1 1 0 0 0-1-1H9Zm1 4h4v12h-4V7Z" />
  </svg>
);
const EditIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
  </svg>
);

// --- Utility Functions ---
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString();
};

function cloudinaryAttachmentUrl(url, filename) {
  if (!url || !url.includes('/upload/')) return url;
  const safeFilename = encodeURIComponent(filename || 'download');
  return url.replace('/upload/', `/upload/fl_attachment:${safeFilename}/`);
}

function sanitizeFilename(name) {
  return (name || '').replace(/[^a-zA-Z0-9._-]/g, '_');
}

// --- Reusable Form Component ---
// const FolderForm = ({ onSubmit, initialData = null }) => {
//   const [title, setTitle] = useState(initialData?.title || '');
//   const [files, setFiles] = useState([]);
//   const [fileName, setFileName] = useState('');
//   const fileRef = useRef(null);
//   const isUpdateMode = Boolean(initialData);

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();
//     const fd = new FormData();
//     fd.append('title', title);
//     files.forEach(f => fd.append('document', f));
//     onSubmit({ formData: fd, id: initialData?._id });
//   }, [title, files, onSubmit, initialData]);

//   const handleFilesChange = useCallback((e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles(selectedFiles);
//     setFileName(selectedFiles.map(f => f.name).join(', '));
//   }, []);

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="folder-title" className="text-sm font-medium text-slate-700">Title</label>
//         <input
//           id="folder-title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           required
//         />
//       </div>
//       <div>
//         <label className="text-sm font-medium text-slate-700">
//           {isUpdateMode ? "Add More Documents" : "Upload Documents"}
//         </label>
//         <label className="mt-1 flex items-center space-x-2 px-3 py-2 h-10 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
//           <FileText className="w-4 h-4 text-slate-500" />
//           <span className="text-slate-600 truncate">{fileName || 'Select file(s)...'}</span>
//           <input
//             ref={fileRef}
//             type="file"
//             onChange={handleFilesChange}
//             multiple
//             className="hidden"
//           />
//         </label>
//       </div>
//       <div className="flex justify-end gap-3">
//         <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">
//           {isUpdateMode ? 'Update Folder' : 'Create Folder'}
//         </button>
//       </div>
//     </form>
//   );
// };

// FolderForm (drop-in, with replace toggle)
const FolderForm = ({ onSubmit, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [replace, setReplace] = useState(false);          // NEW
  const fileRef = useRef(null);
  const isUpdateMode = Boolean(initialData);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);                             // scalar field
    fd.append('replaceDocuments', String(replace));        // NEW flag
    files.forEach((f) => fd.append('document', f, f.name)); // key matches upload.fields/array
    onSubmit({ formData: fd, id: initialData?._id });
  }, [title, files, replace, onSubmit, initialData]);

  const handleFilesChange = useCallback((e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setFileName(selected.map((f) => f.name).join(', '));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="folder-title" className="text-sm font-medium text-slate-700">Title</label>
        <input
          id="folder-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          {isUpdateMode ? 'Add More Documents' : 'Upload Documents'}
        </label>
        <label className="mt-1 flex items-center space-x-2 px-3 py-2 h-10 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 truncate">{fileName || 'Select file(s)...'}</span>
          <input
            ref={fileRef}
            type="file"
            onChange={handleFilesChange}
            multiple
            className="hidden"
          />
        </label>
      </div>

      {isUpdateMode && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={replace}
            onChange={(e) => setReplace(e.target.checked)}
          />
          Replace existing documents instead of appending
        </label>
      )}

      <div className="flex justify-end gap-3">
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">
          {isUpdateMode ? 'Update Folder' : 'Create Folder'}
        </button>
      </div>
    </form>
  );
};


// --- Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto relative shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// --- FolderCard Component ---
const FolderCard = memo(function FolderCard({ f, onEdit, canDelete }) {
  const dispatch = useDispatch();
  // const onDelete = useCallback((e) => {
  //   e.stopPropagation();
  //   if (window.confirm(`Delete "${f.title || 'this folder'}"?`)) {
  //     dispatch(deleteTask(f._id));
  //   }
  // }, [dispatch, f]);
   const onDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${f.title || 'this folder'}"?`)) {
      dispatch(deleteTask(f._id)); // keep as-is
    }
  }, [dispatch, f]);

  return (
    <li className="group relative border border-slate-200 rounded-lg bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(f)}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-blue-600/90 bg-white/70 backdrop-blur shadow-sm border border-slate-200 transition opacity-0 group-hover:opacity-100"
            aria-label="Edit folder"
            title="Edit"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          {/* <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-red-600/90 bg-white/70 backdrop-blur shadow-sm border border-slate-200 transition opacity-0 group-hover:opacity-100"
            aria-label="Delete folder"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button> */}
          {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-red-600/90 bg-white/70 backdrop-blur shadow-sm border border-slate-200 transition opacity-0 group-hover:opacity-100"
            aria-label="Delete folder"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button> 
        )}
        </div>
        <div className="flex items-start gap-3 mb-4">
          <FolderGlyph className="w-6 h-6 text-blue-500" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">{f.title || 'Untitled Folder'}</p>
            {f.assignedTo?.name && <p className="text-xs text-slate-500">Assigned to {f.assignedTo.name}</p>}
          </div>
        </div>
        {Array.isArray(f.documents) && f.documents.length > 0 && (
          <div className="border-t border-slate-200 pt-3">
            <h3 className="text-xs font-semibold text-slate-500 mb-2">Documents</h3>
            <ul className="space-y-2">
              {f.documents.map((doc) => {
                const cleanFilename = sanitizeFilename(doc.originalName);
                return (
                  <li key={doc.publicId || doc.url} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                    <span className="truncate text-sm text-slate-800 w-2/3">{doc.originalName}</span>
                    <a
                      href={doc.url}
                      download={cleanFilename}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-blue-100"
                      title={`Download ${doc.url}`}
                    >
                      <DownloadIcon className="w-4 h-4 text-slate-500" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 text-xs text-slate-500">
        <span>{formatDate(f.createdAt) || formatDate(f.updatedAt) || '—'}</span>
      </div>
    </li>
  );
});

// --- Main FolderView Component ---
const FolderView = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.folder);
  const [q, setQ] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === 'admin';

  useEffect(() => {
    dispatch(listTasks());
  }, [dispatch]);

  const handleOpenModal = (folder = null) => {
    setSelectedFolder(folder);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFolder(null);
  };

const handleSubmit = useCallback(({ formData, id }) => {
  const action = id ? updateFolder({ id, formData }) : createTask(formData);
  dispatch(action)
    .unwrap()
    .then((payload) => {
      alert(payload?.message || (id ? 'Folder updated successfully' : 'Folder created successfully'));
      handleCloseModal();
      dispatch(listTasks());
    })
    .catch((err) => {
      alert(err?.message || 'Failed to save folder');
    });
}, [dispatch, handleCloseModal]);



  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items || [];
    return (items || []).filter((f) =>
      (f.title || '').toLowerCase().includes(query) ||
      (f.assignedTo?.name || '').toLowerCase().includes(query)
    );
  }, [items, q]);

  if (loading && !items.length) return <p className="text-center text-slate-600">Loading folders...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error.message || 'Failed to load folders.'}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Folders</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
        >
          Create New Folder
        </button>
      </div>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search folders..."
          className="w-full sm:w-80 pl-9 pr-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredItems.length === 0 ? (
        <p className="text-center text-slate-600">No folders found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* {filteredItems.map((f) => <FolderCard key={f._id} f={f} onEdit={handleOpenModal} />)} */}
          {filteredItems.map((f) => (
    <FolderCard key={f._id} f={f} onEdit={handleOpenModal} canDelete={isAdmin} />
  ))}
        </ul>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">{selectedFolder ? 'Edit Folder' : 'Create Folder'}</h2>
        <FolderForm 
          initialData={selectedFolder} 
          onSubmit={handleSubmit} 
        />
      </Modal>

      

    </div>
  );
};

export default FolderView;


