import DepartmentDropDown from './DepartmentDropDown';
import TicketStatus from './TicketStatus';

const SupportTickets = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Create New Ticket Section */}
        <section aria-labelledby="create-ticket" className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <h2 id="create-ticket" className="text-xl md:text-2xl font-bold text-gray-900">
              Create New Ticket
            </h2>
            <div className="w-12 h-1 bg-orange-500 rounded" />
          </div>

          <DepartmentDropDown />
        </section>

        {/* Ticket List / Status Section */}
        <section aria-labelledby="ticket-status">
          <h2 id="ticket-status" className="sr-only">
            Ticket Status
          </h2>
          <TicketStatus />
        </section>
      </div>
    </div>
  );
};

export default SupportTickets;

