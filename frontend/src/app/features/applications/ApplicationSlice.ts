import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastVisitedURL: "",
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    updateLastVisitURL: (state, action) => {
      //console.log(action.payload)
      const newState = { ...state };
      newState.lastVisitedURL = action.payload;
      return newState;
    },
  },
});

export const getLastVisitedURL = (state: any) => {
  //console.log(state.applications.lastVisitedURL)
  return state.applications.lastVisitedURL;
};

export const { updateLastVisitURL } = applicationSlice.actions;

export default applicationSlice.reducer;
