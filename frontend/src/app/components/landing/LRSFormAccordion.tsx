import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import {Accordion} from 'react-bootstrap'


export type LRSForm = {
    name:string,
    copy:string,
    url:string
}

export const LRSFormAccordion = (forms:Array<LRSForm>):ReactJSXElement =>{
    return(    
        <Accordion>
            {forms.map((form,key) => (
                AccordionItem(form,key.toString())
            ))}
        </Accordion>
    )
}

const AccordionItem  = (form:LRSForm,key:string):ReactJSXElement =>{
    return(
        <Accordion.Item eventKey={key} >
            <Accordion.Header>
                <h4>{form.name}</h4>
            </Accordion.Header>
            <Accordion.Body>
                <p>
                    {form.copy}
                    <br/>
                    <a href={form.url}> Please Click Here for the form </a>
                </p>    
            </Accordion.Body>
        </Accordion.Item>
    )

}
