import React from "react";
import "./Header.css";
import logo from "../../../app/images/logos/logo-banner.png";
import { useAuth } from "react-oidc-context";
import LoginDropdown from "../login/LoginDropdown";

const Header = () => {
  const auth = useAuth();
  return (
    <header className="navbar ">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="BC Government Logo" />
        </a>
        <h1>Land Remediation Services</h1>
      </div>
      <div className="other">&nbsp;
      {
        auth.isAuthenticated ? (
          <React.Fragment>
            <span>Welcome {auth.user?.profile.name}</span>
            <button className="btn btn-success" onClick={() => {
              auth.removeUser().then(()=>{
              window.location.href = process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI?process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI:"";
              })
              }}>Log Out</button>
          </React.Fragment>
        )
        :
        (
          <>{LoginDropdown("Log In")}</>
        )
      }
    
     
      </div>
    </header>
  );
};

export default Header;
