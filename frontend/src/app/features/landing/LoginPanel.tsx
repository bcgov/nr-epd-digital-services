import { Row, Col, Dropdown, Button } from "react-bootstrap";
import { useAuth } from "react-oidc-context";

import "./LoginPanel.css"

const LoginSpacer = (
    <Col className="col-md-0 d-none d-md-block  "/>
)

export const LoginPanel = () =>{
    const auth = useAuth()
    return(
        <Row  className="login-panel py-5 mb-3  " id="login-panel">
        {LoginSpacer}
        <Col id="idir-login-panel" className="text-center col-xs-12 mx-0 mb-2  ">
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
        <Col id="lrs-signup-panel" className="text-center   col-xs-12 mx-0">
            <Button id="lrs-signup-button" 
                onClick={() => void auth.signinRedirect(
                        {extraQueryParams:{'kc_idp_hint':'bceid'}})}>
                Sign Up for an Account</Button>
        </Col>
        {LoginSpacer}
    </Row>
    )}