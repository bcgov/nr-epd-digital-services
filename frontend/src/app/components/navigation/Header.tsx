import React from "react";
import logo from "../../../app/images/logos/logo-banner.png";
import { useAuth } from "react-oidc-context";
import LoginDropdown from "../login/LoginDropdown";

import "./Header.css";


const Header = () => {
  const authRedirectUri = ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_LOGOUT_REDIRECT_URI ) || process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI || 'http://localhost:3000/'
  const auth = useAuth();
  return (
    <header className="navbar ">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="BC Government Logo" />
        </a>
        <h1>Land Remediation Services</h1>
      </div>
      
      <div id="authentication-button">
      {
        auth.isAuthenticated ? (
          <React.Fragment>
            <span>Welcome {auth.user?.profile.name}</span>
            <button className="btn btn-success" onClick={() => {
              auth.removeUser().then(()=>{
              window.location.href = authRedirectUri
              })
              }}>Log Out</button>
          </React.Fragment>
        )
        :
        (
          <>{LoginDropdown("Log In",100)}</>
        )
      }
      </div>    
    </header>
  );
};

export default Header;
