import logo from "../../../app/images/logos/logo-banner.png";

import "./Header.css";
import { BarsIcon } from "../common/icon";
import { useState } from "react";
import MobileNavMenu from "./MobileNavMenu";
import UserAccount from "../account/UserAccount";
import { LoginDropdown } from "../login/LoginDropdown";
import { useAuth } from "react-oidc-context";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const auth = useAuth()

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar position-sticky navbar-for-small-device">
      <div className="banner" tabIndex={1} role="navigation">
        <a href="https://gov.bc.ca">
          <img src={logo} className="logo" alt="BC Government Logo" />
        </a>
        <a href="/" className="no-link-style">
          <h1 className="siteName">CATS </h1>
        </a>
      </div>
      <div className="header-right-corner-section d-flex align-items-center">
        {/* <LanguageSwitcher /> */}

        <button
          className="navbar-toggler display-upto-medium no-bg-br-outline custom-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-label="menu for mobile/smaller devices"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="navbarMenu"
          aria-haspopup="true"
        >
          <BarsIcon className="bars-button" />
        </button>

        {/* <div className="d-sm-none d-md-flex d-none">       
        <img src={moon} alt="Moon image for theme." />
      </div> */}
        {!auth.isAuthenticated && <LoginDropdown title="Sign in" />}
        {!isOpen && auth.isAuthenticated && <UserAccount mobileView={isOpen} />}
      </div>
      <div
        role="menu"
        className={`small-screen-menu mobile-menu ${
          isOpen ? "show" : "d-none"
        }`}
        onClick={() => toggleNavbar()}
      >
        <MobileNavMenu toggleOpen={toggleNavbar} mobileView={isOpen} />
      </div>
    </header>
  );
};

export default Header;
