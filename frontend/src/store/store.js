import { configureStore } from "@reduxjs/toolkit";
import toggleSlice from "./slice/toggleSlice";
import authSlice from "./slice/authSlice";
import utilsSlice from "./slice/utilsSlice";
import deviceSlice from "./slice/deviceSlice";
import arraySlice from "./slice/arraySlice";

export const store = configureStore({
  reducer: {
    toggle: toggleSlice,
    auth: authSlice,
    utils: utilsSlice,
    device: deviceSlice,
    array: arraySlice,
  },
});
