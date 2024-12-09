import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchNews = createAsyncThunk(
    'news/fetchNews', 
    async () => {
        const response = await axios.get(
            `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${API_KEY}`
        );
        return response.data.results;
    }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: { 
    articles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
