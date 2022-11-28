import { Row, Col, Button } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import LoginDropdown from "../../components/login/LoginDropdown";

import "./LoginPanel.css"


export const LoginPanel = () =>{
    const loginDropdownTitle = "Log in to my LRS Account";
    return(
        <Row  className="login-panel py-5 mb-3  " id="login-panel">
            <Col id="idir-login-panel" className="mx-0 mb-2 col-xs-12 col-md-6 text-center text-sm-end">
                {LoginDropdown(loginDropdownTitle)}
            </Col>
            <Col id="lrs-signup-panel" className="mx-0 col-xs-12  col-md-6 text-center text-sm-start">
                <Button id="lrs-signup-button" href="/signuplanding">
                    Sign Up</Button>
            </Col>        
        </Row>
    )}