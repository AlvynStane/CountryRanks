import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countriesSlice';
import newsReducer from './slices/newsSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    news: newsReducer,
  },
});