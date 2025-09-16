// import axios from 'axios';

// // One instance for all folder endpoints
// export const api = axios.create({
//   baseURL: 'http://localhost:4500/api/folder',
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err?.response?.status;
//     const message = err?.response?.data?.message || err?.message || 'Request failed';
//     return Promise.reject({ status, message, data: err?.response?.data });
//   }
// );

// export const folderApi = {
//   // POST /api/folder/create
//   createFolder: async (payload) => {
//     const res = await api.post('/create', payload);
//     return res.data;
//   },
//   // GET /api/folder/get
//   getFolders: async () => {
//     const res = await api.get('/get');
//     return res.data;
//   },
//   deleteFolder: async(id) => {
//     const res = await api.delete(`/delete/${id}`);
//     return res.data;
//   },
//   updateFolder: async({id, formData}) => {
//     const res = await api.put(`/update/${id}`,formData);
//     return res.data;
//   }
// };

// src/services/folder.js
import http from '../../lib/http';

export const folderApi = {
  createFolder: async (payload) => (await http.post('/api/folder/create', payload)).data,
  getFolders:   async () =>        (await http.get('/api/folder/get')).data,
  deleteFolder: async (id) =>      (await http.delete(`/api/folder/delete/${id}`)).data,
  updateFolder: async ({ id, formData }) => (await http.put(`/api/folder/update/${id}`, formData)).data,
};

