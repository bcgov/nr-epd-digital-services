import React, { useEffect, useState } from 'react';
import './SideBar.css';
import SideNav, { getSideBarNavList } from './dto/SideNav';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { getLoggedInUserType } from '../../helpers/utility';

function SideBar() {
  const { user } = useAuth();
  const location = useLocation();

  // Specify the type for navList as SideNav[]
  const [navList, setNavList] = useState<SideNav[]>([]);

  useEffect(() => {
    setNavList(getSideBarNavList(getLoggedInUserType()));
  }, [user]);

  const renderMenuOption = (item: any, tabIndex: number) => {
    const isCurrentPath = location.pathname === item.linkTo;
    const hasIcon = item.icon;

    const isParentGroup: boolean = item.displayText && !item.icon;
    return (
      <section
        tabIndex={tabIndex}
        aria-label={item.displayText}
        aria-roledescription="menu"
        role={isParentGroup ? 'group' : 'menuitem'}
        className={`sideBar-NavItem ${isCurrentPath && hasIcon ? 'currentPath' : ''}`}
        key={item.id} // Use a unique key based on the item id
      >
        <div className="d-flex align-items-center">
          {hasIcon && (
            <Link
              to={item.linkTo}
              aria-label={item.displayText}
              className="pb-1"
            >
              <item.icon className="sideBar-Icon" />
            </Link>
          )}
        </div>
        {item.displayText && !hasIcon && (
          <span
            className="nav-section-bold-label nav-color-secondary"
            aria-label={item.displayText}
            role="menuitem"
          >
            {item.displayText}
          </span>
        )}
      </section>
    );
  };

  return (
    <div className="side-bar position-sticky">
      <div className="sideBar-Nav" role="menu">
        {navList
          .filter((item: any) => !item.lowerSection)
          .map((item: any, index: number) => (
            <React.Fragment key={item.id}>
              {' '}
              {/* Use item.id for a unique key */}
              {renderMenuOption(item, index + 1)}
              {item.children &&
                item.children.map((child: any) => (
                  <React.Fragment key={child.id}>
                    {' '}
                    {/* Ensure each child has a unique key */}
                    {renderMenuOption(child, index + 1)}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </div>

      <div className="sideBar-Nav" role="menu">
        {navList
          .filter((item: any) => item.lowerSection)
          .map((item: any, index: number) => (
            <React.Fragment key={item.id}>
              {' '}
              {/* Use item.id for a unique key */}
              {renderMenuOption(item, index + 1)}
              {item.children &&
                item.children.map((child: any) => (
                  <React.Fragment key={child.id}>
                    {' '}
                    {/* Ensure each child has a unique key */}
                    {renderMenuOption(child, index + 1)}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default SideBar;
