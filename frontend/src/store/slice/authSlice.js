import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuth: false,
  username: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuth: true,
        username: localStorage.getItem("username"),
      };
    },
    loginError: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("device");
      localStorage.removeItem("playlist");
      localStorage.removeItem("username");
      return {
        ...state,
        token: null,
        isAuth: false,
        username: null,
      };
    },
    logout: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("device");
      localStorage.removeItem("playlist");
      localStorage.removeItem("username");
      return {
        ...state,
        token: null,
        isAuth: false,
        username: null,
      };
    },
    loadUser: (state, action) => {
      return {
        ...state,
        isAuth: true,
        token: action.payload.token,
        username: action.payload.username,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginError, loginSuccess, loadUser, logout } = authSlice.actions;

export default authSlice.reducer;
