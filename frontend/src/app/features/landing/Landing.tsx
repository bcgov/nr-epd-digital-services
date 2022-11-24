import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col, Button, Dropdown} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import { ResponsiveNavigationSidebar } from "../../components/navigation/ResponsiveNavigationSidebar"
import { useAuth } from "react-oidc-context"
import { LoginPanel } from "./LoginPanel"
import './Landing.css'



const Landing = () =>{
    var forms = FormFactory(jsonforms.forms)
    const auth = useAuth();
    //var forms: Array<Form> = jsonforms.forms
    return(
        <Container fluid className="landing-container" id="landing-container">
            <LoginPanel/>
            {/* <Row  className="login-panel py-5 mb-3  " id="login-panel">
                {LoginSpacer}
                <Col id="idir-login-panel" className="text-center col-xs-12 mx-0 mb-2 border border-dark">
                    <Dropdown id="login-selector-dropdown" >
                        <Dropdown.Toggle id="login-selector-dropdown-toggle">
                            Log In to my LRS Account
                        </Dropdown.Toggle>
                        <Dropdown.Menu id="login-selector-dropdown-menu">
                            <Dropdown.Header>Select Login Method</Dropdown.Header>
                            <Dropdown.Item as="button" id="login-button-bceid" className="dropdown-item"
                                    onClick={() => void auth.signinRedirect(
                                            {extraQueryParams:{'kc_idp_hint':'bceid'}})}>
                                    BCEID
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item as="button" id="login-button-idir" onClick={() => void auth.signinRedirect(
                                        {extraQueryParams:{'kc_idp_hint':'oidc'}})}>
                                    IDIR
                            </Dropdown.Item>

                        </Dropdown.Menu>
                        
                    </Dropdown>
                    
                </Col>
                <Col id="lrs-signup-panel" className="text-center border border-dark col-xs-12 mx-0">
                    <Button id="lrs-signup-button" 
                        onClick={() => void auth.signinRedirect(
                                {extraQueryParams:{'kc_idp_hint':'bceid'}})}>
                        Sign Up for an Account</Button>
                </Col>
                {LoginSpacer}
            </Row> */}
            <Row id="responsive-lrs-nav">
                <Col sm="12" md="3">
                    <ResponsiveNavigationSidebar/>
                </Col>
                <Col sm="12" md="9">
                    <h1>Sample LRS Forms</h1>
                    {LRSFormAccordion(forms)}
                </Col>
            </Row>
            
        </Container>
        )
}


export default Landing