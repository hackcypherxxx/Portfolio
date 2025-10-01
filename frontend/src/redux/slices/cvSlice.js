// src/redux/slices/cvSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Fetch CV JSON data (requires auth)
export const fetchCV = createAsyncThunk(
  'cv/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/cv');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create or update CV (admin only)
export const upsertCV = createAsyncThunk(
  'cv/upsert',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/cv', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Download CV PDF blob
export const downloadCV = createAsyncThunk(
  'cv/download',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/cv/download', {
        responseType: 'blob'
      });
      return response.data; // PDF blob
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cvSlice = createSlice({
  name: 'cv',
  initialState: {
    data: null,
    status: 'idle',          // fetchCV & upsertCV status
    error: null,
    downloadStatus: 'idle',  // downloadCV status
    downloadError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchCV
      .addCase(fetchCV.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCV.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.data = payload;
      })
      .addCase(fetchCV.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })

      // upsertCV
      .addCase(upsertCV.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(upsertCV.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.data = payload;
      })
      .addCase(upsertCV.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })

      // downloadCV
      .addCase(downloadCV.pending, state => {
        state.downloadStatus = 'loading';
        state.downloadError = null;
      })
      .addCase(downloadCV.fulfilled, state => {
        state.downloadStatus = 'succeeded';
      })
      .addCase(downloadCV.rejected, (state, { payload }) => {
        state.downloadStatus = 'failed';
        state.downloadError = payload;
      });
  }
});

export default cvSlice.reducer;
