import './App.css';
import Header from './app/components/common/Header'
import Footer from './app/components/common/Footer';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { useAuth } from "react-oidc-context";

import AppRoutes from './app/routes/Routes';
import React from 'react';

function App() {

  const auth = useAuth();

  return (
    <div  className="container-fluid p-0">
      <Header></Header>
      {auth.isAuthenticated ?  (
        <React.Fragment>
        <Router >
          <AppRoutes/>
        </Router>   
      <Footer></Footer>
      </React.Fragment>
      ) : ( <React.Fragment>
        <div>Please log in to start</div>
      </React.Fragment>)
}
    </div>
  );
}

export default App;
