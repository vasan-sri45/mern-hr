import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  fetchTicketById,
  updateTicketStatus,
} from '../../../store/slices/ticket/ticketSlice';
import {
  User,
  Calendar,
  Tag,
  MessageSquare,
  Building,
  ArrowLeft,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { selectCurrentUser } from '../../../store/slices/authSlice';

// Small presentational helper
const DetailItem = ({ icon, label, children }) => (
  <div>
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-gray-800 text-base ml-7">{children}</div>
  </div>
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'in progress':
      return 'text-purple-600 bg-purple-100';
    case 'resolved':
      return 'text-blue-600 bg-blue-100';
    case 'closed':
      return 'text-gray-600 bg-gray-100';
    case 'open':
    default:
      return 'text-red-600 bg-red-100';
  }
};

const TicketDetailCard = () => {
  const dispatch = useDispatch();
  const { ticketId } = useParams();

  const { singleTicket: ticket, singleStatus, error, status: listStatus } = useSelector(
    (state) => state.tickets
  );
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ status: '', remark: '' });

  // Fetch if not present or mismatched id
  useEffect(() => {
    if (ticketId && (!ticket || ticket?._id !== ticketId)) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [dispatch, ticketId, ticket]);

  // When ticket loads or changes, prime the edit form
  useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status ?? 'Open',
        remark: ticket.remark ?? '',
      });
    }
  }, [ticket]);

  // Track whether an update is in-flight using listStatus as a simple signal;
  // if you keep a dedicated updateStatus in the slice, switch to that selector here.
  const isSaving = listStatus === 'loading';

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (!ticketId) return;
    // Only dispatch if something changed
    if (
      formData.status !== ticket?.status ||
      (formData.remark ?? '') !== (ticket?.remark ?? '')
    ) {
      dispatch(updateTicketStatus({ ticketId, status: formData.status, remark: formData.remark }));
    }
    setIsEditing(false);
  }, [dispatch, ticketId, formData, ticket]);

  const handleCancel = useCallback(() => {
    setFormData({
      status: ticket?.status ?? 'Open',
      remark: ticket?.remark ?? '',
    });
    setIsEditing(false);
  }, [ticket]);

  // Loading state
  if ((singleStatus === 'loading' || singleStatus === 'idle') && !ticket) {
    return <div className="text-center p-10">Loading ticket details...</div>;
  }

  // Error / not found
  if (singleStatus === 'failed' || !ticket) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 mb-4">
          {typeof error === 'string' ? error : error?.message || 'Ticket not found.'}
        </p>
        <Link to="/overview/ticket" className="text-blue-600 hover:underline">
          Go back to tickets
        </Link>
      </div>
    );
  }

  // Derived safe values
  const createdByName = ticket?.createdBy?.name ?? '—';
  const createdByEmpId = ticket?.createdBy?.empId ? `(${ticket.createdBy.empId})` : '';
  const createdOn = ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—';
  const department = ticket?.department ?? '—';
  const statusColor = getStatusColor(ticket?.status);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/overview/ticket"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        Back to Tickets
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-500">Ticket #{ticket?.ticketNo ?? '—'}</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {ticket?.requestType ?? '—'}
              </h1>
            </div>
            {isAdmin && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
              >
                <Edit size={14} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailItem icon={<User size={16} />} label="Created By">
            {createdByName} {createdByEmpId}
          </DetailItem>

          <DetailItem icon={<Calendar size={16} />} label="Created On">
            {createdOn}
          </DetailItem>

          <DetailItem icon={<Building size={16} />} label="Department">
            {department}
          </DetailItem>

          <DetailItem icon={<Tag size={16} />} label="Status">
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                {ticket?.status ?? '—'}
              </span>
            )}
          </DetailItem>

          <div className="md:col-span-2">
            <DetailItem icon={<MessageSquare size={16} />} label="Remark">
              {isEditing ? (
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                  {ticket?.remark ?? '—'}
                </p>
              )}
            </DetailItem>
          </div>
        </div>

        {/* Footer actions */}
        {isEditing && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={isSaving}
            >
              <X size={16} /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailCard;
