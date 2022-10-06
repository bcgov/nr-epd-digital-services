import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import UsersSlice, {userReducer} from '../../app/features/users/UsersSlice'

export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = configureStore({reducer: {user: UsersSlice}, preloadedState}),
        ...renderOptions
    } = {}
){
    function Wrapper({children}) {
        return <Provider store={store}>{children}</Provider>
    }

    return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}

