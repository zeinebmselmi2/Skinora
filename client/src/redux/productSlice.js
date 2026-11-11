import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    productsStart(state) {
      state.loading = true;
      state.error = null;
    },
    productsSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    },
    productSuccess(state, action) {
      state.loading = false;
      state.current = action.payload;
      state.error = null;
    },
    productCreated(state, action) {
      state.loading = false;
      state.items.unshift(action.payload);
      state.success = 'Produit ajouté.';
      state.error = null;
    },
    productDeleted(state, action) {
      state.loading = false;
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.success = 'Produit supprimé.';
      state.error = null;
    },
    productsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductMessages(state) {
      state.error = null;
      state.success = null;
    }
  }
});

export const {
  productsStart,
  productsSuccess,
  productSuccess,
  productCreated,
  productDeleted,
  productsFail,
  clearProductMessages
} = productSlice.actions;

export default productSlice.reducer;
