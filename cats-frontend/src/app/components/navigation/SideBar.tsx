import React from 'react';
import './SideBar.css';
import { getSideBarNavList } from './dto/SideNav';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Store';
import { getLoggedInUserType, showNotification } from '../../helpers/utility';

function SideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const navList = getSideBarNavList(getLoggedInUserType());

  const renderMenuOption = (item: any, tabIndex: number) => {
    const isCurrentPath = location.pathname === item.linkTo;
    const hasIcon = item.icon;
    const isCartLink = item.linkTo.includes('cart');
    const displayCount = '0';

    const linkContent = isCartLink ? displayCount : item.displayText;
    const isParentGroup: boolean = item.displayText && !item.icon;
    return (
      <section
        tabIndex={tabIndex}
        aria-label={item.displayText}
        aria-roledescription="menu"
        role={isParentGroup ? 'group' : 'menuitem'}
        className={`sideBar-NavItem ${isCurrentPath && hasIcon ? 'currentPath' : ''} ${isParentGroup === false ? 'sideBar-menu-item-hover' : ''}`}
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
          {linkContent && hasIcon && (
            <Link
              to={item.linkTo}
              className={`sideBarDisplayText ${isCartLink ? 'cart-items-number' : ''} nav-section-bold-label nav-color-primary-default ps-2`}
              aria-label={item.displayText}
              role="menuitem"
            >
              {linkContent}
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
            <div className="sidebar-menu-group" key={item.id}>
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
            </div>
          ))}
      </div>

      <div className="sideBar-Nav" role="menu">
        {navList
          .filter((item: any) => item.lowerSection)
          .map((item: any, index: number) => (
            <div className="sidebar-menu-group" key={item.id}>
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
            </div>
          ))}
      </div>
    </div>
  );
}

export default SideBar;
