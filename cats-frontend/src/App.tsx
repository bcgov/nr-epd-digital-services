import './App.css';
import Header from './app/components/navigation/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SideBar from './app/components/navigation/SideBar';
import { useState } from 'react';
import { useAutoSignin } from '@cats/hooks/useAutoSignIn';

import 'react-toastify/dist/ReactToastify.css';
import '@bcgov/design-tokens/css/variables.css';
import '@bcgov/bc-sans/css/BC_Sans.css';

function App() {
  useAutoSignin();

  return (
    <div className="container-fluid p-0">
      <Header />
      <div className="row m-0 p-0">
        <div className="d-none d-md-block p-0 position-fixed sidebar-container">
          <SideBar />
        </div>
        <div className="col p-0 content-container">
          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
