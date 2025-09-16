import React from 'react';
// import { Routes, Route, Navigate, Outlet, ScrollRestoration, BrowserRouter } from 'react-router-dom';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import Login from './pages/Login';
import TaskCards from './components/elements/task/TaskCards';
import TaskList from './components/elements/task/TaskList';
import ApprovedTask from './components/elements/task/ApprovedTask';
import TaskLayout from './components/elements/task/TaskLayout';
import ProtectedRoute from './components/elements/protected/ProtectedRoutes';
import AttendanceCalander from './components/elements/dashboard/AttendanceCalander';
import MessageBox from './components/elements/dashboard/MessageBox';
import DocumentUpload from './components/elements/document/DocumentUpload';
import EmployeeDashboard from './components/elements/employee/EmployeeDashboard';
import SupportTickets from './components/elements/ticket/SupportTickets';
import ContentSection from './components/elements/document/ContentSection';
import OverviewLayout from './components/elements/document/OverviewLayout';
import TicketDetailCard from './components/elements/ticket/TicketDetailCard';
import Table from './components/Table';
import TableLayout from './components/elements/table/TableLayout';
import CreateTable from './components/elements/table/CreateTable';
import TaskTablePage from './components/elements/table/TaskTablePage';
import TableDetailPage from './components/elements/table/TableDetailPage';
import { selectCurrentUser } from './store/slices/authSlice';
import Navbar from './components/elements/Navbar';
import Folder from './components/Folder';
import ReworkTask from './components/elements/task/ReworkTask';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import AdminEmployeesOverview from './components/elements/taskReport/AdminEmployeesOverview';
import AppLayout from './components/elements/utility/AppLayout';
// Layout that shows Navbar only when logged in
// const AppLayout = () => {
//   const user = useSelector(selectCurrentUser);
//   return (
//     <>
//       {user ? <Navbar /> : null}
//       <Outlet />
//     </>
//   );
// };

// const App = () => {
//   return (
//     <BrowserRouter>
//     <Routes>
//       {/* Public route (no navbar) */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/forgot-password" element={<ForgotPassword/>}/>
//       <Route path="/reset-password/:token" element={<ResetPassword/>}/>
//       {/* Private area: AppLayout controls Navbar visibility */}
//       <Route element={<AppLayout />}>
//         <Route element={<ProtectedRoute />}>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/attendance" element={<AttendanceCalander />} />
//           <Route path="/task/report" element={<AdminEmployeesOverview/>}/>

//           <Route path="/overview" element={<OverviewLayout />}>
//             <Route index element={<EmployeeDashboard />} />
//             <Route path="document" element={<DocumentUpload />} />
//             <Route path="ticket" element={<SupportTickets />} />
//             <Route path="awarness" element={<ContentSection />} />
//             <Route path=":ticketId" element={<TicketDetailCard />} />
//           </Route>

//           <Route path="/message" element={<MessageBox />} />
//           <Route path='/folder' element={<Folder/>} />

//           <Route path="/task" element={<TaskLayout />}>
//             <Route index element={<Task />} />
//             <Route path="list" element={<TaskList />} />
//             <Route path="approved" element={<ApprovedTask />} />
//             <Route path=":taskId" element={<TaskCards />} />
//             <Route path='rework' element={<ReworkTask />} />
//           </Route>

//           <Route path="/table" element={<TableLayout />}>
//             <Route index element={<Table />} />
//             <Route path="create" element={<CreateTable />} />
//             <Route path=":heading" element={<TaskTablePage />} />
//             <Route path="detail/:taskId" element={<TableDetailPage />} />
//           </Route>
//         </Route>
//       </Route>
      
//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


const router = createBrowserRouter(
  createRoutesFromElements(
//       {/* Public route (no navbar) */}
<>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword/>}/>
      {/* Private area: AppLayout controls Navbar visibility */}
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attendance" element={<AttendanceCalander />} />
          <Route path="/task/report" element={<AdminEmployeesOverview/>}/>

          <Route path="/overview" element={<OverviewLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="document" element={<DocumentUpload />} />
            <Route path="ticket" element={<SupportTickets />} />
            <Route path="awarness" element={<ContentSection />} />
            <Route path=":ticketId" element={<TicketDetailCard />} />
          </Route>

          <Route path="/message" element={<MessageBox />} />
          <Route path='/folder' element={<Folder/>} />

          <Route path="/task" element={<TaskLayout />}>
            <Route index element={<Task />} />
            <Route path="list" element={<TaskList />} />
            <Route path="approved" element={<ApprovedTask />} />
            <Route path=":taskId" element={<TaskCards />} />
            <Route path='rework' element={<ReworkTask />} />
          </Route>

          <Route path="/table" element={<TableLayout />}>
            <Route index element={<Table />} />
            <Route path="create" element={<CreateTable />} />
            <Route path=":heading" element={<TaskTablePage />} />
            <Route path="detail/:taskId" element={<TableDetailPage />} />
          </Route>
        </Route>
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;