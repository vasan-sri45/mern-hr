// components/DepartmentDropDown.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../../store/slices/ticket/ticketSlice';

const defaultForm = {
  department: 'Hr Department',
  requestType: 'Request Type',
  date: '',
  remark: '',
};

const DepartmentDropDown = () => {
  const dispatch = useDispatch();
  const createStatus = useSelector((s) => s.tickets.createStatus);
  const error = useSelector((s) => s.tickets.error);

  const [formData, setFormData] = useState(defaultForm);
  const [touched, setTouched] = useState(false);

  const isSubmitting = createStatus === 'loading';

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isValid = useMemo(() => {
    const hasDept = !!formData.department && formData.department !== 'Select Department';
    const hasType = !!formData.requestType && formData.requestType !== 'Request Type';
    // date optional; if provided, ensure valid yyyy-mm-dd
    const validDate = !formData.date || /^\d{4}-\d{2}-\d{2}$/.test(formData.date);
    return hasDept && hasType && validDate;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setTouched(true);
      if (!isValid || isSubmitting) return;
      dispatch(createTicket(formData));
    },
    [dispatch, formData, isValid, isSubmitting]
  );

  // Reset the form after a successful create
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setFormData(defaultForm);
      setTouched(false);
    }
  }, [createStatus]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">To Department</label>
          <div className="relative">
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option>Hr Department</option>
              <option>IT Department</option>
              <option>Finance Department</option>
              <option>Operations Department</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Request Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Select Request Type</label>
          <div className="relative">
            <select
              value={formData.requestType}
              onChange={(e) => handleInputChange('requestType', e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option>Request Type</option>
              <option>Technical Support</option>
              <option>Account Issues</option>
              <option>General Inquiry</option>
              <option>Bug Report</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
          {touched && formData.requestType === 'Request Type' && (
            <p className="text-xs text-red-600 mt-1">Please choose a request type.</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
          <div className="relative">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>

      {/* Remark */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Remark</label>
        <textarea
          value={formData.remark}
          onChange={(e) => handleInputChange('remark', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          placeholder="Write your message"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>

      {/* Inline feedback */}
      {createStatus === 'failed' && error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      {createStatus === 'succeeded' && (
        <p className="text-green-600 text-sm">Ticket submitted successfully.</p>
      )}
    </form>
  );
};

export default DepartmentDropDown;
