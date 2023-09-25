import { Site } from '@/api/sites'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SelectionState {
    value: Site | undefined;
}


export const selectionSlice = ({
    name: 'selection',
    initialState: [],

    reducers: {
        select: (state, action: PayloadAction<Site>) => {
            console.log('Selection reducer start:', {state, action})
            state.value = action.payload;
        }
    }
});

export const { select } = selectionSlice.actions;
export default selectionSlice.reducers;