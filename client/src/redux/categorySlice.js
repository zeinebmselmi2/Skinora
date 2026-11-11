import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    categoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    categoriesSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    categoriesFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { categoriesStart, categoriesSuccess, categoriesFail } = categorySlice.actions;
export default categorySlice.reducer;
