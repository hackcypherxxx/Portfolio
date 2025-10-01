// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer     from './slices/authSlice';
import reviewReducer   from './slices/reviewSlice';
import categoryReducer from './slices/categorySlice';
import workReducer     from './slices/workSlice';
import skillReducer    from './slices/skillSlice';
import cvReducer       from './slices/cvSlice';
import contactReducer  from './slices/contactSlice';

// 1. Combine your slices into a root reducer
const rootReducer = combineReducers({
  auth:       authReducer,
  reviews:    reviewReducer,
  categories: categoryReducer,
  works:      workReducer,
  skills:     skillReducer,
  cv:         cvReducer,
  contact:    contactReducer
});

// 2. Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cv']  // only auth & cv slices will be persisted
};

// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create store with persisted reducer and proper middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// 5. Create persistor for the store
export const persistor = persistStore(store);
