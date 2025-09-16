// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import taskService from './taskService';

// export const createTask = createAsyncThunk(
//   'tasks/create',
//   async (taskData, { rejectWithValue }) => {
//     try {
//       return await taskService.register(taskData);
//     } catch (err) {
//       return rejectWithValue(err?.message || 'Unknown error');
//     }
//   }
// );

// export const getTasks = createAsyncThunk(
//   'tasks/getTasks',
//   async (_, { rejectWithValue }) => {
//     try {
//       return await taskService.getTask();
//     } catch (err) {
//       return rejectWithValue(err?.message || 'Unknown error');
//     }
//   }
// );

// export const deleteTask = createAsyncThunk(
// 'tasks/deleteTask',
// async (taskId, { rejectWithValue }) => {
// try {
// const res = await taskService.deleteTask(taskId);
// return { id: taskId, server: res }; 
// } catch (e) {
// return rejectWithValue(e);
// }
// }
// );

// export const updateTask = createAsyncThunk(
//   'tasks/updateTask',
//   async ({ taskId, taskData }, { rejectWithValue }) => {
//     try {
//       // The returned value will be the updated task object
//       return await taskService.updateTask(taskId, taskData);
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );


// const initialState = {
//   tasks: [],
//   deletingIds: {}, 
//   loading: false,
//   error: null,
//   success: false,
// };

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     resetTaskState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//     removeTaskLocal(state, action) {
// const id = action.payload;
// state.items = state.items.filter(t => (t._id || t.id) !== id);
// },
// setTasks(state, action) {
// state.items = action.payload || [];
// },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createTask.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
//           state.tasks.push(action.payload.task || action.payload);
//         }
//       })
//       .addCase(createTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to create task';
//         state.success = false;
//       })
//       .addCase(getTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks = Array.isArray(action.payload)
//           ? action.payload
//           : Array.isArray(action.payload?.tasks)
//               ? action.payload.tasks
//               : [];
//       })
//       .addCase(getTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch tasks';
//       })
//       .addCase(deleteTask.pending, (state, action) => {
//         const id = action.meta.arg;
//         state.deletingIds[id] = true;
//         state.error = null;
//       })
//       .addCase(deleteTask.fulfilled, (state, action) => {
//         const id = action.payload.id;
//         state.tasks = state.tasks.filter(t => (t._id || t.id) !== id);
//         delete state.deletingIds[id];
//       })
//       .addCase(deleteTask.rejected, (state, action) => {
//         const id = action.meta.arg;
//         delete state.deletingIds[id];
//         state.error = action.payload?.message || action.error.message || 'Failed to delete task';
//       })
//        .addCase(updateTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateTask.fulfilled, (state, action) => {
//         state.loading = false;
//         // Find the index of the task that was updated
//         const index = state.tasks.findIndex(task => task._id === action.payload._id);
//         if (index !== -1) {
//           // Replace the old task with the updated one from the server
//           state.tasks[index] = action.payload;
//         }
//       })
//       .addCase(updateTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to update task';
//       });;

//   },
// });

// export const { resetTaskState } = taskSlice.actions;
// export default taskSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    return await taskService.register(taskData);
  } catch (err) {
    return rejectWithValue(err?.message || 'Unknown error');
  }
});

export const getTasks = createAsyncThunk('tasks/getTasks', async (_, { rejectWithValue }) => {
  try {
    return await taskService.getTask();
  } catch (err) {
    return rejectWithValue(err?.message || 'Unknown error');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    const res = await taskService.deleteTask(taskId);
    return { id: taskId, server: res };
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    return await taskService.updateTask(taskId, taskData);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const initialState = {
  tasks: [],
  deletingIds: {},
  loading: false,
  error: null,
  success: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    removeTaskLocal(state, action) {
      const id = action.payload;
      state.tasks = state.tasks.filter((t) => (t._id || t.id) !== id);
    },
    setTasks(state, action) {
      state.tasks = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.tasks.push(action.payload.task || action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
        state.success = false;
      })
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.tasks)
          ? action.payload.tasks
          : [];
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      .addCase(deleteTask.pending, (state, action) => {
        const id = action.meta.arg;
        state.deletingIds[id] = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.tasks = state.tasks.filter((t) => (t._id || t.id) !== id);
        delete state.deletingIds[id];
      })
      .addCase(deleteTask.rejected, (state, action) => {
        const id = action.meta.arg;
        delete state.deletingIds[id];
        state.error = action.payload?.message || action.error.message || 'Failed to delete task';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update task';
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
