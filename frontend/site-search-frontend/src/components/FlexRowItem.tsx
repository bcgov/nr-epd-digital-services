import { Site } from "@/api/sites";

export default function FlexRowItem( {label, children}) {
    return (
        <div className="d-flex flex-column ">
            <div className='fw-bold'>{label}</div>
            <div>{children}</div>
        </div>
    )
}