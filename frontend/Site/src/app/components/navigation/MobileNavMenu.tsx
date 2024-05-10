import React from "react";
import { getSideBarNavList } from "./dto/SideNav";
import "./MobileNavMenu.css";
import { Link } from 'react-router-dom';
import UserAccount from "../account/UserAccount";

const MobileNavMenu = (props:any) => {
  const menuOptions = getSideBarNavList();

  return (
    <div className="mobile-nav" >
      <div className="mobile-nav-top">
        {menuOptions.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div className="mobile-nav-menu-item flex-column" role="menu">
                <div
                  className="mobile-nav-menu-item flex-row"
                  role="menuitem"
                  aria-label={item.displayText}
                >
                  <Link to={item.linkTo}  className="displayLink" >
                  {item.icon && <item.icon className="sideBar-Icon" />}
                  {item.displayText && !item.icon && <span className="mobile-nav-section-bold-label mobile-nav-color-secondary">
                  {item.displayText}
                  </span>}
                  {item.displayText && item.icon && <span className="mobile-nav-section-bold-label mobile-nav-color-primary-default">
                  {item.displayText}
                  </span>}
                  </Link>
                </div>

                {item.children &&
                  item.children.map((item, index) => {
                    return (
                      <div key={index}
                        role="menuitem"
                        aria-label={item.displayText}
                        className="mobile-nav-menu-item mobile-nav-menu-item-child mobile-nav-section-bold-label" 
                      >
                        <Link to={item.linkTo} className="displayLink">
                        {item.icon && <item.icon className="sideBar-Icon" />}
                            <span className="mobile-nav-section-bold-label mobile-nav-color-primary-default">
                        {item.displayText}
                    </span>
                    </Link>
                      </div>
                    );
                  })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="mobile-nav-user-section">
        <UserAccount mobileView={props.mobileView} />
      </div>
    </div>
  );
};

export default MobileNavMenu;
