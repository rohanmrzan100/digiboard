import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  device_id: null,
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      return {
        ...state,
        device_id: action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDevice } = deviceSlice.actions;

export default deviceSlice.reducer;
