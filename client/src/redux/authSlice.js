import { createSlice } from '@reduxjs/toolkit';

// Au chargement, on relit l'utilisateur sauvegardé dans le navigateur.
const storedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.success = action.payload.message;
      state.error = null;
    },
    authFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.success = 'Déconnexion réussie.';
    },
    clearAuthMessages(state) {
      state.error = null;
      state.success = null;
    }
  }
});

export const { authStart, authSuccess, authFail, logout, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
