import { Site } from "@/api/sites";
import Form from 'react-bootstrap/Form';
import styles from '@/pages/site-details.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function SiteGridItem( {label, value, extraClasses = '', showSR = false }) {
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <div className={styles.metadataGridItem + " " + extraClasses} >
            <div className={styles.formLabel}>
                <span>{label}</span>
                {showSR && 
                <span>SR</span>
                }
            </div>
            <Form.Control className={styles.formInput} readOnly={!editMode} defaultValue={value} />
        </div>
    )
}