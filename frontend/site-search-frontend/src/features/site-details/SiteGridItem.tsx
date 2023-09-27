import { Site } from "@/api/sites";
import Form from 'react-bootstrap/Form';
import styles from '@/pages/site-details.module.css'

export default function SiteGridItem( {label, value, extraClasses = '', editMode}) {
    // TODO: Get editMode from redux?

    return (
        <div className={styles.metadataGridItem + " " + extraClasses} >
            <div className={styles.formLabel}>{label}</div>
            <Form.Control className={styles.formInput} readOnly={!editMode} defaultValue={value} />
        </div>
    )
}