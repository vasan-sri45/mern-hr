import { useDispatch } from "react-redux";

const FolderCard = memo(function FolderCard({ f }) {
  const dispatch = useDispatch

  const onDelete = useCallback((e) => {
    e.stopPropagation();
    const ok = window.confirm(`Delete "${f.title || 'this folder'}"?`);
    if (!ok) return;
    dispatch(deleteTask(f._id || f.id));
  }, [dispatch, f]);

  return (
    <li className="group relative border border-slate-200 rounded-lg bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-red-600/90 bg-white/70 backdrop-blur shadow-sm border border-slate-200 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Delete folder"
          title="Delete"
        >
          <TrashIcon className="w-4 h-4" aria-hidden="true" />
        </button>
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
                      href={cloudinaryAttachmentUrl(doc.url, cleanFilename)}
                      download={cleanFilename}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                      title={`Download ${doc.originalName}`}
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

export default FolderCard;