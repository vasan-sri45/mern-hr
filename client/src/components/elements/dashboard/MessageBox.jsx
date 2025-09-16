import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, X } from 'lucide-react';
import {
  fetchMessages,
  markMessageAsRead,
  clearMessages,
} from '../../../store/slices/message/messageSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import CreateMessageForm from './CreateMessageForm';

const truncateText = (text, maxLength = 120) => {
  if (!text || typeof text !== 'string') return 'No content available.';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const MessageBox = () => {
  const dispatch = useDispatch();
  const { items: messages = [], status, error } = useSelector((state) => state.messages);
  const currentUser = useSelector(selectCurrentUser);

  const isAdmin = useMemo(() => currentUser?.user?.role === 'admin', [currentUser]);
  const hasMessages = messages && messages.length > 0;

  // Reset on user change, then fetch for the new user
  useEffect(() => {
    dispatch(clearMessages());
    if (currentUser) {
      dispatch(fetchMessages());
    }
  }, [currentUser, dispatch]);

  const handleDismiss = (messageId) => {
    if (!messageId) return;
    dispatch(markMessageAsRead(messageId));
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="text-center p-4" aria-live="polite">
        Loading messages...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 mb-3">
          {typeof error === 'string' ? error : 'Could not fetch messages.'}
        </p>
        <button
          type="button"
          onClick={() => currentUser && dispatch(fetchMessages())}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {isAdmin && <CreateMessageForm />}

      {hasMessages ? (
        messages.map((message) => {
          const id = message?._id;
          const title = message?.title || 'Untitled';
          const content = message?.content || '';

          return (
            <div
              key={id}
              className="rounded-xl p-6 shadow-sm flex gap-4 transition-all border-l-4 border-transparent hover:shadow-md w-full bg-white mb-4"
            >
              <div className="flex-shrink-0 text-slate-500 w-6 h-6 flex items-center justify-center mt-1">
                <Mail size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                    {title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleDismiss(id)}
                    title="Dismiss message"
                    aria-label="Dismiss message"
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-slate-500 mb-4 leading-relaxed break-words">
                  {truncateText(content)}
                </p>

                {/* TODO: Wire this to a modal/route if you support full view */}
                <button
                  type="button"
                  className="bg-transparent border-none text-slate-500 cursor-pointer font-medium transition-colors p-2 min-h-[44px] flex items-center hover:text-[#FF6B35]"
                >
                  Read Details →
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-8 text-slate-500">
          <h3 className="font-semibold text-lg">No New Messages</h3>
          <p>You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
