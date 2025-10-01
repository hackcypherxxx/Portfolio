// src/redux/slices/skillSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchSkills = createAsyncThunk(
  'skills/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/skills');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSkill = createAsyncThunk(
  'skills/create',
  async (skill, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/skills', skill);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/skills/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const increaseSkill = createAsyncThunk(
  'skills/increase',
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/skills/${id}/increase`, { amount });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const decreaseSkill = createAsyncThunk(
  'skills/decrease',
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/skills/${id}/decrease`, { amount });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/skills/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const skillSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSkills.pending, state => {
        state.status = 'loading'; state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'; state.items = payload;
      })
      .addCase(fetchSkills.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload;
      })
      .addCase(createSkill.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateSkill.fulfilled, (state, { payload }) => {
        state.items = state.items.map(s => s._id === payload._id ? payload : s);
      })
      .addCase(increaseSkill.fulfilled, (state, { payload }) => {
        state.items = state.items.map(s => s._id === payload._id ? payload : s);
      })
      .addCase(decreaseSkill.fulfilled, (state, { payload }) => {
        state.items = state.items.map(s => s._id === payload._id ? payload : s);
      })
      .addCase(deleteSkill.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(s => s._id !== payload);
      });
  }
});

export default skillSlice.reducer;
