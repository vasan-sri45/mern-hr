// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/data';
// const id = '686cf267e845e51f344df064';

// const register = async (userData) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/task/create-with-image`,
//       userData,
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     if (error.response) throw error.response.data;
//     throw error;
//   }
// };

// const getEmployee = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/employees`, {
//       headers: { 'Content-Type': 'application/json' },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) throw error.response.data;
//     throw error;
//   }
// };

// const getTask = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/get/task`, {
//       headers: { 'Content-Type': 'application/json' },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) throw error.response.data;
//     throw error;
//   }
// };

// const deleteTask = async (taskId) => {
// try {
// const { data } = await axios.delete(`${API_URL}/delete/task/${taskId}`, {
// withCredentials: true,
// });
// return data;
// } catch (err) {
// // Prefer a consistent error shape
// const payload = err?.response?.data || { message: err.message || 'Request failed' };
// throw payload;
// }
// };

// const updateTask = async (taskId, taskData) => {
//   try {
//     // Note the PUT request and the endpoint structure
//     const response = await axios.put(
//       `${API_URL}/update/task/${taskId}`, // Adjust endpoint as needed
//       taskData,
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     const payload = error?.response?.data || { message: error.message || 'Update failed' };
//     throw payload;
//   }
// };

// const taskService = { register, getEmployee, getTask, deleteTask, updateTask};
// export default taskService;

// src/store/slices/task/taskService.js
// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/data';

// const client = axios.create({
//   baseURL: API_URL,
//   timeout: 20000,
//   withCredentials: true,
// });

// // Ensure no interceptor forces Content-Type for FormData
// client.interceptors.request.use((config) => {
//   if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
//     if (config.headers && ('Content-Type' in config.headers || 'content-type' in config.headers)) {
//       delete config.headers['Content-Type'];
//       delete config.headers['content-type'];
//     }
//   }
//   return config;
// });

// // Create (supports FormData)
// const register = async (userData) => {
//   // userData may be FormData or JSON; let axios infer headers
//   const { data } = await client.post('/task/create-with-image', userData);
//   return data;
// };

// // Employees (JSON)
// const getEmployee = async () => {
//   const { data } = await client.get('/employees', {
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return data;
// };

// // Tasks list (JSON)
// const getTask = async () => {
//   const { data } = await client.get('/get/task', {
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return data;
// };

// const deleteTask = async (taskId) => {
//   const { data } = await client.delete(`/delete/task/${taskId}`);
//   return data;
// };

// // Update (supports FormData or JSON)
// const updateTask = async (taskId, taskData) => {
//   const { data } = await client.put(`/update/task/${taskId}`, taskData);
//   return data;
// };

// const taskService = { register, getEmployee, getTask, deleteTask, updateTask };
// export default taskService;


// taskService.js (JS only)
// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/data';

// const client = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   // leave default timeout 0 here; set per request below
// });

// // Keep FormData boundary intact
// client.interceptors.request.use((config) => {
//   if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
//     if (config.headers) {
//       delete config.headers['Content-Type'];
//       delete config.headers['content-type'];
//     }
//   }
//   return config;
// });

// Helper: Abort after ms using AbortController
// const withTimeout = (ms) => {
//   // AbortSignal.timeout is widely supported in new runtimes; fallback to custom controller
//   if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
//     return { signal: AbortSignal.timeout(ms) };
//   }
//   const controller = new AbortController();
//   setTimeout(() => controller.abort(), ms);
//   return { signal: controller.signal };
// };

// // Create (FormData or JSON) - allow longer timeout for uploads
// export const register = async (userData) => {
//   const { data } = await client.post('/task/create-with-image', userData, {
//     ...withTimeout(60000), // 60s for uploads
//     maxBodyLength: Infinity, // allow large bodies
//     maxContentLength: Infinity,
//   });
//   return data;
// };

// export const getEmployee = async () => {
//   const { data } = await client.get('/employees', {
//     headers: { 'Content-Type': 'application/json' },
//     ...withTimeout(15000),
//   });
//   return data;
// };

// export const getTask = async () => {
//   const { data } = await client.get('/get/task', {
//     headers: { 'Content-Type': 'application/json' },
//     ...withTimeout(20000),
//   });
//   return data;
// };

// export const deleteTask = async (taskId) => {
//   const { data } = await client.delete(`/delete/task/${taskId}`, {
//     ...withTimeout(15000),
//   });
//   return data;
// };

// export const updateTask = async (taskId, taskData) => {
//   const isForm = typeof FormData !== 'undefined' && taskData instanceof FormData;
//   const { data } = await client.put(`/update/task/${taskId}`, taskData, {
//     ...withTimeout(isForm ? 60000 : 20000),
//     maxBodyLength: Infinity,
//     maxContentLength: Infinity,
//   });
//   return data;
// };

// const taskService = { register, getEmployee, getTask, deleteTask, updateTask };
// export default taskService;



 import http from '../../lib/http'; // or '../../lib/http'

 // 60s timeout helper (same as before)
 const withTimeout = (ms) => {
   if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
     return { signal: AbortSignal.timeout(ms) };
   }
   const controller = new AbortController();
   setTimeout(() => controller.abort(), ms);
   return { signal: controller.signal };
 };

 export const register = async (userData) => {

const { data } = await http.post('/api/data/task/create-with-image', userData, {
     ...withTimeout(60000),
     maxBodyLength: Infinity,
     maxContentLength: Infinity,
   });
   return data;
 };

 export const getEmployee = async () => {
const { data } = await http.get('/api/data/employees', { ...withTimeout(15000) });
   return data;
 };

 export const getTask = async () => {

  const { data } = await http.get('/api/data/get/task', { ...withTimeout(20000) });
   return data;
 };

 export const deleteTask = async (taskId) => {

 const { data } = await http.delete(`/api/data/delete/task/${taskId}`, { ...withTimeout(15000) });
   return data;
 };

 export const updateTask = async (taskId, taskData) => {
   const isForm = typeof FormData !== 'undefined' && taskData instanceof FormData;

 const { data } = await http.put(`/api/data/update/task/${taskId}`, taskData, {
     ...withTimeout(isForm ? 60000 : 20000),
     maxBodyLength: Infinity,
     maxContentLength: Infinity,
   });
   return data;
 };

 const taskService = { register, getEmployee, getTask, deleteTask, updateTask };
export default taskService;
