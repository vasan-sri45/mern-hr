// import axios from 'axios';

// // 1. Corrected baseURL to point to the root of the API
// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/table', // All requests will be prefixed with this
//   withCredentials: true,
// });

// // This is a robust error handler. No changes needed.
// const handleError = (error) => {
//   if (error.response) {
//     // The request was made and the server responded with a status code
//     // that falls out of the range of 2xx
//     throw error.response.data;
//   } else if (error.request) {
//     // The request was made but no response was received
//     throw { message: 'No response from server. Please check your network connection.' };
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     throw { message: error.message || 'An unexpected error occurred.' };
//   }
// };

// // 2. Renamed and corrected the API service object for clarity and consistency
// export const tableApiService = {

//   /**
//    * Fetches all table entries.
//    * Corresponds to: GET /api/tables
//    */
//   getAllEntries: async () => {
//     try {
//       const response = await apiClient.get('/row'); // Corrected endpoint
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   /**
//    * Fetches all entries created by the currently logged-in user.
//    * Corresponds to: GET /api/tables/my-entries (See backend implementation below)
//    */
//   getMyEntries: async () => {
//     try {
//       const response = await apiClient.get(`/row/${entryId}`);
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
  
//   /**
//    * Fetches a single entry by its ID.
//    * Corresponds to: GET /api/tables/:id
//    */
//   getEntryById: async (entryId) => {
//     try {
//       const response = await apiClient.get(`/row/${entryId}`); // Corrected endpoint
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   /**
//    * Creates a new table entry.
//    * Corresponds to: POST /api/tables
//    */
//   createEntry: async (entryData) => {
//     try {
//       const response = await apiClient.post('/row', entryData); // Corrected endpoint
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   /**
//    * Updates an existing table entry.
//    * Corresponds to: PUT /api/tables/:id
//    */
//   updateEntry: async ({ entryId, ...updateData }) => {
//     try {
//       const response = await apiClient.put(`/row/${entryId}`, updateData); // Corrected endpoint
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   /**
//    * Deletes a table entry.
//    * Corresponds to: DELETE /api/tables/:id
//    */
//   deleteEntry: async (entryId) => {
//     try {
//       const response = await apiClient.delete(`/row/${entryId}`); // Corrected endpoint
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
// };

// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/table', // matches server router prefix
//   withCredentials: true,
// });

// // optional: add interceptors for 401 handling, auth headers, etc.
// // apiClient.interceptors.response.use(
// //   (res) => res,
// //   (err) => Promise.reject({ message: err?.response?.data?.message || err.message, status: err?.response?.status })
// // );

// const handleError = (error) => {
//   if (error.response) {
//     throw error.response.data;
//   } else if (error.request) {
//     throw { message: 'No response from server. Please check your network connection.' };
//   } else {
//     throw { message: error.message || 'An unexpected error occurred.' };
//   }
// };

// export const tableApiService = {
//   // GET /row -> { success, data: [...] }
//   getAllEntries: async () => {
//     try {
//       const { data } = await apiClient.get('/row');
//       return Array.isArray(data?.data) ? data.data : [];
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   // OPTION A: if backend has /row/mine, use it and unwrap
//   // getMyEntries: async () => {
//   //   try {
//   //     const { data } = await apiClient.get('/row/mine');
//   //     return Array.isArray(data?.data) ? data.data : [];
//   //   } catch (error) {
//   //     handleError(error);
//   //   }
//   // },

//   // OPTION B: filter client-side from all entries (until backend route exists)
//   getMyEntries: async (currentUserId) => {
//     try {
//       const list = await tableApiService.getAllEntries();
//       // assumes entries have employee_id populated or as ObjectId string
//       return list.filter((e) =>
//         (e.employee_id?._id || e.employee_id) === currentUserId
//       );
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   // GET /row/:id -> { success, data: {...} }
//   getEntryById: async (entryId) => {
//     try {
//       const { data } = await apiClient.get(`/row/${entryId}`);
//       return data?.data ?? null;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   // POST /row -> { success, data: {...} }
//   createEntry: async (entryData) => {
//     try {
//       const { data } = await apiClient.post('/row', entryData);
//       return data?.data ?? null;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   // PUT /row/:id -> { success, data: {...} }
//   updateEntry: async ({ entryId, ...updateData }) => {
//     try {
//       const { data } = await apiClient.put(`/row/${entryId}`, updateData);
//       return data?.data ?? null;
//     } catch (error) {
//       handleError(error);
//     }
//   },

//   // DELETE /row/:id -> { success, id }
//   deleteEntry: async (entryId) => {
//     try {
//       const { data } = await apiClient.delete(`/row/${entryId}`);
//       return data?.id ?? entryId;
//     } catch (error) {
//       handleError(error);
//     }
//   },
// };

// src/services/table.js
import http from '../../lib/http';

export const tableApi = {
  getAll:   async () => (await http.get('/api/table/row')).data?.data ?? [],
  getById:  async (id) => (await http.get(`/api/table/row/${id}`)).data?.data ?? null,
  create:   async (payload) => (await http.post('/api/table/row', payload)).data?.data ?? null,
  update:   async ({ entryId, ...updateData }) => (await http.put(`/api/table/row/${entryId}`, updateData)).data?.data ?? null,
  remove:   async (entryId) => (await http.delete(`/api/table/row/${entryId}`)).data?.id ?? entryId,
  // optional: filter client-side until /row/mine exists
  mine:     async (currentUserId) => (await http.get('/api/table/row')).data?.data?.filter(
                (e) => (e.employee_id?._id || e.employee_id) === currentUserId
              ) ?? [],
};
