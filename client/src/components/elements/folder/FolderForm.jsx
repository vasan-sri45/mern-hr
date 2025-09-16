import React, { useCallback, useRef, useState } from 'react';
import { FileText } from 'lucide-react'; // Assuming lucide-react is installed

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export default function FolderForm({
  onFilesChange,
  onTitleChange,
  onSubmit,
  allowFolder = true,
  multiple = true,
  accept, // This prop will receive the file types string
}) {
  const [title, setTitle] = useState('');
  const [fileError, setFileError] = useState('');
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);

  const filterByMaxSize = useCallback((files) => {
    return files.filter((f) => f.size <= MAX_BYTES);
  }, []);

  const formatBytes = useCallback((bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }, []);

  const handleTitleChange = useCallback((e) => {
    const val = e.target.value || '';
    setTitle(val);
    onTitleChange?.(val);
  }, [onTitleChange]);

  const handleFilesChange = useCallback((e) => {
    const picked = Array.from(e.target.files || []);
    const valid = filterByMaxSize(picked);

    if (picked.length && valid.length !== picked.length) {
      setFileError(`Each file must be no larger than ${formatBytes(MAX_BYTES)}; oversized files were ignored.`);
    } else {
      setFileError('');
    }

    setFiles(valid);
    setFileName(valid.map((f) => f.name).join(', '));
    onFilesChange?.(valid);
  }, [filterByMaxSize, formatBytes, onFilesChange]);

  const handleClear = useCallback(() => {
    setTitle('');
    setFiles([]);
    setFileName('');
    if (fileRef.current) fileRef.current.value = null;
    setFileError('');
    onTitleChange?.('');
    onFilesChange?.([]);
  }, [onFilesChange, onTitleChange]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!files.length) {
      setFileError(`Please select at least one file.`);
      return;
    }

    setFileError('');
    const fd = new FormData();
    fd.append('title', title);
    files.forEach((f) => fd.append('document', f, f.name));
    onSubmit?.({ formData: fd });

    handleClear();
  }, [files, onSubmit, title, handleClear]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="folder-title" className="text-xs font-semibold text-slate-600">Title</label>
          <input
            id="folder-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-200/60"
            required
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="folder-input" className="text-xs font-semibold text-slate-600">
            {allowFolder ? 'Upload Document(s) or Folder' : 'Upload Document(s)'} — Max 10 MB each
          </label>
          <label className="flex items-center space-x-2 px-3 py-2 h-10 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 truncate">{fileName || 'Select file(s)...'}</span>
            <input
              ref={fileRef}
              id="folder-input"
              type="file"
              onChange={handleFilesChange}
              multiple={multiple}
              accept={accept}
              className="hidden"
              {...(allowFolder ? { webkitdirectory: '', directory: '' } : {})}
            />
          </label>
          {fileError && <p className="text-xs text-red-600">{fileError}</p>}
        </div>
      </div>
      <div className="mt-1 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-300 active:translate-y-px"
        >
          Clear
        </button>
        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 active:translate-y-px"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
