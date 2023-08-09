import { Row, Col, Button } from "react-bootstrap";
import LoginDropdown from "../login/LoginDropdown";

import "./LoginPanel.css"


export const LoginPanel = () =>{
    const loginDropdownTitle = "Login to my account";
    return(
        <Row  className="login-panel py-5 mb-3 d-flex" id="login-panel">
            <div id="idir-login-panel">
                {LoginDropdown(loginDropdownTitle)}
            </div>
            {/* <Col id="lrs-signup-panel" className="mt-auto mb-2 col-xs-12  col-md-6 text-center text-sm-start">
                <Button id="lrs-signup-button" href="/signup" className="login-btn-lh">
                    Sign Up</Button>
            </Col>         */}
        </Row>       
    )}