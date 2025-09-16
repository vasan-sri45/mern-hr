// components/EmployeeForm.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit, Save, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPersonalInfo,
  submitPersonalInfo,
  updatePersonalInfo,
} from '../../../store/slices/personal/personalSlice';

// Helper: safe date -> yyyy-mm-dd
const toInputDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

// Reusable input
const FormField = ({ id, label, value, readOnly, onChange, type = 'text', placeholder }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      id={id}
      type={type}
      value={value ?? ''} // prevent uncontrolled warnings
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none 
                  ${!readOnly ? 'focus:ring-2 focus:ring-orange-500' : 'cursor-default text-gray-700'}`}
    />
  </div>
);

const EmployeeForm = () => {
  const dispatch = useDispatch();
  const { status, error, data } = useSelector((state) => state.personalInfo);

  // 'view' | 'edit' | 'create'
  const [formMode, setFormMode] = useState('view');
  const [formData, setFormData] = useState({});

  // Fetch once when idle
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPersonalInfo());
    }
  }, [dispatch, status]);

  // Sync local form state when store updates
  useEffect(() => {
    if (status === 'succeeded') {
      if (data && Object.keys(data).length) {
        setFormData({ ...data, dob: toInputDate(data.dob) });
        setFormMode('view');
      } else {
        setFormData({});
        setFormMode('create');
      }
    }
    if (status === 'failed') {
      // If fetch failed initially, allow create mode
      setFormMode('create');
    }
  }, [data, status]);

  const isEditable = formMode === 'edit' || formMode === 'create';

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEditClick = useCallback(() => setFormMode('edit'), []);
  const handleCancelClick = useCallback(() => {
    const fallback = data ? { ...data, dob: toInputDate(data.dob) } : {};
    setFormData(fallback);
    setFormMode(data && Object.keys(data).length ? 'view' : 'create');
  }, [data]);

  const handleSubmit = useCallback(() => {
    const payload = {
      ...formData,
      // If dob is '', let backend decide; otherwise pass as is (yyyy-mm-dd)
      dob: formData.dob || null,
    };
    if (formMode === 'edit') {
      dispatch(updatePersonalInfo(payload));
    } else {
      dispatch(submitPersonalInfo(payload));
    }
  }, [dispatch, formData, formMode]);

  const isBusy = status === 'loading';

  if (status === 'loading' && formMode !== 'edit' && formMode !== 'create') {
    return <p className="text-center p-8 text-gray-500">Loading your information...</p>;
  }

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
            <div className="w-12 h-1 bg-orange-500 rounded"></div>
          </div>
          {formMode === 'view' && (
            <button
              type="button"
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="name" label="Name" value={formData.name} readOnly={!isEditable}
              onChange={(e) => handleInputChange('name', e.target.value)} />
            <FormField id="dob" label="Date of Birth" type="date" value={formData.dob} readOnly={!isEditable}
              onChange={(e) => handleInputChange('dob', e.target.value)} />
            <FormField id="parentName" label="Parent's Name" value={formData.parentName} readOnly={!isEditable}
              onChange={(e) => handleInputChange('parentName', e.target.value)} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="emergencyContactPerson" label="Emergency Contact Person" value={formData.emergencyContactPerson} readOnly={!isEditable}
              onChange={(e) => handleInputChange('emergencyContactPerson', e.target.value)} />
            <FormField id="emergencyContactNumber" label="Emergency Contact Number" value={formData.emergencyContactNumber} readOnly={!isEditable}
              onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)} />
            <FormField id="qualification" label="Qualification" value={formData.qualification} readOnly={!isEditable}
              onChange={(e) => handleInputChange('qualification', e.target.value)} />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="department" label="Department" value={formData.department} readOnly={!isEditable}
              onChange={(e) => handleInputChange('department', e.target.value)} />
            <FormField id="aadharNumber" label="Aadhar Number" value={formData.aadharNumber} readOnly={!isEditable}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value)} />
            <FormField id="panNumber" label="PAN Number" value={formData.panNumber} readOnly={!isEditable}
              onChange={(e) => handleInputChange('panNumber', e.target.value)} />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="bankAccountNumber" label="Bank Account Number" value={formData.bankAccountNumber} readOnly={!isEditable}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)} />
            <FormField id="bankName" label="Bank Name" value={formData.bankName} readOnly={!isEditable}
              onChange={(e) => handleInputChange('bankName', e.target.value)} />
            <FormField id="bankBranch" label="Bank Branch" value={formData.bankBranch} readOnly={!isEditable}
              onChange={(e) => handleInputChange('bankBranch', e.target.value)} />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="uanNumber" label="UAN Number" value={formData.uanNumber} readOnly={!isEditable}
              onChange={(e) => handleInputChange('uanNumber', e.target.value)} />
          </div>

          {isEditable && (
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6">
              {formMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isBusy}
                >
                  <XCircle size={16} /> Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isBusy}
                className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
              >
                <Save size={16} />
                {isBusy ? 'Saving...' : (formMode === 'create' ? 'Submit' : 'Save Changes')}
              </button>
            </div>
          )}

          {status === 'failed' && error && (
            <p className="text-red-600 mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;


