// src/features/taskStats/taskStatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {taskStatsApi} from './taskStatsService';

// admin overview
export const getAdminMonthlySummary = createAsyncThunk(
  'taskStats/getAdminMonthlySummary',
  async ({ month }, { rejectWithValue }) => {
    try { return await taskStatsApi.adminMonthlySummary({ month }); }
    catch (e) { return rejectWithValue(e?.response?.data?.message || e?.message || 'Failed'); }
  }
);

// my monthly report
export const getMyMonthlyReport = createAsyncThunk(
  'taskStats/getMyMonthlyReport',
  async ({ month, page = 1, limit = 10 }, { rejectWithValue }) => {
    try { return await taskStatsApi.myMonthlyReport({ month, page, limit }); }
    catch (e) { return rejectWithValue(e?.response?.data?.message || e?.message || 'Failed'); }
  }
);

const initialState = {
  adminSummary: { month: null, stats: [], isLoading: false, isError: false, message: '' },
  myReport: { month: null, summary: null, tasks: [], page: 1, limit: 10, totalRows: 0, isLoading: false, isError: false, message: '' }
};

const taskStatsSlice = createSlice({
  name: 'taskStats',
  initialState,
  reducers: {
    resetMyReport(state) {
      state.myReport = { month: null, summary: null, tasks: [], page: 1, limit: 10, totalRows: 0, isLoading: false, isError: false, message: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminMonthlySummary.pending, (s) => { s.adminSummary.isLoading = true; s.adminSummary.isError = false; s.adminSummary.message = ''; })
      .addCase(getAdminMonthlySummary.fulfilled, (s, a) => { s.adminSummary.isLoading = false; s.adminSummary.month = a.payload?.month || null; s.adminSummary.stats = a.payload?.stats || []; })
      .addCase(getAdminMonthlySummary.rejected, (s, a) => { s.adminSummary.isLoading = false; s.adminSummary.isError = true; s.adminSummary.message = a.payload; })
      .addCase(getMyMonthlyReport.pending, (s) => { s.myReport.isLoading = true; s.myReport.isError = false; s.myReport.message = ''; })
      .addCase(getMyMonthlyReport.fulfilled, (s, a) => {
        const { month, summary, tasks, page, limit, totalRows } = a.payload || {};
        s.myReport.isLoading = false;
        s.myReport.month = month || null;
        s.myReport.summary = summary || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, approvedTasks: 0 };
        s.myReport.tasks = tasks || [];
        s.myReport.page = page || 1;
        s.myReport.limit = limit || 10;
        s.myReport.totalRows = totalRows || 0;
      })
      .addCase(getMyMonthlyReport.rejected, (s, a) => { s.myReport.isLoading = false; s.myReport.isError = true; s.myReport.message = a.payload; });
  }
});

export const { resetMyReport } = taskStatsSlice.actions;
export default taskStatsSlice.reducer;
