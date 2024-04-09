import logo from "../../../app/images/logos/logo-banner.png";
import logoVertical from "../../../app/images/logos/logo-vertical.png"

import "./Header.css";

import { BarsIcon } from "../common/icon";
import { useState } from "react";
import MobileNavMenu from "./MobileNavMenu";
import { ArrowDownIcon } from "../common/icon";

const Header = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} className="logo" alt="BC Government Logo" />
          {/* <img src={logoVertical} className="logo" alt="BC Government Logo" /> */}
        </a>
        <h1 className="siteName">SITE</h1>
      </div>
      <div className="header-right-corner-section m-2">
        <div >EN <ArrowDownIcon/></div>

        <button
          className="navbar-toggler display-upto-medium"
          type="button"
          onClick={toggleNavbar}
          aria-label="menu for mobile/smaller devices"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="navbarMenu"
          aria-haspopup="true"
        >
          <BarsIcon className="bars-button" />
        </button>
      </div>
   
      <div
        className={`small-screen-menu mobile-menu ${
          isOpen ? "show" : "d-none"
        }`}
        onClick={() => toggleNavbar()}
      >
        <MobileNavMenu toggleOpen={toggleNavbar} />
      </div>
    </header>
  );
};

export default Header;
