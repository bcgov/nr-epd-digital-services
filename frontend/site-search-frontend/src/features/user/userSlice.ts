import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    isMinistry: boolean
    userName: string;
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isMinistry: true,
        userName: 'USER NAME'
    },
    // TODO: Write reducer to switch to non-ministry user, put toggle in <Header />
    reducers: {}
})

export default userSlice.reducer;