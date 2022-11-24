import {Row,Dropdown,Nav} from 'react-bootstrap'
import {FaBars} from 'react-icons/fa'
import './ResponsiveNavigationSidebar.css'

export const ResponsiveNavigationSidebar = () => {
    return(    
        <>
            <Row className="d-md-none">
                <Dropdown className='my-4'>
                    <Dropdown.Toggle  variant="secondary" id='dropdown-toggle' className="d-block d-md-none w-100">Responsive Dropdown <FaBars id='toggle-icon'/></Dropdown.Toggle>
                    <div>
                        <Dropdown.Menu id="dropdown-menu" className="">
                            <Dropdown.Item>Responsive Dropdown</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                        </Dropdown.Menu>
                    </div>
                    
                </Dropdown>
            </Row>
            <Row  className="d-none d-sm-none d-md-block">
                <Nav id="nav-panel" className="flex-column">
                    <Nav.Link id="nav-link">Responsive Nav</Nav.Link>
                    <Nav.Link id="nav-link">Link 123</Nav.Link>
                    <Nav.Link id="nav-link">Link 123</Nav.Link>
                    <Nav.Link id="nav-link">Link 123</Nav.Link>
                    <Nav.Link id="nav-link">Link 123</Nav.Link>
                </Nav>
            </Row>
        </>
    )
}