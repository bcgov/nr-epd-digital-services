import React from "react";
import "./Header.css";
import logo from "../../../app/images/logos/logo-banner.png";

const Header = () => {
  return (
    <header className="navbar ">
      <div className="banner">
        <a href="https://gov.bc.ca">
          <img src={logo} alt="Team ADA " />
        </a>
        <h1>Team ADA</h1>
      </div>
      <div className="other">&nbsp;</div>
    </header>
  );
};

export default Header;
