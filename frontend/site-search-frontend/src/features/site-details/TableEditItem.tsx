import Form from 'react-bootstrap/Form';
import styles from '@/pages/site-details.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/store";


export function TableEditItem({ value }) {
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    return (
        <Form.Control className={styles.formInput} readOnly={!editMode} plaintext={!editMode} defaultValue={value} />
    );
}
