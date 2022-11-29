import  {LRSFormAccordion} from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import  {ResponsiveNavigationSidebar}  from "../../components/navigation/ResponsiveNavigationSidebar"
import { LoginPanel } from "./LoginPanel"

const Landing = () =>{
    const forms = FormFactory(jsonforms.forms)
    return(
        <Container fluid className="landing-container" id="landing-container">
            <LoginPanel/>
            <Row id="responsive-lrs-nav" className="">
                <Col className="col-12 col-md-3" >
                    <ResponsiveNavigationSidebar/>
                </Col>
                <Col className="col-12 col-md-7">
                    <Row>
                    <p className="h1">Sample Site Remediation Forms</p>
                    </Row>  
                    <Row>
                    {LRSFormAccordion(forms)}
                    </Row>
                  
                
                </Col>
            </Row>
        </Container>
        )
}


export default Landing