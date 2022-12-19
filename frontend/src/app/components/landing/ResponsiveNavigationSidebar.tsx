import {Row,Dropdown,Nav} from 'react-bootstrap'

export const ResponsiveNavigationSidebar = () => {
return(    <>
    <Row className="d-md-none">
        <Dropdown>
            <Dropdown.Toggle  variant="secondary" className="d-block d-md-none w-100">Responsive Dropdown</Dropdown.Toggle>
            <Dropdown.Menu style={{width:"100%"}}>
                <Dropdown.Item>Responsive Dropdown</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </Row>
    <Row  className="d-none d-sm-none d-md-block">
        <Nav className="flex-column">
            <Nav.Link>Responsive Nav</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
        </Nav>
    </Row>
    </>)
}
                
                
