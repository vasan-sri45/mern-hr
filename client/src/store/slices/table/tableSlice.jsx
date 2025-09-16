

// tableSlice.js
import { createSlice, createAsyncThunk, isPending, isRejected, isFulfilled } from '@reduxjs/toolkit';
import { tableApi} from './tableService';

export const fetchTableEntries = createAsyncThunk(
  'table/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await tableApi.getAll(); }
    catch (e) { return rejectWithValue(e?.message || 'Failed'); }
  },
  {
    condition: (_, { getState }) => {
      const s = getState().table?.status;
      return s === 'idle'; // block when loading/succeeded/failed
    },
  }
);
// OPTION A (backend has /row/mine):
// export const fetchMyEntries = createAsyncThunk('table/fetchMy', async (_, { rejectWithValue }) => {
//   try { return await tableApiService.getMyEntries(); }
//   catch (e) { return rejectWithValue(e?.message || 'Failed'); }
// });

// OPTION B (client-side filter needs current user id):
export const fetchMyEntries = createAsyncThunk('table/fetchMy', async (currentUserId, { rejectWithValue }) => {
  try { return await tableApiService.getMyEntries(currentUserId); }
  catch (e) { return rejectWithValue(e?.message || 'Failed'); }
});

// Detail
export const fetchEntryById = createAsyncThunk('table/fetchById', async (id, { rejectWithValue }) => {
  try { return await tableApi.getById(id); }
  catch (e) { return rejectWithValue(e?.message || 'Failed'); }
});

// Create
export const createTableEntry = createAsyncThunk('table/create', async (entry, { rejectWithValue }) => {
  try { return await tableApi.create(entry); }
  catch (e) { return rejectWithValue(e?.message || 'Failed'); }
});

// Update
export const updateTableEntry = createAsyncThunk('table/update', async ({ entryId, updateData }, { rejectWithValue }) => {
  try { return await tableApi.update({ entryId, ...updateData }); }
  catch (e) { return rejectWithValue(e?.message || 'Failed'); }
});

// Delete
export const deleteTableEntry = createAsyncThunk('table/delete', async (id, { rejectWithValue }) => {
  try { return await tableApi.remove(id); }
  catch (e) { return rejectWithValue(e?.message || 'Failed'); }
});

const initialState = {
  entries: [],
  currentEntry: null,
  status: 'idle',
  error: null,
};

// const tableSlice = createSlice({
//   name: 'table',
//   initialState,
//   reducers: {
//     clearCurrentEntry: (state) => { state.currentEntry = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Lists
//       .addCase(fetchTableEntries.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.entries = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(fetchMyEntries.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.entries = Array.isArray(action.payload) ? action.payload : [];
//       })

//       // Detail
//       .addCase(fetchEntryById.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.currentEntry = action.payload || null;
//       })

//       // Create
//       .addCase(createTableEntry.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const created = action.payload;
//         if (created && created._id) state.entries.unshift(created);
//       })

//       // Update
//       .addCase(updateTableEntry.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const updated = action.payload;
//         if (updated && updated._id) {
//           const i = state.entries.findIndex(e => e._id === updated._id);
//           if (i !== -1) state.entries[i] = updated;
//           if (state.currentEntry && state.currentEntry._id === updated._id) state.currentEntry = updated;
//         }
//       })

//       // Delete
//       .addCase(deleteTableEntry.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const id = action.payload;
//         state.entries = state.entries.filter(e => e._id !== id);
//         if (state.currentEntry && state.currentEntry._id === id) state.currentEntry = null;
//       })

//       // Generic pending/rejected
//       .addMatcher(a => a.type.endsWith('/pending'), (state) => {
//         state.status = 'loading'; state.error = null;
//       })
//       .addMatcher(a => a.type.endsWith('/rejected'), (state, action) => {
//         state.status = 'failed'; state.error = action.payload || 'Request failed';
//       });
//   },
// });

// export const { clearCurrentEntry } = tableSlice.actions;
// export default tableSlice.reducer;


const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    clearCurrentEntry: (state) => { state.currentEntry = null; },
    // Optional: expose a reset if ever needed
    resetStatus: (state) => { state.status = 'idle'; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Lists
      .addCase(fetchTableEntries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyEntries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = Array.isArray(action.payload) ? action.payload : [];
      })

      // Detail
      .addCase(fetchEntryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEntry = action.payload || null;
      })

      // Create
      .addCase(createTableEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const created = action.payload;
        if (created && created._id) state.entries.unshift(created);
      })

      // Update
      .addCase(updateTableEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;
        if (updated && updated._id) {
          const i = state.entries.findIndex(e => e._id === updated._id);
          if (i !== -1) state.entries[i] = updated;
          if (state.currentEntry && state.currentEntry._id === updated._id) state.currentEntry = updated;
        }
      })

      // Delete
      .addCase(deleteTableEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.entries = state.entries.filter(e => e._id !== id);
        if (state.currentEntry && state.currentEntry._id === id) state.currentEntry = null;
      })

      // Scoped status handlers: only for table thunks
      .addMatcher(
        isPending(
          fetchTableEntries, fetchMyEntries, fetchEntryById,
          createTableEntry, updateTableEntry, deleteTableEntry
        ),
        (state) => { state.status = 'loading'; state.error = null; }
      )
      .addMatcher(
        isRejected(
          fetchTableEntries, fetchMyEntries, fetchEntryById,
          createTableEntry, updateTableEntry, deleteTableEntry
        ),
        (state, action) => { state.status = 'failed'; state.error = action.payload || 'Request failed'; }
      )
      .addMatcher(
        isFulfilled(
          fetchTableEntries, fetchMyEntries, fetchEntryById,
          createTableEntry, updateTableEntry, deleteTableEntry
        ),
        (state) => { state.status = 'succeeded'; }
      );
  },
});

export const { clearCurrentEntry, resetStatus } = tableSlice.actions; // named actions
export default tableSlice.reducer; // default reducer export
