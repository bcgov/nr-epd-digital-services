import { LRSForm } from "../../components/landing/LRSFormAccordion";

export const FormFactory = (raw:Array<{name:string, copy:string, url:string}>):Array<LRSForm> => {
    let forms = new Array<LRSForm>()
    raw.forEach((f) =>{
        forms.push( {...f} as LRSForm)
    })
    return forms
}