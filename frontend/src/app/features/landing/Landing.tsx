import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import { ResponsiveNavigationSidebar } from "../../components/navigation/ResponsiveNavigationSidebar"
import { useAuth } from "react-oidc-context"
import { LoginPanel } from "./LoginPanel"

const Landing = () =>{
    const forms = FormFactory(jsonforms.forms)
    return(
        <Container fluid className="landing-container" id="landing-container">
            <LoginPanel/>
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