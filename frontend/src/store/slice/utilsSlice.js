import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isloading: false,
  errorMsg: null,
  error: false,
  playlist_id: null,
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setError: (state, action) => {
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
      };
    },

    unsetError: (state, action) => {
      return {
        ...state,
        errorMsg: null,
        error: false,
      };
    },
    isloading: (state, action) => {
      switch (action.payload.type) {
        case "true":
          return { ...state, isloading: true };
        case "false":
          return { ...state, isloading: false };

        default:
          return { ...state };
      }
    },
    setPlaylist_id:(state,action)=>{
      return{
        ...state,
        playlist_id:action.payload
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const { isloading, unsetError, setError, setPlaylist_id } = utilsSlice.actions;

export default utilsSlice.reducer;
