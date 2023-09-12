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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Search />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
