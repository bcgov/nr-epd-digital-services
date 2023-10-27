import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    reducers: {
        setMinistryState: (state, action: PayloadAction<boolean>) => {
            state.isMinistry = action.payload;
        }
    }
})

export const { setMinistryState } = userSlice.actions
export default userSlice.reducer;