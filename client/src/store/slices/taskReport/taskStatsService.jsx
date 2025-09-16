
// // src/features/taskStats/taskStatsService.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:4500/api/data',
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' }
// });

// // Admin: per-employee monthly summary
// export const fetchAdminMonthlySummary = async ({ month }) => {
//   const res = await api.get('/task/count', { params: { month } });
//   return res.data;
// };



// // Employee/Admin: self monthly report
// export const fetchMyMonthlyReport = async ({ month, page = 1, limit = 10 }) => {
//   const res = await api.get('/task/stats/me', { params: { month, page, limit } });
//   return res.data;
// };

// const taskStatsService = { fetchAdminMonthlySummary, fetchMyMonthlyReport };
// export default taskStatsService;


// src/services/taskStats.js
import http from '../../lib/http';

export const taskStatsApi = {
  adminMonthlySummary: async ({ month }) => (await http.get('/api/data/task/count', { params:{ month } })).data,
  myMonthlyReport:     async ({ month, page=1, limit=10 }) => (await http.get('/api/data/task/stats/me', { params:{ month, page, limit } })).data,
};
