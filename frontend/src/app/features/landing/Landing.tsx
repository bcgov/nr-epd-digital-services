import React from "react"
import { LRSFormAccordion } from "../../components/buttons/LRSFormAccordion"
import {Container, Row} from 'react-bootstrap'
import jsonforms from "./forms.json"
import {Form} from "../../components/buttons/LRSFormAccordion"


const Landing = () =>{
    
    return(
        <Container>
            <Row className="text-center">
            <h2>Landing Page</h2>
            <p>Please log in to start</p>
            </Row>
            <Row>
                <LRSFormAccordion forms={jsonforms as Array<Form>}></LRSFormAccordion>
            </Row>
            
        </Container>
        )
}


export default Landing