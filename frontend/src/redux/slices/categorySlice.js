  // src/redux/slices/categorySlice.js
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import api from '../api';

  export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await api.get('/api/categories');
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const createCategory = createAsyncThunk(
    'categories/create',
    async (name, { rejectWithValue }) => {
      try {
        const { data } = await api.post('/api/categories', { name });
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, name }, { rejectWithValue }) => {
      try {
        const { data } = await api.put(`/api/categories/${id}`, { name });
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
      try {
        await api.delete(`/api/categories/${id}`);
        return id;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

  const categorySlice = createSlice({
    name: 'categories',
    initialState: {
      items: [],
      status: 'idle',
      error: null
    },
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchCategories.pending, state => {
          state.status = 'loading'; state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, { payload }) => {
          state.status = 'succeeded'; state.items = payload;
        })
        .addCase(fetchCategories.rejected, (state, { payload }) => {
          state.status = 'failed'; state.error = payload;
        })
        .addCase(createCategory.fulfilled, (state, { payload }) => {
          state.items.push(payload);
        })
        .addCase(updateCategory.fulfilled, (state, { payload }) => {
          state.items = state.items.map(c =>
            c._id === payload._id ? payload : c
          );
        })
        .addCase(deleteCategory.fulfilled, (state, { payload }) => {
          state.items = state.items.filter(c => c._id !== payload);
        });
    }
  });

  export default categorySlice.reducer;
