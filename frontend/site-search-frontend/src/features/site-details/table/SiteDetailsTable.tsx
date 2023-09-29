import siteDetailsStyles from '@/pages/site-details.module.css'
import { RootState } from '@/store';
import { Button, Form, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { TableEditItem } from '../TableEditItem';
import SiteRegistryIcon from '@/components/SiteRegistryIcon';

interface SiteDetailsTableProps {
    onClickAdd?
    headers: { label: string, accessor: string}[]
    // rows: any[];
    data: {
        participant: string,
        roles: string[],
        startDate: string,
        endDate: string,
        notes: string,
        siteRegistry: boolean
    }[];
}


// Main functionality this needs to integrate with:
// Site Registry togglez    
// editMode

export default function SiteDetailsTable({ onClickAdd, headers, data }: SiteDetailsTableProps) {
    // const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
    const editMode = useSelector((state: RootState) => state.edit.editMode);


    return (
        <div>
            {editMode && <div className="my-4 d-flex justify-content between">
                <div className="d-inline-flex w-100">
                    <Button variant='secondary' onClick={() => { onClickAdd() }}>+ Add</Button>
                    <Button disabled={true} variant='secondary' className='ms-3'>Make Selected Visible to Public</Button>
                    <Button disabled={true} variant='secondary' className='ms-auto'>Remove Selected</Button>
                </div>
            </div>}


            {/* TODO - Rip this out and make its own component, but how handle differing columns and fields elegantly? children props / slots most likely. */}
            {/* SiteDetailsTable */}
            <div className={`${siteDetailsStyles.metadataGridItem} ${siteDetailsStyles.formLabel} mt-4 px-2`}>Notation Participants</div>
            <Table bordered hover>
                <thead>
                    <tr>
                        {editMode && <th><Form.Check aria-label="Select all Notation Participants" /></th>}
                        {headers?.map((header, index) => <th key={index}>{header.label}</th>)}
                        {editMode && <th>SR</th>}
                    </tr>
                </thead>
                <tbody>

                    {data?.map((row, index) => {
                        return (
                            <tr key={index}>
                                {editMode && <td><Form.Check aria-label="Select this notation participant" /></td>}

                                {/* {headers?.map((header, index)) => {
                                    // Need to match header based on accessor
                                    <td><TableEditItem value={row[headers.accessor]} </td>
                                }} */}

                                {headers?.map((header, index) => <td key={index}>{row[header.accessor]}</td>)}

                                {/* <td><TableEditItem value={participant.name} /></td>
                                <td><TableEditItem value={participant.role} /></td> */}
                                {editMode && <td> <SiteRegistryIcon siteRegistry={row.siteRegistry} /></td>}
                            </tr>
                        )
                    })}

                    {/* {notation.notationParticipants.map((participant, id) => {
                        return (
                            <tr key={id}>
                                {editMode && <td><Form.Check aria-label="Select this notation participant" /></td>}
                                <td><TableEditItem value={participant.name} /></td>
                                <td><TableEditItem value={participant.role} /></td>
                                {editMode && <td> <SiteRegistryIcon siteRegistry={participant.siteRegistry} /></td>}
                            </tr>
                        )
                    })} */}

                </tbody>
            </Table>
        </div>
    )
}