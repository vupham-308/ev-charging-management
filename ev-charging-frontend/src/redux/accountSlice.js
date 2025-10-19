import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: () => {
      return initialState;
    },
    setAccount: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
export const { login, logout,setAccount  } = accountSlice.actions;

export default accountSlice.reducer;
