import React from 'react';
import { Folder, List, ArrowRight } from 'lucide-react';

// Optional: custom comparator if the parent can’t stabilize onClick
const propsAreEqual = (prev, next) => {
  return (
    prev.heading === next.heading &&
    prev.taskCount === next.taskCount &&
    prev.onClick === next.onClick
  );
};

const HeadingCard = React.memo(({ heading, taskCount, onClick }) => {
  const label = heading || 'Uncategorized Tasks';
  const count = Number.isFinite(taskCount) ? Math.max(0, taskCount) : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out p-6 cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      aria-label={`${label} (${count} ${count === 1 ? 'Task' : 'Tasks'})`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Folder className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            {label}
          </h3>
        </div>

        {/* Body */}
        <div className="flex-grow mb-6">
          <div className="flex items-center gap-2 text-slate-500">
            <List className="w-4 h-4" />
            <span className="text-md font-medium">
              {count} {count === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-end text-blue-600">
          <span className="text-sm font-semibold group-hover:underline">View Tasks</span>
          <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}, propsAreEqual);

HeadingCard.displayName = 'HeadingCard';
export default HeadingCard;


