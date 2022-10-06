import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { consoleLog,generateRequestId ,getAxiosInstance} from "../../helpers/utility";
import { API , USERS } from "../../helpers/endpoints";

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const response = await getAxiosInstance().get(API+USERS);
  consoleLog("response", response);
  return response.data;
});

export const addNewUser = createAsyncThunk("addNewUser", async (newUser) => {
  const response = getAxiosInstance().post(API+USERS,newUser)
  consoleLog("response addnewuser",response)
  return response.data
})

export const deleteUser = createAsyncThunk("deleteUser", async (userId) =>{
  const response = getAxiosInstance().delete(API+USERS+userId)
  consoleLog(`response deleteUser ${userId} `, response)
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userAdded: {
      reducer(state, action) {
        state.users.push(action.payload);
      },
      prepare(name,email) {
        return {
          payload: {
            id: new Date().getTime(),
            name,
            email,
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
      })

      .addCase(addNewUser.fulfilled, (state,action) =>{
        state.status = "succeeded"
        consoleLog("Payload at addnewuser",action.payload)
        state.users.push(action.payload)
      })
  },
});

export const selectAllUsers = (state) => state.users.users;
export const getAllUsersStatus = (state) => state.users.status;
export const getAllUsersError = (state) => state.users.error;

export const { userAdded } = usersSlice.actions;

export default usersSlice.reducer;
