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
            <button className="btn btn-success" onClick={() => {
               auth.removeUser().then(()=>{
               window.location.href = process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI?process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI:"";
              })
              }}>Log Out</button>
          </React.Fragment>
        )
        :
        (
          <React.Fragment>
              {/* <button  className="btn btn-warning" onClick={() => void auth.signinRedirect()}>LogIn</button> */}

              <button  className="btn btn-success" onClick={() => void auth.signinRedirect({extraQueryParams:{
                'kc_idp_hint':'oidc'
              }})}>LogIn with IDIR</button>

<button  className="btn btn-info" onClick={() => void auth.signinRedirect({extraQueryParams:{
                'kc_idp_hint':'bceid'
              }})}>LogIn with BCEID</button>
          </React.Fragment>
        )
      }
    
     
      </div>
    </header>
  );
};

export default Header;
