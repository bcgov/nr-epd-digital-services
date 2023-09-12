import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Link from 'next/link';
import { NavLink } from 'react-bootstrap';


export default function Header() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand><Link href='/'>BCGov</Link></Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* WORKING! Took a lot of iterating to get Nav.Link and <Link> to play nice. */}
                {/* <Nav.Link as="span"><Link href="/">Search</Link></Nav.Link>  */}
                {/* <Nav.Link href="#link">Dropdown</Nav.Link> */}
                <NavDropdown title="Search" id="basic-nav-dropdown">
                  {/* <NavDropdown.Item href="#action/3.1">Basic Search</NavDropdown.Item> */}
                  <Nav.Link as="span"><Link href="/">Basic Search</Link></Nav.Link> 
                  <Nav.Link as="span"><Link href="/advanced-search">Advanced Search</Link></Nav.Link> 
                  <Nav.Link as="span"><Link href="/map">Map Search</Link></Nav.Link> 
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}