import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {employeeApi} from './employeeService';

export const getEmployees = createAsyncThunk(
  'tasks/getEmployees',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeApi.getEmployee();
    } catch (err) {
      return rejectWithValue(err?.message || 'Unknown error');
    }
  }
);

const initialState = {
  employees: [],
  status: 'idle',
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.employees = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const p = action.payload;
        state.employees = Array.isArray(p)
          ? p
          : Array.isArray(p?.data)
          ? p.data
          : Array.isArray(p?.employees)
          ? p.employees
          : [];
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Failed to fetch employees';
      });
  },
});

export const { resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;

