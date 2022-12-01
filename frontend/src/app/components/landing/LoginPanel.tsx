import { Row, Col, Button } from "react-bootstrap";
import LoginDropdown from "../login/LoginDropdown";

import "./LoginPanel.css"


export const LoginPanel = () =>{
    const loginDropdownTitle = "Log in to my LRS Account";
    return(
        <Row  className="login-panel py-5 mb-3  " id="login-panel">
            <Col id="idir-login-panel" className="mt-auto mb-2 col-xs-12 col-md-6 text-center text-sm-end">
                {LoginDropdown(loginDropdownTitle)}
            </Col>
            <Col id="lrs-signup-panel" className="mt-auto mb-2 col-xs-12  col-md-6 text-center text-sm-start">
                <Button id="lrs-signup-button" href="/signuplanding" className="login-btn-lh">
                    Sign Up</Button>
            </Col>        
        </Row>       
    )}