import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import {Accordion} from 'react-bootstrap'


export interface Forms extends Array<Form>{
    
}

export type Form = {
    name:string,
    copy:string,
    url:string
}

export const LRSFormAccordion = (forms:Forms):ReactJSXElement =>{
    return(    
        <Accordion>
            {forms.map((form,key) => (
                AccordionItem(form,key.toString())
            ))}
        </Accordion>
    )
}

const AccordionItem  = (form:Form,key:string):ReactJSXElement =>{
    return(
        <Accordion.Item eventKey={key} >
            <Accordion.Header>
                {form.name}
            </Accordion.Header>
            <Accordion.Body>
                {form.copy}
            </Accordion.Body>
        </Accordion.Item>
    )

}
