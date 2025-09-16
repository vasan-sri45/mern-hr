import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fetchMyTickets,
  fetchAllTickets,
  deleteTicket,
  resetTicketState,
} from '../../../store/slices/ticket/ticketSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';

const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
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

const safeDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString();
};

const TicketStatus = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { status, items: tickets = [], error } = useSelector((state) => state.tickets);
  const currentUser = useSelector(selectCurrentUser);

  // Derive a stable key representing the logged-in user
  const userKey = useMemo(
    () => currentUser?.user?._id || currentUser?.user?.email || null,
    [currentUser]
  );
  const isAdmin = useMemo(() => currentUser?.user?.role === 'admin', [currentUser]);

  // Reset and fetch when user identity changes
  useEffect(() => {
    if (!userKey) {
      dispatch(resetTicketState());
      return;
    }
    // Clear previous user's list then fetch for the new identity
    dispatch(resetTicketState());
    if (isAdmin) {
      dispatch(fetchAllTickets());
    } else {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, userKey, isAdmin]);

  const onDelete = useCallback(
    (ticketId, ticketNo) => {
      if (
        window.confirm(
          `Are you sure you want to permanently delete ticket ${ticketNo || ''}?`
        )
      ) {
        dispatch(deleteTicket(ticketId));
      }
    },
    [dispatch]
  );

  const filteredTickets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) => {
      const no = (t?.ticketNo ?? '').toString().toLowerCase();
      const type = (t?.requestType ?? '').toString().toLowerCase();
      const st = (t?.status ?? '').toString().toLowerCase();
      return no.includes(q) || type.includes(q) || st.includes(q);
    });
  }, [tickets, searchTerm]);

  // Loading and error states
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="text-center p-8 text-gray-500" aria-live="polite">
        Loading tickets...
      </div>
    );
  }

  if (status === 'failed' && tickets.length === 0) {
    return (
      <div className="text-center p-8 text-red-500" aria-live="assertive">
        {typeof error === 'string' ? error : 'Error fetching tickets. Please try again.'}
      </div>
    );
  }

  const desktopGridCols = 'md:grid-cols-5';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {isAdmin ? 'Manage All Tickets' : 'Your Tickets Status'}
          </h2>
          <p className="text-gray-600">
            {isAdmin
              ? 'Review and manage all submitted tickets.'
              : 'Track the status of your submitted requests.'}
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by No, Type, or Status"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Search tickets"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div
            className={`hidden md:grid ${desktopGridCols} gap-4 pb-4 border-b border-gray-200 font-medium text-gray-600`}
          >
            <div>Ticket No</div>
            <div>Request Type</div>
            <div>Date</div>
            <div>Status</div>
            <div className="text-left">Actions</div>
          </div>

          <div className="mt-4 md:mt-0 md:space-y-0">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket?._id} className="border-b border-gray-100 last:border-b-0 md:border-b">
                  {/* Mobile card */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Ticket No</div>
                        <div className="font-semibold text-gray-900">{ticket?.ticketNo ?? '—'}</div>
                      </div>
                      <div className="flex items-center gap-x-1">
                        <Link
                          to={`/overview/${ticket?._id}`}
                          className="p-2 text-gray-500 hover:text-blue-600"
                          aria-label={`View ticket ${ticket?.ticketNo ?? ''}`}
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => onDelete(ticket?._id, ticket?.ticketNo)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            aria-label={`Delete ticket ${ticket?.ticketNo ?? ''}`}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Request Type</div>
                      <div className="text-gray-800">{ticket?.requestType ?? '—'}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Date</div>
                        <div className="text-gray-800">{safeDate(ticket?.date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1 text-right">Status</div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            ticket?.status
                          )}`}
                        >
                          {ticket?.status ?? '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop row */}
                  <div className={`hidden md:grid ${desktopGridCols} gap-4 py-4 items-center`}>
                    <div className="font-semibold text-gray-900">{ticket?.ticketNo ?? '—'}</div>
                    <div className="text-gray-700">{ticket?.requestType ?? '—'}</div>
                    <div className="text-gray-700">{safeDate(ticket?.date)}</div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          ticket?.status
                        )}`}
                      >
                        {ticket?.status ?? '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Link
                        to={`/overview/${ticket?._id}`}
                        aria-label={`View ticket ${ticket?.ticketNo ?? ''}`}
                        className="flex items-center gap-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDelete(ticket?._id, ticket?.ticketNo)}
                          aria-label={`Delete ticket ${ticket?.ticketNo ?? ''}`}
                          className="flex items-center gap-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <h3 className="font-semibold text-lg">No Tickets Found</h3>
                <p className="text-sm mt-1">
                  {searchTerm
                    ? 'Your search did not match any tickets.'
                    : 'There are no tickets to display at this time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketStatus;
