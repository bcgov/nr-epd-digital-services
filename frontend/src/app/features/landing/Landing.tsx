import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row, Col} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"
import { ResponsiveNavigationSidebar } from "../../components/navigation/ResponsiveNavigationSidebar"
import { useAuth } from "react-oidc-context"


const Landing = () =>{
    var forms = FormFactory(jsonforms.forms)
    const auth = useAuth();
    //var forms: Array<Form> = jsonforms.forms
    return(
        <Container>

            <Row>
                <Col className="m-2" style={{background:"#E3E8EE"}} >
                    <button  className="btn btn-success" onClick={() => void auth.signinRedirect({extraQueryParams:{
                        'kc_idp_hint':'oidc'}})}>LogIn with IDIR</button>
                    <button  className="btn btn-info" onClick={() => void auth.signinRedirect({extraQueryParams:{
                        'kc_idp_hint':'bceid'}})}>LogIn with BCEID</button>
                </Col>
            </Row>
             <Row className="responsive lrs nav"> {/* TODO: Break this into separate component with BCGOV CSS */}
                <Col sm="12" md="2">
                    <ResponsiveNavigationSidebar/>
                </Col>
                <Col sm="12" md="10">
                    <h3>Sample LRS Forms</h3>
                    {LRSFormAccordion(forms)}
                </Col>
            </Row>
            
        </Container>
        )
}


export default Landing