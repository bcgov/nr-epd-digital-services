import { Dropdown } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import "./LoginDropdown.css";

export const LoginDropdown = (title: string, width_override?: number) => {
  const auth = useAuth();

  return (
    <Dropdown id="login-selector-dropdown">
      <Dropdown.Toggle
        id="login-selector-dropdown-toggle"
        className="login-btn-lh"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu id="login-selector-dropdown-menu">
        <Dropdown.Header>Select Login Method</Dropdown.Header>
        <Dropdown.Item
          as="button"
          id="login-button-bceid"
          className="dropdown-item"
          onClick={() =>
            auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } })
          }
        >
          Basic/Business BCeID
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          id="login-button-bceid"
          className="dropdown-item"
          onClick={() =>
            auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bcsc" } })
          }
        >
          BC Services Card
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          id="login-button-idir"
          onClick={() =>
            auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "idir" } })
          }
        >
          IDIR
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LoginDropdown;
