

// slice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { folderApi } from './folderService';

const initialState = { items: [], loading: false, error: null, uploadProgress: 0 };

export const createTask = createAsyncThunk(
  'folder/createTask',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await folderApi.createFolder(formData);
      return data; // expects { success, task }
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const listTasks = createAsyncThunk(
  'folder/listTasks',
  async (_, { rejectWithValue }) => {
    try {
      // IMPORTANT: make sure this returns { success, tasks }
      const data = await folderApi.getFolders();
      return data; // action.payload will be this object
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

export const updateFolder = createAsyncThunk(
  'folder/updateFolder',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await folderApi.updateFolder({ id, formData });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteTask = createAsyncThunk(
  'folder/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const data = await folderApi.deleteFolder(id);
      // normalize: ensure we return the id to remove
      return data?.id ?? id;
    } catch (err) {
      return rejectWithValue({ message: err.message, status: err.status });
    }
  }
);

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    resetTaskState(state) {
      state.loading = false;
      state.error = null;
      state.uploadProgress = 0;
    },
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const created = action.payload?.task;
        if (created) state.items.unshift(created);
        state.uploadProgress = 100;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { message: 'Request failed' };
      })
      .addCase(listTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(listTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      const p = action.payload;
      state.items = Array.isArray(p) ? p
                  : Array.isArray(p?.folders) ? p.folders
                  : Array.isArray(p?.tasks) ? p.tasks
                  : Array.isArray(p?.data) ? p.data
                  : [];
    })
      .addCase(listTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { message: 'Request failed' };
      })
       .addCase(updateFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedFolder = action.payload?.folder;
        if (updatedFolder) {
          const index = state.items.findIndex(item => item._id === updatedFolder._id);
          if (index !== -1) {
            state.items[index] = updatedFolder;
          }
        }
      })
      // .addCase(updateFolder.fulfilled, (state, action) => {
      // state.loading = false;
      // const updated = action.payload?.folder ?? action.payload?.task ?? action.payload?.data ?? action.payload;
      // const id = updated?._id;
      // if (id) {
      //   const i = state.items.findIndex(x => (x._id || x.id) === id);
      //   if (i !== -1) state.items[i] = updated;
      // }
      // })
      .addCase(updateFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.loading = false;
        const id = a.payload;
        s.items = s.items.filter((x) => (x._id || x.id) !== id);
      })
      .addCase(deleteTask.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? { message: 'Request failed' };
      });
  },
});

export const { resetTaskState, setUploadProgress } = folderSlice.actions;
export default folderSlice.reducer;
