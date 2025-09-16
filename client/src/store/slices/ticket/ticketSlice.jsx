// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { ticketApi } from './ticketService'; // Import the API service

// // Thunk #1: To CREATE a new ticket
// export const createTicket = createAsyncThunk(
//   'tickets/create',
//   async (ticketData, { rejectWithValue }) => {
//     try {
//       // Clean the data before sending: ensure date is in the correct format
//       const dataToSend = {
//         ...ticketData,
//         date: new Date(ticketData.date).toISOString().split('T')[0], // Format to YYYY-MM-DD
//       };
//       const response = await ticketApi.createTicket(dataToSend);
//       return response.data; // The backend returns { message: '...', data: savedTicket }
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// // Thunk #2: To FETCH tickets for the current user
// export const fetchMyTickets = createAsyncThunk(
//   'tickets/fetchMy',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await ticketApi.getMyTickets();
//       return response; // Assuming the API returns an array of tickets
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const deleteTicket = createAsyncThunk(
//   'tickets/delete',
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       // Assumes your ticketApi service has a deleteTicket method
//       await ticketApi.deleteTicket(ticketId);
//       return ticketId; // Return the ID of the deleted ticket on success
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const updateTicketStatus = createAsyncThunk(
//   'tickets/updateStatus',
//   async ({ ticketId, status }, { rejectWithValue }) => {
//     try {
//       const updatedTicket = await ticketApi.updateTicket({ ticketId, status });
//       return updatedTicket;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const fetchTicketById = createAsyncThunk(
//   'tickets/fetchById',
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       const response = await ticketApi.getTicketById(ticketId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const fetchAllTickets = createAsyncThunk(
//   'tickets/fetchTickets',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await ticketApi.getTicket();
//       return response; // Assuming the API returns an array of tickets
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// const ticketSlice = createSlice({
//   name: 'tickets',
//   initialState: {
//     items: [], // An array to hold the list of tickets
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//     singleTicket: null,
//     singleStatus: 'idle', 
//   },
//   reducers: {
//     // A reducer to reset the state if needed (e.g., on logout)
//     resetTicketState: (state) => {
//       state.items = [];
//       state.status = 'idle';
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // --- Create Ticket Cases ---
//       .addCase(createTicket.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(createTicket.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         // Add the newly created ticket to the start of the items array
//         state.items.unshift(action.payload);
//       })
//       .addCase(createTicket.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       // --- Fetch Tickets Cases ---
//       .addCase(fetchMyTickets.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchMyTickets.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload; // Replace the list with the fetched tickets
//       })
//       .addCase(fetchMyTickets.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(deleteTicket.pending, (state) => {
//         // You can optionally set a specific deleting status if needed
//         state.status = 'loading';
//       })
//       .addCase(deleteTicket.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         // Filter out the deleted ticket from the items array
//         state.items = state.items.filter(ticket => ticket._id !== action.payload);
//       })
//       .addCase(deleteTicket.rejected, (state, action) => {
//         state.status = 'failed';
//         // You could store a specific error for the delete action if you want
//         state.error = action.payload;
//       })
//        .addCase(updateTicketStatus.fulfilled, (state, action) => {
//         // Find the index of the ticket that was updated
//         const index = state.items.findIndex(ticket => ticket._id === action.payload._id);
//         if (index !== -1) {
//           // Replace the old ticket with the updated one from the server
//           state.items[index] = action.payload;
//         }
//       })
//       .addCase(fetchTicketById.pending, (state) => {
//         state.singleStatus = 'loading';
//       })
//       .addCase(fetchTicketById.fulfilled, (state, action) => {
//         state.singleStatus = 'succeeded';
//         state.singleTicket = action.payload;
//       })
//       .addCase(fetchTicketById.rejected, (state, action) => {
//         state.singleStatus = 'failed';
//         state.error = action.payload; // Reuse the main error state
//       })
//       .addCase(fetchAllTickets.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchAllTickets.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload; // Replace the list with the fetched tickets
//       })
//       .addCase(fetchAllTickets.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetTicketState } = ticketSlice.actions;

// export default ticketSlice.reducer;


// store/slices/ticket/ticketSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { ticketApi } from './ticketService';

// // Helpers
// const toYmd = (d) => {
//   if (!d) return null;
//   const dt = new Date(d);
//   return Number.isNaN(dt.getTime()) ? null : dt.toISOString().split('T')[0];
// };
// const errMsg = (e) =>
//   e?.response?.data?.message ||
//   e?.response?.data?.error ||
//   e?.message ||
//   'Unknown error';

// export const createTicket = createAsyncThunk(
//   'tickets/create',
//   async (ticketData, { rejectWithValue }) => {
//     try {
//       const payload = {
//         ...ticketData,
//         date: toYmd(ticketData.date), // keep null if invalid/empty
//       };
//       const res = await ticketApi.createTicket(payload);
//       // Expect { message, data: savedTicket } or savedTicket directly
//       return res?.data?.data ?? res?.data ?? res;
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// export const fetchMyTickets = createAsyncThunk(
//   'tickets/fetchMy',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await ticketApi.getMyTickets();
//       return Array.isArray(res?.data) ? res.data : res ?? [];
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// export const deleteTicket = createAsyncThunk(
//   'tickets/delete',
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       await ticketApi.deleteTicket(ticketId);
//       return ticketId;
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// export const updateTicketStatus = createAsyncThunk(
//   'tickets/updateStatus',
//   async ({ ticketId, status }, { rejectWithValue }) => {
//     try {
//       const res = await ticketApi.updateTicket({ ticketId, status });
//       return res?.data ?? res;
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// export const fetchTicketById = createAsyncThunk(
//   'tickets/fetchById',
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       const res = await ticketApi.getTicketById(ticketId);
//       return res?.data ?? res;
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// export const fetchAllTickets = createAsyncThunk(
//   'tickets/fetchTickets',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await ticketApi.getTicket();
//       return Array.isArray(res?.data) ? res.data : res ?? [];
//     } catch (error) {
//       return rejectWithValue(errMsg(error));
//     }
//   }
// );

// const initialState = {
//   items: [],
//   status: 'idle',         // list status: 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,            // string | null
//   singleTicket: null,
//   singleStatus: 'idle',   // detail status
//   createStatus: 'idle',   // optional: track create flow
// };

// const ticketSlice = createSlice({
//   name: 'tickets',
//   initialState,
//   reducers: {
//     resetTicketState: (state) => {
//       Object.assign(state, initialState);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create
//       .addCase(createTicket.pending, (state) => {
//         state.createStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(createTicket.fulfilled, (state, action) => {
//         state.createStatus = 'succeeded';
//         const created = action.payload;
//         if (created && created._id) {
//           state.items.unshift(created);
//         }
//       })
//       .addCase(createTicket.rejected, (state, action) => {
//         state.createStatus = 'failed';
//         state.error = action.payload || 'Failed to create ticket';
//       })

//       // Fetch my tickets
//       .addCase(fetchMyTickets.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchMyTickets.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(fetchMyTickets.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Failed to fetch tickets';
//       })

//       // Delete
//       .addCase(deleteTicket.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(deleteTicket.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const id = action.payload;
//         state.items = state.items.filter((t) => t._id !== id);
//         if (state.singleTicket?._id === id) {
//           state.singleTicket = null;
//           state.singleStatus = 'idle';
//         }
//       })
//       .addCase(deleteTicket.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Failed to delete ticket';
//       })

//       // Update status
//       .addCase(updateTicketStatus.fulfilled, (state, action) => {
//         const updated = action.payload;
//         if (updated?._id) {
//           const idx = state.items.findIndex((t) => t._id === updated._id);
//           if (idx !== -1) state.items[idx] = updated;
//           if (state.singleTicket?._id === updated._id) {
//             state.singleTicket = updated;
//           }
//         }
//       })
//       .addCase(updateTicketStatus.rejected, (state, action) => {
//         state.error = action.payload || 'Failed to update ticket';
//       })

//       // Fetch by id
//       .addCase(fetchTicketById.pending, (state) => {
//         state.singleStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchTicketById.fulfilled, (state, action) => {
//         state.singleStatus = 'succeeded';
//         state.singleTicket = action.payload || null;
//       })
//       .addCase(fetchTicketById.rejected, (state, action) => {
//         state.singleStatus = 'failed';
//         state.error = action.payload || 'Failed to fetch ticket';
//       })

//       // Fetch all (admin list)
//       .addCase(fetchAllTickets.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchAllTickets.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(fetchAllTickets.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Failed to fetch tickets';
//       });
//   },
// });

// export const { resetTicketState } = ticketSlice.actions;

// // Selectors
// export const selectTickets = (s) => s.tickets.items;
// export const selectTicketsStatus = (s) => s.tickets.status;
// export const selectTicketsError = (s) => s.tickets.error;
// export const selectCreateStatus = (s) => s.tickets.createStatus;
// export const selectTicketById = (id) => (s) =>
//   s.tickets.items.find((t) => t._id === id) || null;

// export default ticketSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketApi} from './ticketService';

const toYmd = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString().split('T');
};
const errMsg = (e) => e?.message || 'Unknown error';

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { rejectWithValue }) => {
  try {
    const payload = { ...ticketData, date: toYmd(ticketData.date) };
    const res = await ticketApi.createTicket(payload);
    return res.data ?? res; // server returns { success, message, data }
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});

export const fetchMyTickets = createAsyncThunk('tickets/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await ticketApi.getMyTickets();
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});

export const deleteTicket = createAsyncThunk('tickets/delete', async (ticketId, { rejectWithValue }) => {
  try {
    const res = await ticketApi.deleteTicket(ticketId);
    // server returns { success, id } or { success, data }
    return res?.id ?? ticketId;
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});

export const updateTicketStatus = createAsyncThunk('tickets/updateStatus', async ({ ticketId, status, remark }, { rejectWithValue }) => {
  try {
    const res = await ticketApi.updateTicket({ ticketId, status, ...(remark !== undefined ? { remark } : {}) });
    return res?.data ?? res;
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});

export const fetchTicketById = createAsyncThunk('tickets/fetchById', async (ticketId, { rejectWithValue }) => {
  try {
    const res = await ticketApi.getTicketById(ticketId);
    return res?.data ?? res;
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});

export const fetchAllTickets = createAsyncThunk('tickets/fetchTickets', async (_, { rejectWithValue }) => {
  try {
    const res = await ticketApi.getTicket();
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    return rejectWithValue(errMsg(error));
  }
});


const initialState = {
  items: [],
  status: 'idle',
  error: null,
  singleTicket: null,
  singleStatus: 'idle',
  createStatus: 'idle',
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    resetTicketState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createTicket.pending, (state) => { state.createStatus = 'loading'; state.error = null; })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const created = action.payload;
        if (created?._id) state.items.unshift(created);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || 'Failed to create ticket';
      })

      // Fetch mine
      .addCase(fetchMyTickets.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch tickets';
      })

      // Delete
      .addCase(deleteTicket.pending, (state) => { state.status = 'loading'; })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload;
        state.items = state.items.filter((t) => t._id !== id);
        if (state.singleTicket?._id === id) {
          state.singleTicket = null;
          state.singleStatus = 'idle';
        }
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete ticket';
      })

      // Update
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?._id) {
          const idx = state.items.findIndex((t) => t._id === updated._id);
          if (idx !== -1) state.items[idx] = updated;
          if (state.singleTicket?._id === updated._id) state.singleTicket = updated;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update ticket';
      })

      // Fetch by id
      .addCase(fetchTicketById.pending, (state) => { state.singleStatus = 'loading'; state.error = null; })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.singleStatus = 'succeeded';
        state.singleTicket = action.payload || null;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.singleStatus = 'failed';
        state.error = action.payload || 'Failed to fetch ticket';
      })

      // Admin fetch all
      .addCase(fetchAllTickets.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch tickets';
      });
  },
});

export const { resetTicketState } = ticketSlice.actions;
export default ticketSlice.reducer;
