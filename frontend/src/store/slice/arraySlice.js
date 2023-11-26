import { createSlice } from "@reduxjs/toolkit";

export const arraySlice = createSlice({
  name: "host_upload",
  initialState: [],
  reducers: {
    addArray: (state, action) => {
      return [...state, action.payload];
    },
    removeArray: (state, action) => {
      let arrr = [];
      let arr = action.payload.array;
      const id = action.payload.id;
      const array = [...arr];

      if (array.length === 1) {
        arrr = [];
        return arrr;
      } else {
        arrr = array.filter((e) => e !== id);
        return arrr;
      }
    },
  },
});

export const { addArray, removeArray } = arraySlice.actions;

export default arraySlice.reducer;
