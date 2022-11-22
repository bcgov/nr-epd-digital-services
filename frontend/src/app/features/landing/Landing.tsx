import { LRSFormAccordion } from "../../components/landing/LRSFormAccordion"
import {Container, Row} from 'react-bootstrap'
import jsonforms from "./forms.json"
import { FormFactory } from "../../helpers/factory/FormFactory"


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
                {LRSFormAccordion(forms)}
            </Row>
            
        </Container>
        )
}


export default Landing