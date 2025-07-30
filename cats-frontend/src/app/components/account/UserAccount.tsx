import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './UserAccount.css';
import { DropdownIcon, DropdownUpIcon } from '../common/icon';
import { useAuth } from 'react-oidc-context';
import Avatar from '../avatar/Avatar';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Store';
import { useNavigate } from 'react-router-dom';

const UserAccount = (props: any) => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth?.user?.profile?.identity_provider === 'bceid') {
    navigate('/error');
    auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
  }

  const userObj = {
    firstname: auth.user?.profile.given_name,
    lastName: auth.user?.profile.family_name,
  };

  const [user, setUser] = useState(userObj);
  const [dropdownArrow, setDropdownArrow] = useState(false);
  const toggleButton = (event: any) => {
    event.stopPropagation();
    setDropdownArrow(!dropdownArrow);
  };

  useEffect(() => {
    setUser({
      firstname: auth.user?.profile.given_name,
      lastName: auth.user?.profile.family_name,
    });
  }, []);

  const signOut = () => {
    auth.removeUser();
    auth.signoutRedirect({
      id_token_hint: auth.user?.id_token,
    });
    auth.clearStaleState();
  };

  if (props.mobileView) {
    return (
      <>
        {/* Dropdown component for user account */}
        <div aria-label="User Account" className="d-md-none">
          <div role="navigation">
            {/* Logged in as label */}
            <div className="account-custom-label" id="user-account-label">
              Logged in as:
            </div>
            {/* Dropdown toggle button */}
            <div
              role="button"
              className="account-username py-3 d-flex align-items-center"
              aria-expanded={dropdownArrow}
              aria-controls="account-menu"
              aria-labelledby="user-account-label"
              onClick={toggleButton}
            >
              {/* Profile image */}
              <Avatar firstName={user.firstname} lastName={user.lastName} />
              {/* User name */}
              <div id="user-name" className="p-3">
                {user.firstname}
              </div>
              <div
                id="account-dropdown"
                className="account-custom-toggle-mobile align-item-center"
                aria-label="Account Menu Button"
              >
                {dropdownArrow ? <DropdownUpIcon /> : <DropdownIcon />}
              </div>
            </div>
          </div>
          {dropdownArrow && (
            <div
              role="menu"
              id="account-menu"
              aria-labelledby="account-dropdown"
              className="p-0"
            >
              {/* Account settings */}
              <div
                role="menuitem"
                aria-label="Account Settings"
                tabIndex={0} // Make focusable with keyboard
                className="account-custom-item-mobile"
              >
                Account Settings
              </div>
              {/* Logout */}
              <div
                role="menuitem"
                aria-label="Log Out"
                tabIndex={0} // Make focusable with keyboard
                className="account-custom-item-mobile"
                onClick={signOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Dropdown component for user account */}
        <Dropdown
          aria-label="User Account"
          className="d-md-flex justify-content-between d-sm-none d-none"
        >
          {/* Dropdown toggle button */}
          <div className="d-flex">
            <Dropdown.Toggle
              id="account-dropdown"
              variant=""
              className="account-custom-toggle p-0"
              aria-label="Account Menu"
            >
              {/* Profile image */}
              <div
                className="d-flex align-items-center "
                onClick={() => setDropdownArrow(!dropdownArrow)}
              >
                <Avatar firstName={user.firstname} lastName={user.lastName} />
                <div
                  id="account-dropdown"
                  className="ps-2"
                  aria-label="Account Menu Button"
                >
                  {dropdownArrow ? <DropdownUpIcon /> : <DropdownIcon />}
                </div>
              </div>
            </Dropdown.Toggle>
          </div>
          {/* Dropdown menu */}
          <Dropdown.Menu
            className="account-custom-menu"
            role="menu"
            aria-labelledby="account-dropdown"
          >
            {/* Logged in as label */}
            <Dropdown.Item
              role="menuitem"
              className="account-custom-item-first"
              disabled
              aria-disabled="true"
            >
              <div className="account-custom-label">Logged in as:</div>
              <div className="d-flex align-items-center account-username py-3 ">
                {/* Profile image */}
                <Avatar firstName={user.firstname} lastName={user.lastName} />
                {/* User name */}
                <span className="px-2">{user.firstname}</span>
              </div>
            </Dropdown.Item>
            <div className="pt-3">
              {/* Account settings */}
              <Dropdown.Item
                role="menuitem"
                className="account-custom-item"
                aria-label="Account Settings"
              >
                Account Settings
              </Dropdown.Item>

              {/* Logout */}
              <Dropdown.Item
                role="menuitem"
                className="account-custom-item"
                aria-label="Log Out"
                onClick={signOut}
              >
                Log Out
              </Dropdown.Item>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
};

export default UserAccount;
