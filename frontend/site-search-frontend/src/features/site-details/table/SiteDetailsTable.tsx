import siteDetailsStyles from '@/pages/site-details.module.css'
import { RootState } from '@/store';
import { Button, Form, Table, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { TableEditItem } from '../TableEditItem';
import { SiteRegistryIconButton } from '@/components/SiteRegistryIcon';
import { useState } from 'react';

interface SiteDetailsTableProps {
    onClickAdd?
    label: string;
    headers: { label: string, accessor: string }[]
    // rows: any[];
    data: {
        roles?: string[],
        siteRegistry: boolean
        [key: string]: any;
    }[];
}


// Main functionality this needs to integrate with:
// Site Registry togglez    
// editMode

export default function SiteDetailsTable({ onClickAdd, headers, data, label }: SiteDetailsTableProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode);
    const [checked, setChecked] = useState<{ [key: string]: boolean }>(initializeCheckedObject(false));

    // checked = {
    //     1: true,
    //     2: false,
    //     3: true
    //     ... etc, will be dynamic
    // }

    function handleCheck({ index, event }) {
        console.log('handleCheck', {index, event, checked})
        const newCheck = { ...checked }
        newCheck[index] = event.target.checked
        setChecked(newCheck)
    }

    function checkAll(value: boolean)  {
        const newChecked = initializeCheckedObject(value);
        setChecked(newChecked)
    }


    function initializeCheckedObject(value: boolean) {
        const newChecked = {};

        for (let i = 0; i < data.length; i++) {
            newChecked[i] = value;
        }
        return newChecked;
    }



    return (
        <div>
            {editMode && <div className="my-4 d-flex justify-content between">
                <div className="d-inline-flex w-100">
                    <Button variant='secondary' onClick={() => { onClickAdd() }}>+ Add</Button>
                    <Button disabled={true} variant='secondary' className='ms-3'>Make Selected Visible to Public</Button>
                    <Button disabled={true} variant='secondary' className='ms-auto'>Remove Selected</Button>
                </div>
            </div>}

            <div className={`${siteDetailsStyles.metadataGridItem} ${siteDetailsStyles.formLabel} mt-4 px-2`}>{label}</div>
            <Table bordered hover>
                <thead>
                    <tr>
                        {editMode && <th><Form.Check aria-label="Select all {label}" onChange={(e) => checkAll(e.target.checked)} /></th>}
                        {headers?.map((header, index) => <th key={index}>{header.label}</th>)}
                        {editMode && <th>SR</th>}
                    </tr>
                </thead>
                <tbody>

                    {data?.map((row, index) => {
                        return (
                            <tr key={index}>
                                {editMode && <td>
                                    <Form.Check aria-label="Select this {label}" checked={checked[index]} onChange={(event) => handleCheck({ index, event })} />
                                </td>}
                                {headers?.map((header, index) => <td key={index}><TableEditItem value={row[header.accessor]} /></td>)}
                                {editMode && <td> <SiteRegistryIconButton siteRegistry={row.siteRegistry} /></td>}
                            </tr>
                        )
                    })}

                </tbody>
            </Table>
        </div>
    )
}