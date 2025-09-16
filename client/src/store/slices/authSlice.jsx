import {createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import {authApi} from './authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try {
        return await authApi.login(user);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authApi.logout();
    // No return data needed; localStorage will be handled in the slice
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgot', async (emailId, thunkAPI) => {
  try { return await authApi.requestPasswordReset(emailId); }
  catch (e) {
    const m = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return thunkAPI.rejectWithValue(m);
  }
});

export const resetPasswordThunk = createAsyncThunk('auth/reset', async ({ token, password }, thunkAPI) => {
  try { return await authApi.submitNewPassword({ token, password }); }
  catch (e) {
    const m = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
    return thunkAPI.rejectWithValue(m);
  }
});

const  authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers:{
        reset: (state) =>{
            state.isError = false,
            state.isLoading = false,
            state.isSuccess = false,
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state)=>{
            state.isLoading = true
        }).addCase(login.fulfilled, (state, action)=>{
            state.isLoading = false,
            state.isSuccess = true,
            state.user = action.payload
        }).addCase(login.rejected, (state,action)=>{
            state.isLoading = false,
            state.isSuccess = false,
            state.user = null,
            state.message = action.payload
        }).addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = '';
        localStorage.removeItem('user');
      })// store/slices/authSlice.js (extraReducers additions)
.addCase(forgotPassword.pending, (s)=>{s.isLoading=true;})
.addCase(forgotPassword.fulfilled,(s,a)=>{s.isLoading=false; s.isSuccess=true; s.message=a.payload?.message || 'If that email exists, a reset link was sent';})
.addCase(forgotPassword.rejected,(s,a)=>{s.isLoading=false; s.isError=true; s.message=a.payload;})
.addCase(resetPasswordThunk.pending,(s)=>{s.isLoading=true;})
.addCase(resetPasswordThunk.fulfilled,(s,a)=>{s.isLoading=false; s.isSuccess=true; s.message=a.payload?.message || 'Password reset successful';})
.addCase(resetPasswordThunk.rejected,(s,a)=>{s.isLoading=false; s.isError=true; s.message=a.payload;});

    }
});

export const {reset} = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export default authSlice.reducer;