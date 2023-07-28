import logo from "../../../app/images/logos/logo-banner.png";
import { useAuth } from "react-oidc-context";
import LoginDropdown from "../login/LoginDropdown";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router";

import "./Header.css";
import { getExternalUser } from "../../features/users/UsersSlice";
import { useSelector } from "react-redux";
import { ExternalUser } from "../../features/users/dto/ExternalUser";

const Header = () => {
  const authRedirectUri = ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_LOGOUT_REDIRECT_URI ) || process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI || 'http://localhost:4000/'
  const auth = useAuth();
  const navigate = useNavigate();
  const savedExternalUser:ExternalUser = useSelector(getExternalUser);
  return (
    <header className="navbar fixed-top">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="BC Government Logo" />
        </a>
        <h1>Site Remediation Services</h1>
      </div>
      {auth.isAuthenticated ? (
        <Dropdown>
          <Dropdown.Toggle id="logged-in-toggle">           
            {savedExternalUser? savedExternalUser.firstName.toUpperCase() +' ' + savedExternalUser.lastName.toUpperCase() :  auth.user?.profile.name }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {auth.user?.profile.identity_provider === "bceid" && ( //Only BCEID/Public Users should be able to edit their profile
              <Dropdown.Item
                tag={Button}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Profile
              </Dropdown.Item>
            )}
            <Dropdown.Item
              tag={Button}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </Dropdown.Item>

            <Dropdown.Item
              as="button"
              onClick={() => {
                auth.removeUser().then(() => {
                  window.location.href = authRedirectUri
                });
              }}
            >
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        //Unauthenticated Users are shown login button
        <div id="authentication-button" className="mr-4">
          {LoginDropdown("Log In", 0)}
        </div>
      )}
    </header>
  );
};

export default Header;
