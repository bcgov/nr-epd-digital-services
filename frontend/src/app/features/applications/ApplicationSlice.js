import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  application: [],
  status: "idle",
  error: null,
};



const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {   
  }
});



export default applicationSlice.reducer;
