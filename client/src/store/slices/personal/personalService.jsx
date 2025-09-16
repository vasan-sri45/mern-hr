// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:4500/api/personal', 
//   withCredentials: true, 
// });

// const handleError = (error) => {
//   if (error.response) {
//     // The request was made and the server responded with a status code
//     // that falls out of the range of 2xx
//     throw error.response.data; // Re-throw the structured error from the backend
//   } else if (error.request) {
//     // The request was made but no response was received
//     throw { message: 'No response received from server. Please check your network connection.' };
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     throw { message: error.message || 'An unexpected error occurred.' };
//   }
// };

// export const personalApi = {
//   createInfo: async (personalData) => {
//     try {
//       const response = await apiClient.post('/about', personalData);
//       return response.data; 
//     } catch (error) {
      
//       handleError(error);
//     }
//   },
//   getMyPersonal: async () => {
//     try {
//       const response = await apiClient.get('/get');
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
//    updateInfo: async (updateData) => {
//     try {
//       // The user's ID is determined on the backend from the auth token
//       const response = await apiClient.put('/update', updateData); // Endpoint: PUT /api/personal/update
//       return response.data;
//     } catch (error) {
//       handleError(error);
//     }
//   },
// };

// src/services/personal.js
import http from '../../lib/http';

export const personalApi = {
  createInfo:  async (personalData) => (await http.post('/api/personal/about', personalData)).data,
  getMyPersonal: async () =>           (await http.get('/api/personal/get')).data,
  updateInfo: async (updateData) =>    (await http.put('/api/personal/update', updateData)).data,
};

