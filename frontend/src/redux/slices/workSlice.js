// src/redux/slices/workSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchWorks = createAsyncThunk(
  'works/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/works');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createWork = createAsyncThunk(
  'works/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/works', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateWork = createAsyncThunk(
  'works/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/works/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteWork = createAsyncThunk(
  'works/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/works/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const workSlice = createSlice({
  name: 'works',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWorks.pending, state => {
        state.status = 'loading'; state.error = null;
      })
      .addCase(fetchWorks.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'; state.items = payload;
      })
      .addCase(fetchWorks.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload;
      })
      .addCase(createWork.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(updateWork.fulfilled, (state, { payload }) => {
        state.items = state.items.map(w => w._id === payload._id ? payload : w);
      })
      .addCase(deleteWork.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(w => w._id !== payload);
      });
  }
});

export default workSlice.reducer;
