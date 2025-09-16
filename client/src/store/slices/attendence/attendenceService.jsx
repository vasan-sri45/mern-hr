// import axios from 'axios';

// // 1. Create a configured instance of Axios. This is the best practice.
// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/attendance', // Sets the base path for all requests
//   withCredentials: true, // CRITICAL: This allows Axios to send the httpOnly cookie with requests
// });

// // 2. Define your API service object using the configured instance
// export const attendanceApi = {
  
//   getTodaysAttendance: async () => {
//     try {
//       // The response data is directly available in `response.data`
//       const response = await apiClient.get('punch/today');
//       return response.data; // e.g., { success: true, attendance: {...} }
//     } catch (error) {
//       // Handle specific 404 error: User has not punched in today
//       if (error.response && error.response.status === 404) {
//         return { attendance: null }; // Return a predictable null value
//       }
//       // For all other errors, throw a new error with a clean message
//       throw new Error(error.response?.data?.message || 'Failed to fetch attendance status');
//     }
//   },

//   getAttendanceHistory: async (startDate, endDate) => {
//   try {
//     // We pass a high limit to get all records for the month. 31 is safe.
//     // The endpoint is now '/records' (or whatever you name it).
//     const response = await apiClient.get('/punch', {
//       params: { 
//         startDate, 
//         endDate,
//         limit: 31 // IMPORTANT: Override default pagination
//       }
//     });
//     // The data is now inside a 'data' property
//     return response.data; // e.g., { success: true, data: [...], pagination: {...} }
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch attendance history');
//   }
// },

//   punchIn: async () => {
//     try {
//       const response = await apiClient.post('/punch-in');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to punch in');
//     }
//   },

//   punchOut: async () => {
//     try {
//       const response = await apiClient.put('/punch-out');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to punch out');
//     }
//   },
//    getMonthlyStats: async ({ month, employeeId }) => {
//     try {
//       const response = await apiClient.get('/stats/monthly', {
//         params: { month, employeeId }
//       });
//       // The controller nests the data, so we return response.data
//       return response.data; // e.g., { success: true, data: { totalWorkingDays, ... } }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch monthly stats');
//     }
//   },
//    getOverallMonthlyReport: async ({ month }) => {
//     try {
//       const response = await apiClient.get('/report/monthly', {
//         params: { month }
//       });
//       return response.data; // e.g., { success: true, data: [...] }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch overall report');
//     }
//   },

//   // getAttendanceHistory: async ({ page = 1, limit = 10 }) => {
//   //   try {
//   //     // Pass query parameters in a `params` object for cleaner code
//   //     const response = await apiClient.get('/punch', {
//   //       params: { page, limit }
//   //     });
//   //     return response.data;
//   //   } catch (error) {
//   //     throw new Error(error.response?.data?.message || 'Failed to fetch attendance history');
//   //   }
//   // }
// };

// src/services/attendance.js
import http from '../../lib/http';

export const attendanceApi = {
  getTodaysAttendance: async () => {
    const { data } = await http.get('/api/attendance/punch/today');
    return data;
  },
  getAttendanceHistory: async (startDate, endDate) => {
    const { data } = await http.get('/api/attendance/punch', { params: { startDate, endDate, limit: 31 } });
    return data;
  },
  punchIn:  async () => (await http.post('/api/attendance/punch-in')).data,
  punchOut: async () => (await http.put('/api/attendance/punch-out')).data,
  getMonthlyStats: async ({ month, employeeId }) => (await http.get('/api/attendance/stats/monthly', { params:{ month, employeeId } })).data,
  getOverallMonthlyReport: async ({ month }) => (await http.get('/api/attendance/report/monthly', { params:{ month } })).data,
};
