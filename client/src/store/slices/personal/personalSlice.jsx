import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { personalApi } from './personalService'; 

export const submitPersonalInfo = createAsyncThunk(
  'personalInfo/submitPersonalInfo', 
  async (personalData, { rejectWithValue }) => {
    try {
      const response = await personalApi.createInfo(personalData); 
      return response; 
    } catch (error) {
      return rejectWithValue(error); 
    }
  }
);

export const fetchPersonalInfo = createAsyncThunk(
  'personalInfo/fetch', // Corrected, consistent naming
  async (_, { rejectWithValue }) => {
    try {
      const response = await personalApi.getMyPersonal();
      return response;
    } catch (error) {
      // Return a serializable error object or message
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch data.' });
    }
  }
);

export const updatePersonalInfo = createAsyncThunk(
  'personalInfo/update',
  async (updateData, { rejectWithValue }) => {
    try {
      // The user ID is handled by the backend via token, so we don't need to pass it
      return await personalApi.updateInfo(updateData);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update data' });
    }
  }
);

const personalInfoSlice = createSlice({
  name: 'personalInfo', 
  initialState: {
    data: null, 
    status: 'idle',
    error: null,
  },
  reducers: {
    resetPersonalInfoState: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPersonalInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitPersonalInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(submitPersonalInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      })
      .addCase(fetchPersonalInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload;
        state.data = payload?.data && typeof payload.data === 'object'
          ? payload.data
          : payload ?? null;
        state.error = null;
      })
      .addCase(fetchPersonalInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
       .addCase(updatePersonalInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      ;
  },
});

export const { resetPersonalInfoState } = personalInfoSlice.actions;

export default personalInfoSlice.reducer;
