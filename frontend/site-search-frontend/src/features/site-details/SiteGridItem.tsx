import { Site } from "@/api/sites";
import Form from 'react-bootstrap/Form';
import styles from '@/pages/site-details.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SiteRegistryIconButton } from "@/components/SiteRegistryIcon";

interface SiteGridItemProps {
    label: string;
    value: any;
    extraClasses?: CSSModuleClasses | string;
    showSR?: boolean;
    readOnly?: boolean;
}

export default function SiteGridItem( {label, value, extraClasses = '', showSR = false, readOnly}: SiteGridItemProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <div className={styles.metadataGridItem + " " + extraClasses} >
            <div className={styles.formLabel}>
                <span>{label}</span>
                {showSR && 
                <span><SiteRegistryIconButton siteRegistry={true} /> SR</span>
                }
            </div>
            <Form.Control className={styles.formInput} readOnly={readOnly ? true : !editMode} plaintext={!editMode} defaultValue={value} />
        </div>
    )
}

