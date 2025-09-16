import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceApi } from './attendenceService'; // Import the optimized axios service

// 1. Define Async Thunks that will call the API service
export const fetchTodaysAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.getTodaysAttendance();
      // The API service already handles the 404 case, returning { attendance: null }
      return data.attendance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const punchIn = createAsyncThunk(
  'attendance/punchIn',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await attendanceApi.punchIn();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const punchOut = createAsyncThunk(
  'attendance/punchOut',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await attendanceApi.punchOut();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMonthlyStats = createAsyncThunk(
  'attendance/fetchMonthlyStats',
  async ({ month, employeeId }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getMonthlyStats({ month, employeeId });
      return response.data; // The payload will be the object with stats
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/fetchHistory',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      // The service call is the same from the component's perspective
      const data = await attendanceApi.getAttendanceHistory(startDate, endDate);
      // IMPORTANT: Extract the records from the `data` property of the response
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOverallReport = createAsyncThunk(
  'attendance/fetchOverallReport',
  async ({ month }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getOverallMonthlyReport({ month });
      return response.data; // The payload is the array of report objects
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  today: {
    data: null,
    status: 'idle',
    error: null,
  },
  history: {
    items: [],
    // We keep pagination here in case you add a paginated view later, but it's not used by this thunk.
    pagination: {},
    status: 'idle',
    error: null,
  },
  monthlyStats: {
    data: {
      totalWorkingDays: 0,
      totalAbsentDays: 0,
      totalWorkingHours: '0h 0m',
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
   adminReport: {
    data: [],
    status: 'idle',
    error: null,
  },
};

// --- CORRECTED SLICE ---
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ... cases for today's attendance ...
      .addCase(fetchTodaysAttendance.pending, (state) => { state.today.status = 'loading'; })
      .addCase(fetchTodaysAttendance.fulfilled, (state, action) => {
        state.today.status = 'succeeded';
        state.today.data = action.payload;
      })
      .addCase(fetchTodaysAttendance.rejected, (state, action) => {
        state.today.status = 'failed';
        state.today.error = action.payload;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.today.data = action.payload;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.today.data = action.payload;
      })

      // --- Cases for Attendance History ---
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.history.status = 'loading';
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.history.status = 'succeeded';
        // THE FIX: The payload is now just the array of records.
        state.history.items = action.payload;
        // We are not receiving pagination info, so we don't try to set it.
        state.history.pagination = {}; // Reset pagination info
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.history.status = 'failed';
        state.history.error = action.payload;
      })
      .addCase(fetchMonthlyStats.pending, (state) => {
        state.monthlyStats.status = 'loading';
      })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.monthlyStats.status = 'succeeded';
        state.monthlyStats.data = action.payload; // Payload is the stats object
      })
      .addCase(fetchMonthlyStats.rejected, (state, action) => {
        state.monthlyStats.status = 'failed';
        state.monthlyStats.error = action.payload;
      })
      .addCase(fetchOverallReport.pending, (state) => {
        state.adminReport.status = 'loading';
      })
      .addCase(fetchOverallReport.fulfilled, (state, action) => {
        state.adminReport.status = 'succeeded';
        state.adminReport.data = action.payload;
      })
      .addCase(fetchOverallReport.rejected, (state, action) => {
        state.adminReport.status = 'failed';
        state.adminReport.error = action.payload;
      });
  },
});


export default attendanceSlice.reducer;


