import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
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
import SiteDetailsPage from './pages/site-details.tsx';
import MapPage from './pages/map.tsx';
import Notations from './features/site-details/notations.tsx';
import Participants from './features/site-details/participants.tsx';
import Documents from './features/site-details/documents.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Search />,
  },
  {
    path: "/advanced-search",
    element: <AdvancedSearch />
  },
  {
    path: '/site/:siteID',
    element: <SiteDetailsPage />,
    children: [
      {
        path: "notations",
        element: <Notations />
      },
      {
        path: "participants",
        element: <Participants />
      },
      {
        path: "documents",
        element: <Documents />
      }
    ]
  },
  {
    path: '/map',
    element: <MapPage />
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
       <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
