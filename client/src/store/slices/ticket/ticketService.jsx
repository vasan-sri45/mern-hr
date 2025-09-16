// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/support', 
//   withCredentials: true, 
// });

// const handleError = (error) => {
//   if (error.response) {
//     throw error.response.data;
//   } else if (error.request) {
//     throw { message: 'No response from server. Check network connection.' };
//   } else {
//     throw { message: error.message || 'An unexpected error occurred.' };
//   }
// };

// export const ticketApi = {
//   createTicket: async (ticketData) => {
//     try {
//       const response = await apiClient.post('/create', ticketData);
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   getMyTickets: async () => {
//     try {
//       const response = await apiClient.get('/my/ticket');
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   deleteTicket: async (ticketId) => {
//     try {
//       const response = await apiClient.delete(`/ticket/${ticketId}`);
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   updateTicket: async ({ ticketId, ...updateData }) => {
//     try {
//       const response = await apiClient.put(`/ticket/${ticketId}`, updateData);
//       return response.data; 
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   getTicketById: async (ticketId) => {
//   try {
//     const response = await apiClient.get(`/ticket/${ticketId}`);
//     return response.data;
//   } catch (error) {
//     handleError(error);
//   }
// },
// getTicket: async () => {
//   try {
//     const response = await apiClient.get('/get');
//     return response.data;
//   } catch (error) {
//     handleError(error);
//   }
// },
// };

// ticketService.js
// import axios from 'axios';

// export const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/support',
//   withCredentials: true,
// });

// const toError = (error) => {
//   // Axios error normalization
//   if (axios.isAxiosError?.(error)) {
//     const data = error.response?.data;
//     const message = (data && (data.message || data.error)) || error.message || 'Request failed';
//     return { message, status: error.response?.status || 0, data };
//   }
//   if (error && typeof error === 'object' && 'message' in error) {
//     return error;
//   }
//   return { message: 'Unknown error' };
// };

// export const ticketApi = {
//   async createTicket(ticketData) {
//     try {
//       const { data } = await apiClient.post('/create', ticketData);
//       return data; // { success, message, data }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
//   async getMyTickets() {
//     try {
//       const { data } = await apiClient.get('/my/ticket');
//       return data; // { success, data: [] }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
//   async deleteTicket(ticketId) {
//     try {
//       const { data } = await apiClient.delete(`/ticket/${ticketId}`);
//       return data; // { success, id | data }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
//   async updateTicket({ ticketId, ...updateData }) {
//     try {
//       const { data } = await apiClient.put(`/ticket/${ticketId}`, updateData);
//       return data; // { success, data }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
//   async getTicketById(ticketId) {
//     try {
//       const { data } = await apiClient.get(`/ticket/${ticketId}`);
//       return data; // { success, data }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
//   async getTicket() {
//     try {
//       const { data } = await apiClient.get('/get');
//       return data; // { success, data: [] }
//     } catch (e) {
//       throw toError(e);
//     }
//   },
// };
// src/services/ticket.js
import http from '../../lib/http';

export const ticketApi = {
  createTicket: async (payload) => (await http.post('/api/support/create', payload)).data,
  getMyTickets:   async () =>        (await http.get('/api/support/my/ticket')).data,
  getTicketById:   async (id) =>      (await http.get(`/api/support/ticket/${id}`)).data,
  updateTicket: async ({ ticketId, ...updateData }) => (await http.put(`/api/support/ticket/${ticketId}`, updateData)).data,
  deleteTicket: async (ticketId) => (await http.delete(`/api/support/ticket/${ticketId}`)).data,
  getTicket:async () => (await http.get('/api/support/get')).data
};
