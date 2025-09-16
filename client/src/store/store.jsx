import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/task/taskSlice';
import employeeReducer from './slices/employee/employeeSlice';
import attendenceReducer from './slices/attendence/attendenceSlice';
import messageReducer from './slices/message/messageSlice';
import personalInfoReducer from './slices/personal/personalSlice';
import ticketReducer from './slices/ticket/ticketSlice';
import tableReducer from './slices/table/tableSlice';
import folderReducer from './slices/folder/folderSlice';
import taskReportReducer from './slices/taskReport/taskReportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    employees: employeeReducer,
    attendance: attendenceReducer,
    messages: messageReducer,
    personalInfo: personalInfoReducer,
    tickets: ticketReducer,
    table: tableReducer,
    folder: folderReducer,
    taskStats: taskReportReducer
  },
});