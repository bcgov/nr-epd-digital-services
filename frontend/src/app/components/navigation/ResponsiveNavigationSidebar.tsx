import {Col,Dropdown,Nav} from 'react-bootstrap'

export const ResponsiveNavigationSidebar = () => {
return(    <>
    <Col sm="12">
        <Dropdown>
            <Dropdown.Toggle  style={{width:"100%"}} variant="secondary" className="d-block d-md-none">Responsive Dropdown</Dropdown.Toggle>
            <Dropdown.Menu style={{width:"100%"}}>
                <Dropdown.Item>Responsive Dropdown</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
                <Dropdown.Item>Link 123</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </Col>
    <Col sm="12" md="2" className="d-none d-sm-none d-md-block">
        <Nav className="flex-column">
            <Nav.Link>Responsive Nav</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
            <Nav.Link>Link 123</Nav.Link>
        </Nav>
    </Col>
    </>)
}
                
                
