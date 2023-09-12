import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function Header() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">BCGov Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* <Nav.Link href="#home">Home</Nav.Link> */}
                {/* <Nav.Link href="#link">Link</Nav.Link> */}
                <NavDropdown title="Search" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/">Basic Search</NavDropdown.Item>
                  <NavDropdown.Item href="/advanced-search">
                    Advanced Search
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/map">Map Search</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}