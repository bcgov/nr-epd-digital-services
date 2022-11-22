import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col, Nav, Dropdown} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import { ResponsiveNavigationSidebar } from "../../components/navigation/ResponsiveNavigationSidebar"


const Landing = () =>{
    var forms = FormFactory(jsonforms.forms)
    console.log( jsonforms)
    //var forms: Array<Form> = jsonforms.forms
    return(
        <Container>
            <Row className="text-center">
            <h2>Landing Page</h2>
            <p>Please log in to start</p>
            </Row>
            <Row>
                <Col className="m-2" style={{background:"#E3E8EE"}} >
                    <h1 >Login Space</h1>
                </Col>
            </Row>
             <Row className="responsive lrs nav"> {/* TODO: Break this into separate component with BCGOV CSS */}
             <ResponsiveNavigationSidebar/>
                {/* <Col sm="12">
                    <Dropdown>
                        <Dropdown.Toggle  style={{width:"100%", background:"#E3E8EE"}} className="d-block d-md-none">Navigation Dropdown</Dropdown.Toggle>
                        <Dropdown.Menu style={{width:"100%"}}>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                            <Dropdown.Item>Link 123</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col sm="12" md="2" className="d-none d-sm-none d-md-block">
                    <Nav className="flex-column">
                        <Nav.Link>Link 123</Nav.Link>
                        <Nav.Link>Link 123</Nav.Link>
                        <Nav.Link>Link 123</Nav.Link>
                        <Nav.Link>Link 123</Nav.Link>
                        <Nav.Link>Link 123</Nav.Link>
                    </Nav>
                </Col> */}
                <Col sm="12" md="10">
                    <h3>Sample LRS Forms</h3>
                    {LRSFormAccordion(forms)}
                </Col>
            </Row>
            
        </Container>
        )
}


export default Landing