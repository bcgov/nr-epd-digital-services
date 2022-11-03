import React from "react";
import "./Header.css";
import logo from "../../../app/images/logos/logo-banner.png";
import { useAuth } from "react-oidc-context";

const Header = () => {
  const auth = useAuth();
  return (
    <header className="navbar ">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="Team ADA " />
        </a>
        <h1>Team ADA</h1>
      </div>
      <div className="other">&nbsp;
      {
        auth.isAuthenticated ? (
          <React.Fragment>
            <span>Welcome {auth.user?.profile.name}</span>
            <button className="btn btn-success" onClick={() => {console.log( auth); auth.signoutRedirect()}  }>Log Out</button>
          </React.Fragment>
        )
        :
        (
          <React.Fragment>
              <button  className="btn btn-warning" onClick={() => void auth.signinRedirect()}>Log in</button>

              <button  className="btn btn-success" onClick={() => void auth.signinRedirect({extraQueryParams:{
                'kc_idp_hint':'oidc'
              }})}>Log in with IDIR</button>
          </React.Fragment>
        )
      }
    
     
      </div>
    </header>
  );
};

export default Header;
