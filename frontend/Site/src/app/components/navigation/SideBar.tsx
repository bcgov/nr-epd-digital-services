import React, { useState } from "react";
import "./SideBar.css";
import { getSideBarNavList } from "./dto/SideNav";
import { AnglesLeftIcon } from "../common/icon";
import { AnglesRightIcon } from "../common/icon";
import { Link, useLocation } from 'react-router-dom';

function SideBar() {
  //console.log('getSideBarNavList()',getSideBarNavList());
  const navList = getSideBarNavList();
  const location = useLocation();
  let tabIndex = 1;

  const renderMenuOption = (item: any, index: number) => {
    ++tabIndex;

    const isCurrentPath = location.pathname === item.linkTo;

    return (
      <div tabIndex={tabIndex}  className={`sideBar-NavItem ${isCurrentPath && item.icon ? 'currentPath' : ''}`} role="menuitem">
        {item.icon && <item.icon className="sideBar-Icon" />}
        {item.displayText && item.icon && (
          <Link
          to={item.linkTo}
          className={`sideBarDisplayText nav-section-bold-label nav-color-primary-default`}
          aria-label={item.displayText}    
               
        >
          {item.displayText}
        </Link>
        )}
        {item.displayText && !item.icon && (
           <span
           className="nav-section-bold-label nav-color-secondary"
           aria-label={item.displayText}
         >
           {item.displayText}
         </span>
          // <span className="nav-section-bold-label nav-color-secondary" aria-label={item.displayText}>
          //   {" "}
          //   {item.displayText}{" "}
          // </span>
        )}
      </div>
    );
  };

  return (
    <div className="side-bar">
      <div className="sideBar-Nav">
        {navList
          .filter((item) => {
            return !item.lowerSection;
          })
          .map((item, index) => (
            <React.Fragment key={index}>
              {renderMenuOption(item,index)}
              {item.children &&
                item.children.map((child, index) => {
                  return (
                     <React.Fragment key={index}>
                        {renderMenuOption(child,index)}
                      </React.Fragment>
                  );
                })}
            </React.Fragment>
          ))}
      </div>

      <div className="sideBar-Nav">
        {navList
          .filter((item) => {
            return item.lowerSection;
          })
          .map((item, childIndex) => (
            <React.Fragment key={childIndex}>
              {renderMenuOption(item,childIndex)}
              {item.children &&
                item.children.map((item, index) => {
                  return renderMenuOption(item,index);
                })}
              {/* Additional static item */}
              {/* <div className="sideBar-NavItem arrows">
                <AnglesLeftIcon className="sideBar-Icon arrow-right" />
                <AnglesRightIcon className="sideBar-Icon arrow-left" />
              </div> */}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default SideBar;
