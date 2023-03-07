
import { store } from '../../app/Store'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router
  } from "react-router-dom";
import { ReactComponentElement, ReactHTMLElement } from 'react';
import { saveToLocalStorage } from '../../app/helpers/sessionManager';

// import {configureStore} from "@reduxjs/toolkit";
// import {usersReducer} from '../../app/features/users/UsersSlice'
// import {applicationReducer} from '../../app/features/applications/ApplicationSlice'


const TestWrapper = ({children}:any) =>{
    saveToLocalStorage as jest.Mock

    // if(initialState){
    //     const testStore = configureStore({reducer:{
    //         users: usersReducer,
    //         applications:applicationReducer
    //       },initialState})
    //     return(
    //         <Provider store={testStore}>
    //             <Router>
    //             </Router>
    //         </Provider>
    //     )
    // }
    
        return(
            <Provider store={store}>
                <Router>
                    {children}
                </Router>
            </Provider>
        )
}

export default TestWrapper
