import Form from 'react-bootstrap/Form';
import styles from '@/pages/site-details.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link } from 'react-router-dom';


export function TableEditItem({ value }) {
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    return (
        <Form.Control className={styles.formInput} readOnly={!editMode} plaintext={!editMode} defaultValue={value}/>
    );
}

export function LinkableFormControl({ value }) {
    return (
        <>
            {/* Prototype little quickhack fix.  If we use the <Link/> then while it works it doesn't update the top metadata section until refresh.  So, <a> forces refresh. */}
            {/* <Link to={`/site/${value}/`}>{value}</Link> */}
            <a href={`/site/${value}/`}>{value}</a>

        </>
    )
}

export function TextAreaItem({value}) { 
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    return (
        <Form.Control className={styles.formInput} readOnly={!editMode} plaintext={!editMode} defaultValue={value} as='textarea' />
    );
}

export function DateItem({value}) {
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    if (!editMode) {
        return (
            <p className={styles.formInput}>{value}</p>
        )
    }

    return (
        <input type='date' className={styles.formInput + ' form-control'} defaultValue={value} readOnly={!editMode}  />
    )

}