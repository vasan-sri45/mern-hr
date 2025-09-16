import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { createTableEntry } from '../../../store/slices/table/tableSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const ROLES = { ADMIN: 'admin', EMPLOYEE: 'employee' };

const CreateTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const isAdmin = useMemo(() => currentUser?.user?.role === ROLES.ADMIN, [currentUser]);

  const [formData, setFormData] = useState({
    heading: '',
    title: '',
    description: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const title = (formData.title || '').trim();
    const description = (formData.description || '').trim();
    const content = (formData.content || '').trim();
    if (!title || !description || !content) {
      return 'Please fill in all required fields.';
    }
    return '';
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    const payload = {
      heading: (formData.heading || '').trim(),
      title: (formData.title || '').trim(),
      description: (formData.description || '').trim(),
      content: (formData.content || '').trim(),
    };

    try {
      setSubmitting(true);
      // unwrap to throw on rejected; ensures we only navigate on success
      await dispatch(createTableEntry(payload)).unwrap();
      navigate('/table');
    } catch (ex) {
      // ex.message may come from the API service error normalization
      setFormError(ex?.message || 'Failed to create entry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Optional: lock the page for non-admins; comment out if employees are allowed.
  // if (!isAdmin) {
  //   return <Navigate to="/table" replace />;
  // }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Create a New Table Entry</h3>

      {formError ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="table-heading" className="block text-sm font-medium text-slate-700 mb-1">Heading</label>
          <input
            id="table-heading"
            name="heading"
            type="text"
            value={formData.heading}
            onChange={handleChange}
            placeholder="Enter a heading (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="table-title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            id="table-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for the entry"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="table-description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            id="table-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a detailed description..."
            rows="4"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="table-content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea
            id="table-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter the main content..."
            rows="4"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {submitting ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTable;
