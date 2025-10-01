// src/redux/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/reviews');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/reviews', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/reviews/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/reviews/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReviews.pending, state => {
        state.status = 'loading'; state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'; state.items = payload;
      })
      .addCase(fetchReviews.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload;
      })
      .addCase(createReview.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(updateReview.fulfilled, (state, { payload }) => {
        state.items = state.items.map(r => r._id === payload._id ? payload : r);
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(r => r._id !== payload);
      });
  }
});

export default reviewSlice.reducer;
