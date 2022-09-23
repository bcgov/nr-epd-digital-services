import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { consoleLog } from "../../helpers/utility";
import { API , USERS } from "../../helpers/endpoints";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

  const response = await axios.get(API+USERS);
  consoleLog("response", response);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userAdded: {
      reducer(state, action) {
        state.users.push(action.payload);
      },
      prepare(name) {
        return {
          payload: {
            id: new Date().getTime(),
            name,
          },
        };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        consoleLog(action.payload.data);
        const loadedUsers = action.payload.slice();
        consoleLog("loadedUsers", loadedUsers);

        state.users = loadedUsers;

        consoleLog("state.users", state.users);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllUsers = (state) => state.users.users;
export const getAllUsersStatus = (state) => state.users.status;
export const getAllUsersError = (state) => state.users.error;

export const { userAdded } = usersSlice.actions;

export default usersSlice.reducer;
