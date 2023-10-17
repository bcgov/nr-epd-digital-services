import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { setMinistryState } from '@/features/user/userSlice';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeEditMode } from '@/features/site-details/edit-mode/editModeSlice';



export default function Header() {
  const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
  const dispatch = useDispatch();


  function minstryToggleChange(e) {
    dispatch(changeEditMode(false));
    dispatch(setMinistryState(!isMinistry));
  }



  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">BCGov Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='w-100'>
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
            
            <NavDropdown title="Prototype Options" id="nav-options" className='ms-auto'>
                <div className="px-3">
                  <Form.Check
                    type="switch"
                    id="ministry-mode-toggle"
                    className='d-inline'
                    onChange={minstryToggleChange}
                    checked={isMinistry}
                  />
                  <Form.Check.Label className='d-inline ms-1' htmlFor="ministry-mode-toggle">Ministry</Form.Check.Label>
                </div>
            </NavDropdown>


          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}