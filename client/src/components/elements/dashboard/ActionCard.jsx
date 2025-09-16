import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ActionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-0 flex flex-col md:flex-row justify-between items-stretch mb-12">
      {/* OVER VIEW */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:border-r border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-wide">OVER VIEW</h3>
        <button
          type="button"
          onClick={() => navigate('/overview')}
          className="mt-2 text-slate-500 font-medium flex items-center gap-2 group hover:text-[#FF6B35] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B35] rounded-md px-2 py-1"
          aria-label="View overview"
        >
          <span>View</span>
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ATTENDANCE */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:border-r border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-wide">ATTENDANCE</h3>
        <button
          type="button"
          onClick={() => navigate('/attendance')}
          className="mt-2 text-slate-500 font-medium flex items-center gap-2 group hover:text-[#FF6B35] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B35] rounded-md px-2 py-1"
          aria-label="View attendance"
        >
          <span>View</span>
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* PAYSLIP */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-wide">PAYSLIP</h3>
        <button
          type="button"
          onClick={() => {/* TODO: navigate('/payslip') when route exists */}}
          className="mt-2 text-slate-500 font-medium flex items-center gap-2 group hover:text-[#FF6B35] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B35] rounded-md px-2 py-1"
          aria-label="View payslip"
        >
          <span>View</span>
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
