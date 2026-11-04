import { createSlice } from '@reduxjs/toolkit';

// Récupérer les informations sauvegardées dans localStorage
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null
  },

  reducers: {
    // 1. Enregistrer l'utilisateur et son token JWT après login
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem(
        'user',
        JSON.stringify(action.payload.user)
      );

      localStorage.setItem('token', action.payload.token);
    },

    // 2. Déconnecter l'utilisateur et vider localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

// Exporter les actions
export const { loginSuccess, logout } = authSlice.actions;

// Exporter le reducer
export default authSlice.reducer;