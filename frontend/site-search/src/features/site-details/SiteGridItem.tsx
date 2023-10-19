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
    as?: 'input' | 'textarea';
}

interface SiteGridParentProps {
    label: string;
    children: any;
    extraClasses?: CSSModuleClasses | string;
    showSR?: boolean;
}

export default function SiteGridItem( {label, value, extraClasses = '', showSR = false, readOnly, as='input'}: SiteGridItemProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <SiteGridParent label={label} extraClasses={extraClasses} showSR={showSR}>
            <Form.Control className={styles.formInput} readOnly={readOnly ? true : !editMode} plaintext={!editMode} defaultValue={value} as={as} />
        </SiteGridParent>
    )
}

export function SiteGridParent( {label, extraClasses = '', showSR = false,children}: SiteGridParentProps ) { 
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <div className={styles.metadataGridItem + " " + extraClasses} >
            <div className={styles.formLabel}>
                <span>{label}</span>
                {showSR && 
                <span><SiteRegistryIconButton siteRegistry={true} /> SR</span>
                }
            </div>
            {children}
        </div>
    )

}

export function SiteGridDateItem( {label, value, extraClasses = '', showSR = false, readOnly}: SiteGridItemProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <SiteGridParent label={label} extraClasses={extraClasses} showSR={showSR}>
            <input type='date' className={styles.formInput + ' form-control'} defaultValue={value} readOnly={readOnly ? true : !editMode} />
        </SiteGridParent>
    )

}
