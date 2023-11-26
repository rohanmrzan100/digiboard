import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  navToggle:false,
};

export const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {

    navToggle:(state,action)=>{
      return{
        ...state,
        navToggle: !state.navToggle
      }
    },

   
  },
});

// Action creators are generated for each case reducer function
export const { navToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
