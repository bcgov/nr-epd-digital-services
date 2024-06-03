import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import './UserAccount.css';
import avatar from '../../images/avatar.png';
import { DropdownIcon, DropdownUpIcon } from "../common/icon";

const UserAccount = ( props : any) =>{
    // Sample user data
    const userObj = {
        name: 'Ipsum, Loren WLRS:EX',
        profileImage: avatar, // URL to the profile image
    };

    const [user, setUser] = useState(userObj);
    const [dropdownArrow, setDropdownArrow] = useState(false);
    const toggleButton = (event : any) => {
      event.stopPropagation();
      setDropdownArrow(!dropdownArrow);
    }

    if(props.mobileView)
    {
      return (
        <>
          {/* Dropdown component for user account */}
          <div aria-label="User Account" className="d-md-none">
              <div role="navigation">
                  {/* Logged in as label */}
                  <div className="account-custom-label" id="user-account-label">Logged in as:</div>
                  {/* Dropdown toggle button */}
                  <div  role="button" className="account-username py-3 d-flex align-items-center" aria-expanded={dropdownArrow}
            aria-controls="account-menu"
            aria-labelledby="user-account-label" onClick={toggleButton}>
                    {/* Profile image */}
                    <img src={user.profileImage} alt="User profile image." className="account-image"  aria-hidden="true"   role="img"
        aria-label="User profile image"/>
                    {/* User name */}
                    <div className="p-3">{user.name}</div>
                    <div id="account-dropdown" className="account-custom-toggle-mobile align-item-center" aria-label="Account Menu Button">
                     { dropdownArrow ? <DropdownUpIcon/> : <DropdownIcon/> }
                    </div>
                  </div>
              </div>
              { dropdownArrow && 
              <div role="menu" id="account-menu"
              aria-labelledby="account-dropdown" className="p-0">
                  {/* Account settings */}
                  <div role="menuitem" 
                  aria-label="Account Settings"
                  tabIndex={0} // Make focusable with keyboard 
                  className="account-custom-item-mobile">Account Settings</div>
                  {/* Logout */}
                  <div role="menuitem" aria-label="Log Out"
                  tabIndex={0} // Make focusable with keyboard
                  className="account-custom-item-mobile">Log Out</div>
              </div>
              }
          </div>
        </>
      )
    }
    else {
            return(
            <>
              {/* Dropdown component for user account */}
              <Dropdown aria-label="User Account" className="d-md-flex justify-content-between d-sm-none d-none">
                {/* Dropdown toggle button */}
                <div className="d-flex">
                    <Dropdown.Toggle id="account-dropdown" variant="" className="account-custom-toggle p-0 pe-2" aria-label="Account Menu">
                       {/* Profile image */}
                    <img src={user.profileImage} alt="User profile image." className="account-image" />
                    </Dropdown.Toggle>
                </div>
                {/* Dropdown menu */}
                <Dropdown.Menu className="account-custom-menu" role="menu" aria-labelledby="account-dropdown">
                    {/* Logged in as label */}
                    <Dropdown.Item role="menuitem" className="account-custom-item-first" disabled aria-disabled="true">
                        <div className="account-custom-label">Logged in as:</div>
                        <div className="account-username py-3">
                            {/* Profile image */}
                            <img src={user.profileImage} alt="User profile image." className="account-image me-3"   role="img"
        aria-label="User profile image"/>

                            {/* User name */}
                            <span>{user.name}</span>
                        </div>
                    </Dropdown.Item>
                    <div className="pt-3">
                      {/* Account settings */}
                      <Dropdown.Item role="menuitem" className="account-custom-item" aria-label="Account Settings">Account Settings</Dropdown.Item>

                      {/* Logout */}
                      <Dropdown.Item role="menuitem" className="account-custom-item" aria-label="Log Out">Log Out</Dropdown.Item>
                    </div>
                </Dropdown.Menu>
              </Dropdown>
            </>
            )
      }
}


export default UserAccount;