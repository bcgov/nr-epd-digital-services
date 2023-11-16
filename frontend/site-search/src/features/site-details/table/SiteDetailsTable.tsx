import siteDetailsStyles from '@/pages/site-details.module.css'
import { RootState } from '@/store';
import { Button, Form, Table, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { TableEditItem } from '../TableEditItem';
import { SiteRegistryIconButton } from '@/components/SiteRegistryIcon';
import { useEffect, useState } from 'react';

interface SiteDetailsTableProps {
    onClickAdd?;
    onClickRemove?;
    label: string;
    headers: { label: string, accessor: string, renderer?: React.FC<{value: any}> }[]
    // rows: any[];
    data: {
        roles?: string[],
        siteRegistry: boolean
        [key: string]: any;
    }[];
    showAddRemoveButtons?: boolean;
}


// Main functionality this needs to integrate with:
// Site Registry togglez    
// editMode

export default function SiteDetailsTable({ onClickAdd, headers, data, label, onClickRemove, showAddRemoveButtons: hideAddRemoveButtons = true }: SiteDetailsTableProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode);
    const [checked, setChecked] = useState<{ [key: string]: boolean }>(initializeCheckedObject(false));
    const [headerChecked, setHeaderChecked] = useState<boolean>(false);
    const [SRCheck, setSRChecks] = useState(copySiteRegistryToState());


    /**
     * Clones a prop to a state so we can modify it.  Only works in prototype.  
     * In final result, would need to properly update state.
     * See also onChangeSiteRegistry. 
     * @returns 
     */
    function copySiteRegistryToState() {
        // get all data siteRegistry map values
        return data.map(row => {
            return row.siteRegistry
        })
    }

    // checked = {
    //     1: true,
    //     2: false,
    //     3: true
    //     ... etc, will be dynamic
    // }

    function handleCheck({ index, event }) {
        const newCheck = { ...checked }
        newCheck[index] = event.target.checked
        setChecked(newCheck)
    }

    // If the user manually selects all checkboxes, the header should auto-toggle and vice versa.
    useEffect(() => {
        const allChecked = getSelection().length === Object.keys(checked).length
        const tableEmpty = !!(data.length === 0);

        if (tableEmpty) {
            setHeaderChecked(false)
        }
        else {
            setHeaderChecked(allChecked);
        }

    }, [checked])

    function handleRemove(val) {
        // Manually unselect all checkboxes after user deletes, otherwise selection kinda ghosts to
        // other entries which now share that indice
        setChecked(initializeCheckedObject(false))
        onClickRemove(val)
    }

    function checkAll(value: boolean) {
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

    function onChangeSiteRegistry() {
        // alert('todo');
        // const idsToSetTrue = getSelection();
        // console.log({idsToSetTrue, checked, SRCheck })
        // console.log({ checked, SRCheck })

        // what are we updating here, site? no, only the props passed in? but can't update props...
        // idea: clone the props, set that as state, show that state, and modify that stae.
        // e.g.  <SiteRegistryIconButton siteRegistry={row.siteRegistry} should be
        // <SiteRegistryIconButton siteRegistry={siteRegisty[someIndex]}
        // could even be same data structure as checked, just a series of bools

        // goal - make checked write to SR check
        const checkedAsArray = [...Object.keys(checked).map(key => checked[key])];
        setSRChecks(checkedAsArray)
    }

    function getSelection(): string[] {
        return Object.keys(checked).filter(key => checked[key] === true);
    }


    return (
        <div>
            {editMode && <div className="my-4 d-flex justify-content between">
                <div className="d-inline-flex w-100">
                    {/* <Button variant='secondary' onClick={() => { onClickAdd() }}>+ Add</Button> */}

                    {hideAddRemoveButtons ? <Button variant='secondary' className='me-3' onClick={() => { onClickAdd() }}>+ Add</Button> : '' }
                    <Button disabled={getSelection().length === 0} variant='secondary' onClick={onChangeSiteRegistry}>Make Selected Visible to Public</Button>
                    {hideAddRemoveButtons ? <Button disabled={getSelection().length === 0} variant='secondary' className='ms-auto' onClick={() => {handleRemove(checked)}}>Remove Selected</Button> : '' }
                </div>
            </div>}

            <div className={`${siteDetailsStyles.metadataGridItem} ${siteDetailsStyles.formLabel} mt-4 px-2`}>{label}</div>
            <Table bordered hover>
                <thead>
                    <tr>
                        {editMode && <th><Form.Check aria-label="Select all {label}" checked={headerChecked} onChange={(e) => checkAll(e.target.checked)} /></th>}
                        {headers?.map((header, index) => <th key={index}>{header.label}</th>)}
                        {editMode && <th>SR</th>}
                    </tr>
                </thead>
                <tbody>

                    {data?.map((row, index) => {
                        return (
                            <tr key={index}>
                                {/* Checkbox col */}
                                {editMode && <td>
                                    <Form.Check aria-label="Select this {label}" checked={checked[index]} onChange={(event) => handleCheck({ index, event })} />
                                </td>}

                                {/* Dynamic row content */}
                                {headers?.map((header, index) => <td key={`${row.uuid}-${index}`}>
                                    {/* If there is a custom `renderer`, use that, otherwise default to TableEditItem */}
                                    { header.renderer ? 
                                        <header.renderer value={row[header.accessor]} /> 
                                        : <TableEditItem value={row[header.accessor]} />
                                    }
                                    {/* <TableEditItem value={row[header.accessor]} /> */}
                                </td>)}

                                {/* SR Col */}
                                {editMode && <td> <SiteRegistryIconButton siteRegistry={SRCheck[index]} /></td>}
                            </tr>
                        )
                    })}

                </tbody>
            </Table>
        </div>
    )
}