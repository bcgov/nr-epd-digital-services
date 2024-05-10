import logo from "../../../app/images/logos/logo-banner.png";
import logoVertical from "../../../app/images/logos/logo-vertical.png"

import "./Header.css";
import moon from "../../images/moon.png";
import { BarsIcon } from "../common/icon";
import { useState } from "react";
import MobileNavMenu from "./MobileNavMenu";
import { ArrowDownIcon } from "../common/icon";
import LanguageSwitcher from "../language/LanguageSwitcher";
import UserAccount from "../account/UserAccount";

const Header = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <div className="banner" tabIndex={1} role="navigation">
        <a href="https://gov.bc.ca">
          <img src={logo} className="logo" alt="BC Government Logo" />
          {/* <img src={logoVertical} className="logo" alt="BC Government Logo" /> */}
        </a>
        <h1 className="siteName">SITE</h1>
      </div>
      <div className="header-right-corner-section d-flex align-items-center">
        <LanguageSwitcher/>
        <button
          className="navbar-toggler display-upto-medium no-bg-br-outline" 
          type="button"
          onClick={toggleNavbar} 
          aria-label="menu for mobile/smaller devices"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="navbarMenu"
          aria-haspopup="true"
        >
          <BarsIcon className="bars-button" />
        </button>
        <div className="d-sm-none d-md-flex d-none">
          {/* Profile image */}
          <img src={moon} alt="Moon image for theme."/>
        </div>
        {!isOpen && <UserAccount  mobileView={isOpen}/>}
       
      </div>   
      <div role="menu"
        className={`small-screen-menu mobile-menu ${
          isOpen ? "show" : "d-none"
        }`}
        onClick={() => toggleNavbar()}
      >
        <MobileNavMenu toggleOpen={toggleNavbar} mobileView={isOpen}/>
      </div>
    </header>
  );
};

export default Header;
