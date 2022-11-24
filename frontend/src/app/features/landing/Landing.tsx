import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col, Button} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import { ResponsiveNavigationSidebar } from "../../components/navigation/ResponsiveNavigationSidebar"
import { useAuth } from "react-oidc-context"
import './Landing.css'


const Landing = () =>{
    var forms = FormFactory(jsonforms.forms)
    const auth = useAuth();
    //var forms: Array<Form> = jsonforms.forms
    return(
        <Container fluid className="landing-container" id="landing-container">
            <Row className="login-panel py-5 w-100" id="login-panel">
                <Col>
                    <Button  id="login-buttons" className="btn btn-success center" onClick={() => void auth.signinRedirect({extraQueryParams:{
                        'kc_idp_hint':'oidc'}})}>LogIn with IDIR</Button>
                </Col>
                <Col>
                    <Button id="login-buttons" className="btn btn-info center" onClick={() => void auth.signinRedirect({extraQueryParams:{
                        'kc_idp_hint':'bceid'}})}>LogIn with BCEID</Button>
                </Col>
            </Row>
            <Row className="responsive lrs nav">
                <Col sm="12" md="3">
                    <ResponsiveNavigationSidebar/>
                </Col>
                <Col sm="12" md="9">
                    <h3>Sample LRS Forms</h3>
                    {LRSFormAccordion(forms)}
                </Col>
            </Row>
            
        </Container>
        )
}


export default Landing