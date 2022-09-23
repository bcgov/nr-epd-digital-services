import {configureStore} from "@reduxjs/toolkit";
import usersReducer from './features/users/UsersSlice'

export const store = configureStore({
    reducer:{
        users: usersReducer
    }
})