import React from 'react';
import PropTypes from 'prop-types';

// Optional custom comparator if parent cannot stabilize onClick with useCallback
const propsAreEqual = (prev, next) =>
  prev.label === next.label &&
  prev.isActive === next.isActive &&
  prev.onClick === next.onClick;

const TabButton = React.memo(({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-pressed={isActive}
      title={label}
      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 w-full text-left ${
        isActive
          ? 'bg-orange-600 text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}, propsAreEqual);

TabButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

TabButton.displayName = 'TabButton';
export default TabButton;
