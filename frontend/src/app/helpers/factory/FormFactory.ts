import { LRSForm } from "../../components/landing/LRSFormAccordion";

export const FormFactory = (raw:Array<{name:string, copy:string, url:string}>):Array<LRSForm> => {
    var forms = new Array<LRSForm>()
    raw.map((f) =>{
        forms.push( {...f} as LRSForm)
    })
    return forms
}