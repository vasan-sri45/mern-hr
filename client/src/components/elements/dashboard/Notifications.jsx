import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Megaphone, ArrowRight } from 'lucide-react';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../../store/slices/authSlice';
const Notifications = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.user.role === 'admin';

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Message from Admin */}
      <div className="rounded-xl p-6 shadow-sm flex gap-4 transition-all border-l-4 border-transparent hover:shadow-md w-full bg-white">
        <div className="flex-shrink-0 text-slate-500 w-6 h-6 flex items-center justify-center">
          <Mail size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">
            {isAdmin ? "Create New Message" : "New Message"}
          </h3>
          <p className="text-slate-500 mb-4 leading-relaxed break-words">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis interdum nulla,
            quis blandit tortor efficitur quis. Vestibulum a
          </p>
          <button
            type="button"
            onClick={() => navigate('/message')}
            aria-label="Read message from admin"
            className="bg-transparent border-none text-slate-500 cursor-pointer font-medium transition-colors p-2 min-h-[44px] flex items-center hover:text-[#FF6B35] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B35] rounded-md"
          >
            {isAdmin ? `send message`: `read message`} →
          </button>
        </div>
      </div>

      {/* Notification from Admin Team */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex gap-4 transition-all border-l-4 border-[#FF6B35] hover:shadow-md w-full">
        <div className="flex-shrink-0 text-slate-500 w-6 h-6 flex items-center justify-center">
          <Megaphone size={20} className="text-[#FF6B35]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">
            Notification from Admin Team.
          </h3>
          <p className="text-slate-500 mb-4 leading-relaxed break-words">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis interdum nulla,
            quis blandit tortor efficitur quis. Vestibulum a dolor mi. Curabitur finibus libero
            eget nibh porta pulvinar.
          </p>
          <button
            type="button"
            aria-label="Read notification from admin team"
            className="bg-transparent border-none text-slate-500 cursor-pointer font-medium transition-colors p-2 min-h-[44px] flex items-center hover:text-[#FF6B35] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B35] rounded-md"
          >
            Read →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
