// import axios from 'axios';

// const API_URL = 'http://localhost:4500/api/data';
// const id = '686cf267e845e51f344df064';

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
 
// const employeeService = { getEmployee };

// export default employeeService;

import http from '../../lib/http';

export const employeeApi = {
  getEmployee: async () => (await http.get('/api/data/employees')).data,
};