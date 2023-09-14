import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Search from './pages/search.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import AdvancedSearch from './pages/advanced-search.tsx';
import store from './store.ts'
import { Provider } from 'react-redux'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Search />,
  },
  {
    path: "/advanced-search",
    element: <AdvancedSearch />
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
       <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
