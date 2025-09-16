// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/auth'

// const login = async(userData) =>{
//     const response = await axios.post(`${API_URL}/login/employee`, userData, {
//   headers: { 'Content-Type': 'application/json' },
//    withCredentials: true
// });

//     if(response.data){
//         localStorage.setItem('user',JSON.stringify(response.data));
//     }
//     return response.data;
// };

// const logout = async () => {
//   // Optionally, hit the backend API to clear the cookie
//   await axios.post(`${API_URL}/logout/employee`, {}, { withCredentials: true });
//   localStorage.removeItem('user');
// };

// // store/slices/authService.js (add)
// export const requestPasswordReset = async (emailId) => {
//   const res = await axios.post(`${API_URL}/forgot-password`, { emailId }, { withCredentials: true });
//   return res.data;
// };
// export const submitNewPassword = async ({ token, password }) => {
//   const res = await axios.post(`${API_URL}/reset-password/${token}`, { password }, { withCredentials: true });
//   return res.data;
// };



// const authService = {
//     login, logout
// };

// export default authService;

// store/slices/authService.js
// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/auth';

// const login = async (userData) => {
//   const res = await axios.post(`${API_URL}/login/employee`, userData, {
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials: true
//   });
//   if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
//   return res.data;
// };

// const logout = async () => {
//   await axios.post(`${API_URL}/logout/employee`, {}, { withCredentials: true });
//   localStorage.removeItem('user');
// };

// const requestPasswordReset = async (emailId) => {
//   const res = await axios.post(`${API_URL}/forgot-password`, { emailId }, { withCredentials: true });
//   return res.data;
// };

// const submitNewPassword = async ({ token, password }) => {
//   const res = await axios.post(`${API_URL}/reset-password/${token}`, { password }, { withCredentials: true });
//   return res.data;
// };

// // IMPORTANT: include all functions in the default export
// const authService = { login, logout, requestPasswordReset, submitNewPassword };
// export default authService;


// src/services/auth.js
import http from '../lib/http';

const AUTH = '/api/auth';
export const authApi = {
  login:  async (body) => {
    const { data } = await http.post(`${AUTH}/login/employee`, body); // cookie set by server
    if (data) localStorage.setItem('user', JSON.stringify(data));
    return data;
  },
  logout: async () => { await http.post(`${AUTH}/logout/employee`, {}); localStorage.removeItem('user'); },
  forgotPassword: async (emailId) => (await http.post(`${AUTH}/forgot-password`, { emailId })).data,
  resetPassword:  async ({ token, password }) => (await http.post(`${AUTH}/reset-password/${token}`, { password })).data,
};
