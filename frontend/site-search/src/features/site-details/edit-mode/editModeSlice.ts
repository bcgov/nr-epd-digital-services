import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface EditModeState {
    editMode: boolean;
}

export const editModeSlice = createSlice({
    name: 'edit',
    initialState: {
        editMode: false
    },
    reducers: {
        changeEditMode(state, action: PayloadAction<boolean>) {
            state.editMode = action.payload;
        },
        toggleEdit(state) {
            state.editMode = !state.editMode;
        }
    }
})

export const {toggleEdit, changeEditMode} = editModeSlice.actions;

export default editModeSlice.reducer;