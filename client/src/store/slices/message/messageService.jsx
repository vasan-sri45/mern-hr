// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/message', 
//   withCredentials: true, 
// });

// export const messageApi = {

      
//   createMessage: async (messageData) => {
//     try {
//       const response = await apiClient.post('/create', messageData);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to send message');
//     }
//   },
//   getAllMessages: async () => {
//     try {
//       const response = await apiClient.get('/get');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch messages');
//     }
//   },
//   markMessageAsRead: async (messageId) => {
//   const response = await apiClient.post(`${messageId}/read`);
//   return response.data;
//   },
//   getUnreadMessages: async () => {
//   const response = await apiClient.get('/read');
//   return response.data;
//   }
// };

// src/services/messages.js
import http from '../../lib/http';

export const messageApi = {
  createMessage: async (messageData) => (await http.post('/api/message/create', messageData)).data,
  getAllMessages: async () => (await http.get('/api/message/get')).data,
  markMessageAsRead: async (messageId) => (await http.post(`/api/message/${messageId}/read`)).data,
  getUnreadMessages: async () => (await http.get('/api/message/read')).data,
};

