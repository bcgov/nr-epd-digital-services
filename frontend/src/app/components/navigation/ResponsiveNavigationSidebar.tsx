import { Row, Dropdown, Nav } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import "./ResponsiveNavigationSidebar.css";

export const ResponsiveNavigationSidebar = () => {
  return (
    <>
      <Row className="d-md-none">
        <Dropdown className="my-4">
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-toggle"
            className="d-block d-md-none w-100"
          >
            Site Options
            <FaBars id="toggle-icon" />
          </Dropdown.Toggle>
          <div>
            <Dropdown.Menu id="dropdown-menu" className="">
              <Dropdown.Item>Home</Dropdown.Item>
              <Dropdown.Item>Sample Forms</Dropdown.Item>
              <Dropdown.Item>IMap BC</Dropdown.Item>
              <Dropdown.Item>Site Registry</Dropdown.Item>
            </Dropdown.Menu>
          </div>
        </Dropdown>
      </Row>
      <Row
        id="nav-panel-row"
        className="d-none d-sm-none d-md-block border mt-2 navPanelBoxShadow"
      >
        <Nav id="nav-panel" className="flex-column mx-2">
          <Nav.Link id="nav-link">Home</Nav.Link>
          <Nav.Link id="nav-link">Sample Forms</Nav.Link>
          <Nav.Link id="nav-link">IMap BC</Nav.Link>
          <Nav.Link id="nav-link">Site Registry</Nav.Link>
        </Nav>
      </Row>
    </>
  );
};
