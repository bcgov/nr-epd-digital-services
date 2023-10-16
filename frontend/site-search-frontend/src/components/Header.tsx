import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { setMinistryState } from '@/features/user/userSlice';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';



export default function Header() {
  const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
  const dispatch = useDispatch();


  function minstryToggleChange(e) {
    console.log('ministryToggleChange', { isMinistry, e });
    dispatch(setMinistryState(!isMinistry));
  }



  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">BCGov Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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
            
            <NavDropdown title="Options" id="nav-options">
                <div className="p-1">
                  <Form.Check
                    type="switch"
                    label="Ministry Mode"
                    id="ministry-mode-toggle"
                    onChange={minstryToggleChange}
                    checked={isMinistry}
                  />
                </div>
            </NavDropdown>


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}