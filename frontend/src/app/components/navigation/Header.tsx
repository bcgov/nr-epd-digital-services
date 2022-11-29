import logo from "../../../app/images/logos/logo-banner.png";
import { useAuth } from "react-oidc-context";
import LoginDropdown from "../login/LoginDropdown";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate} from "react-router";

import "./Header.css";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="BC Government Logo" />
        </a>
        <h1>Land Remediation Services</h1>
      </div>
      
      
      {
        auth.isAuthenticated ? (
          <Dropdown>
            <Dropdown.Toggle>
              {auth.user?.profile.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item tag={Button} onClick={()=>{navigate("/dashboard")}} >  
                  Dashboard
            </Dropdown.Item>
            <Dropdown.Item tag={Button} onClick={()=>{navigate("/userprofile")}} >  
                  Profile
            </Dropdown.Item>
              
              <Dropdown.Item as="button" onClick={() => {
                    auth.removeUser().then(()=>{
                      window.location.href = process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI?process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI:"";})
                  }}>
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        )
        :
        (
          //Unauthenticated Users are shown login button
          <div id="authentication-button">{LoginDropdown("Log In",100)}</div>
        )
      }
    </header>
  );
};

export default Header;
