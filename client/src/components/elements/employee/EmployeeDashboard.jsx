import EmployeeSidebar from './EmployeeSidebar';
import EmployeeForm from './EmployeeForm';

function EmployeeDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Page title for accessibility (visually hidden if not needed) */}
        <h1 className="sr-only">Employee Dashboard</h1>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar (profile card) */}
          <section aria-labelledby="employee-profile" className="lg:col-span-1">
            <h2 id="employee-profile" className="sr-only">Employee Profile</h2>
            <EmployeeSidebar />
          </section>

          {/* Main content (personal information form) */}
          <main aria-labelledby="personal-info" className="lg:col-span-3">
            <h2 id="personal-info" className="sr-only">Personal Information</h2>
            <EmployeeForm />
          </main>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
