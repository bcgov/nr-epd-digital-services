import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosInstance } from "../../helpers/utility";
import { GRAPHQL } from "../../helpers/endpoints";
import {
  FETCH_USERS,
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  FETCH_USER_PROFILE_VERIFY,
} from "./graphql/UserRequests";
import { print } from "graphql";
import { User } from "./dto/User";
import { UserState } from "./dto/UserState";
import { RequestStatus } from "../../helpers/requests/status";
import { ExternalUser } from "./dto/ExternalUser";

const initialState: UserState = {
  users:[],
  isProfileVerified:null,
  error:'',
  fetchStatus: 'idle',
  deleteStatus: 'idle',
  addedStatus: 'idle',
  externalUser: null,
  updateStatus: 'idle'
};

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const request = await getAxiosInstance().post(GRAPHQL, {
    query: print(FETCH_USERS),
  });

  return request.data;
});

export const fetchUserProfileVerification = createAsyncThunk(
  "fetchUserProfileVerification",
  async (userId: String) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(FETCH_USER_PROFILE_VERIFY),
      variables: {
        userId: userId,
      },
    });

    return request.data;
  }
);

export const addNewUser = createAsyncThunk(
  "addNewUser",
  async (newUser: User) => {
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

export const addNewExternalUser = createAsyncThunk(
  "addNewExternalUser",
  async (newUser: ExternalUser) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(ADD_USER),
      variables: {
        user: {
          firstName: newUser.firstName,
          userId: newUser.userId,
          lastName: newUser.lastName,
          addressLine: newUser.addressLine,
          city: newUser.city,
          province: newUser.province,
          country: newUser.country,
          postalCode: newUser.postalCode,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          organization: newUser.organization,
          isGstExempt: newUser.isGstExempt,
          isBillingContact: newUser.isBillingContact,
          userWorkStatus: newUser.userWorkStatus,
          userFNStatus: newUser.userFNStatus,
          organizationTypeId: newUser.organizationTypeId,
          regionId: newUser.regionId,
          isProfileVerified: newUser.isProfileVerified,
          industry: newUser.industry,
        },
      },
    });
    return request.data;
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (userId: number) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(DELETE_USER),
      variables: {
        userId: userId,
      },
    });
    return request;
  }
);

export const updateUser = createAsyncThunk("updateUser", async (user: User) => {
  const request = await getAxiosInstance().post(GRAPHQL, {
    query: print(UPDATE_USER),
    variables: {
      updateUser: user,
    },
  });
  return request;
});

export const updateExternalUser = createAsyncThunk(
  "updateExternalUser",
  async (user: ExternalUser) => {
    const request = await getAxiosInstance().post(GRAPHQL, {
      query: print(UPDATE_USER),
      variables: {
        updateUser: user,
      },
    });
    return request.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUpdateStatus: (state, action) => {
      const newState = {
        ...state,
      };

      newState.updateStatus = RequestStatus.idle;
      newState.fetchStatus = RequestStatus.idle;

      return newState;
    },
    resetAddedStatus: (state, action) => {
      const newState = {
        ...state,
      };

      newState.addedStatus = RequestStatus.idle;
      newState.fetchStatus = RequestStatus.idle;

      return newState;
    },
    resetDeleteStatus: (state, action) => {
      const newState = {
        ...state,
      };
      newState.fetchStatus = RequestStatus.idle;
      newState.deleteStatus = RequestStatus.idle;
      return newState;
    },
    userAdded: {
      reducer(state, action) {
        const updatedArr: User[] = [state.users, action.payload];
        state.users = updatedArr;
      },
      prepare(name: string, email: string): any {
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
      .addCase(fetchUserProfileVerification.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.isProfileVerified = action.payload.data.user.profileVerified;
        newState.externalUser = action.payload.data.user.data;
        if (newState.externalUser) {
          newState.externalUser.isBillingContactST =
            newState.externalUser.isBillingContact.toString();

          newState.externalUser.isGstExemptST =
            newState.externalUser.isGstExempt.toString();
        }

        return newState;
      })
      .addCase(fetchUserProfileVerification.pending, (state, action) => {
        const newState = { ...state };

        return newState;
      })
      .addCase(fetchUserProfileVerification.rejected, (state, action) => {
        const newState = { ...state };

        return newState;
      })
      .addCase(fetchUsers.pending, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.fetchStatus = RequestStatus.success;
        return newState;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        const newState = { ...state };
        return newState;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        const newState = { ...state };
        return newState;
      })
      .addCase(addNewExternalUser.fulfilled, (state, action) => {
        const newState = { ...state };

        console.log("action.payload",action.payload)

        if (action.payload.errors?.length > 0) {
          newState.addedStatus = RequestStatus.failed;
        } else {
          newState.addedStatus = RequestStatus.success;
          newState.isProfileVerified = true;
        }

        return newState;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const newState = { ...state };
        return newState;
      })
      .addCase(updateExternalUser.fulfilled, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.success;
        return newState;
      })
      .addCase(updateExternalUser.pending, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.loading;
        return newState;
      })
      .addCase(updateExternalUser.rejected, (state, action) => {
        const newState = { ...state };
        newState.updateStatus = RequestStatus.failed;
        return newState;
      });
  },
});

export const selectAllUsers = (state: any) => state.users.users;
export const getAllUsersFetchStatus = (state: any) => state.users.fetchStatus;
export const getUserDeleteStatus = (state: any) => state.users.deleteStatus;
export const getUserAddedStatus = (state: any) => state.users.addedStatus;
export const getUserUpdateStatus = (state: any) => state.users.updateStatus;
export const getAllUsersError = (state: any) => state.users.error;
export const isProfileVerified = (state: any) => state.users.isProfileVerified;
export const getExternalUser = (state: any) => state.users.externalUser;
export const {
  userAdded,
  resetDeleteStatus,
  resetAddedStatus,
  resetUpdateStatus,
} = usersSlice.actions;

export default usersSlice.reducer;
