import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance } from "../../helpers/utility";
import { GRAPHQL } from "../../helpers/endpoints";
import { FETCH_USERS, ADD_USER, DELETE_USER, UPDATE_USER } from "./graphql/UserRequests";
import { print } from "graphql";
import { User } from "./dto/User";
import { UserState } from "./dto/UserState";
import {RequestStatus} from '../../helpers/requests/status'


const initialState: UserState = new UserState();

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  //console.log(FETCH_USERS);
  const request = await getAxiosInstance().post(GRAPHQL, {
    query: print(FETCH_USERS),
  });
  console.log(request);
  return request.data;
});


// export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
//   const response = await getAxiosInstance().get(API+USERS);
//   consoleLog("response", response);
//   return response.data;
// });

export const addNewUser = createAsyncThunk(
  "addNewUser",
  async (newUser:User) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(ADD_USER),
      variables: {
        user: {
          name: newUser.name,
        },
      },
    });
    return request.data;
  }
);

// export const addNewUser = createAsyncThunk("addNewUser", async (newUser) => {
//   console.log("Adding New User" + newUser)
//   const response = getAxiosInstance().post(API+USERS,newUser)
//   consoleLog("response addnewuser",response)
//   return response.data
// })

// export const deleteUser = createAsyncThunk(
//   "deleteUser",
//   async (userId: number) => {
//     const response = getAxiosInstance().delete(API + USERS + "/" + userId);
//     return (await response).data;
//     //consoleLog(`response deleteUser ${userId} `, );
//   }
// );

export const deleteUser = createAsyncThunk(
  "deleteUser", 
  async (userId: number) =>{
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(DELETE_USER),
      variables: {
        userId: userId
      }
    })
    return request
})

export const updateUser = createAsyncThunk(
  "updateUser",
  async (user:User) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(UPDATE_USER),
      variables:{
        updateUser: user
      }
    })
    return request
  })

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {

    resetAddedStatus: (state,action) =>{
      const newState =  {
        ...state
      }

      newState.addedStatus = RequestStatus.idle
      newState.fetchStatus =  RequestStatus.idle

      return newState;
    },
    resetDeleteStatus:(state,action)=>{
       const newState =  {
        ...state
      }
      newState.fetchStatus =  RequestStatus.idle;
      newState.deleteStatus =  RequestStatus.idle;
      return newState;
    },
    userAdded: {
      reducer(state, action) {
        const updatedArr: User[] = [state.users, action.payload];
        state.users = updatedArr;
      },
      prepare(name: string, email: string):any {
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
        const newState = { ...state };
        newState.fetchStatus =  RequestStatus.loading;
        return newState;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log("action res",action)
        const newState = { ...state };
        newState.fetchStatus =  RequestStatus.success;
        if( action.payload.data !== null){      
        const loadedUsers = action.payload.data.users.data.slice();       
        newState.users = loadedUsers;
        }
        else if(action.payload.errors.length > 0)
        {
          const errorMessage =  action.payload.errors[0].message;
          newState.error = errorMessage;
        }
        return newState;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.log("action",action)
        const newState = { ...state };
        newState.fetchStatus =  RequestStatus.failed
        newState.error = action.error.message!;        
        return newState;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.addedStatus = RequestStatus.success
        return newState;    
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.deleteStatus = RequestStatus.success
        return newState;          
      });
  },
});

export const selectAllUsers = (state: any) => state.users.users;
export const getAllUsersFetchStatus = (state: any) => state.users.fetchStatus;
export const getUserDeleteStatus = (state: any) => state.users.deleteStatus;
export const getUserAddedStatus = (state: any) => state.users.addedStatus;
export const getAllUsersError = (state: any) => state.users.error;

export const { userAdded,resetDeleteStatus,resetAddedStatus } = usersSlice.actions;

export default usersSlice.reducer;
