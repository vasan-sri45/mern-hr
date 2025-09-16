// store/slices/message/messageSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageApi } from './messageService';

// --- ASYNC THUNKS ---

// Thunk for fetching unread messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // The API service now returns the { success, data } object
      const response = await messageApi.getUnreadMessages();
      return response.data; // Pass the array of messages to the reducer
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch messages.';
      return rejectWithValue(message);
    }
  }
);

// Thunk for marking a message as read
export const markMessageAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (messageId, { rejectWithValue, dispatch }) => {
    try {
      // --- OPTIMISTIC UPDATE ---
      // Dispatch the synchronous reducer immediately to remove the message from the UI.
      dispatch(dismissMessage(messageId));
      
      // Now, make the API call to the server in the background.
      await messageApi.markMessageAsRead(messageId);
      
      // Return the messageId on success, which can be used in the builder if needed.
      return messageId;
    } catch (error) {
      // If the server call fails, the UI change has already happened.
      // In a production app, you might dispatch another action here to
      // re-add the message to the list and show an error toast.
      console.error("Optimistic update failed to sync with server:", error);
      const message = error.response?.data?.message || error.message || 'Could not dismiss message.';
      return rejectWithValue(message);
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData, { rejectWithValue }) => {
    try {
      // Assuming you have a messageApi service like your ticketApi
      const response = await messageApi.createMessage(messageData);
      return response.data; // Should return the newly created message
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// --- INITIAL STATE ---
const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// --- SLICE DEFINITION ---
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // This synchronous reducer is used for the optimistic update.
    // It's called directly by the `markMessageAsRead` thunk.
    dismissMessage: (state, action) => {
      const messageIdToDismiss = action.payload;
      state.items = state.items.filter(message => message._id !== messageIdToDismiss);
    },
    // You could add other reducers here, e.g., to clear messages on logout.
    clearMessages: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Reducers for fetching messages
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // The payload is the array of messages
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Optional: Reducer for when the markAsRead thunk fails server-side
      .addCase(markMessageAsRead.rejected, (state, action) => {
        // The UI state is already updated, so we just log the error here.
        // You could update the error state to display a small, non-blocking notification.
        console.error("Mark as read failed:", action.payload);
        state.error = `Sync Error: ${action.payload}`;
      })
      .addCase(createMessage.pending, (state) => {
        // You can set a specific status like 'creating' if needed
        state.status = 'loading'; 
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the new message to the top of the list for immediate visibility
        state.items.unshift(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Store the error from the server
      });
  },
});

export const { dismissMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
