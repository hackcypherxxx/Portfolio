// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Fetch current admin user (e.g. validate session, get welcome message)
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/dashboard');
      // expect { message: 'Welcome, Admin!' }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Login admin
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      // expect { message: 'Login successful', token: '…' }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Logout admin
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/logout');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userMessage: null,  // truthy when authenticated
    status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.userMessage = payload.message;
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.userMessage = payload.message;
        // optionally store token: state.token = payload.token;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.userMessage = null;
        state.status = 'idle';
        state.error = null;
        // optionally clear token: state.token = null;
      });
  }
});

export default authSlice.reducer;
