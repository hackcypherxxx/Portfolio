// src/redux/slices/contactSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Send contact message (with optional image)
export const sendContact = createAsyncThunk(
  'contact/send',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/contact', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    status: 'idle',
    error: null,
    message: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendContact.pending, state => {
        state.status = 'loading'; state.error = null;
      })
      .addCase(sendContact.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'; state.message = payload.message;
      })
      .addCase(sendContact.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload;
      });
  }
});

export default contactSlice.reducer;
