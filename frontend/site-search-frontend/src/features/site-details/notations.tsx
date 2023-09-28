import { Button, Dropdown, DropdownButton, Form, Table } from 'react-bootstrap'
import styles from './css/notations.module.css'
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem from './SiteGridItem'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Notation, Site } from '@/api/sites';
import { RootState } from '@/store';
import { updateSite } from '../simple-search/simple-search';
import { useEffect } from 'react';


export default function Notations() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const dispatch = useDispatch();


    // console.log('site notations', site.notations);

    // useEffect(() => { console.log('nav useEffect')}, [site])


    // Note: This is currently not rendering immediately! After doing dispatch, click to other tab and back and see it works.
    function newNotation() {
        const newNotation = new Notation({
            completed: new Date(),
            createdAt: new Date(),
            initiated: new Date(),
            ministryContact: '',
            notationClass: 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL',
            notationParticipants: [],
            notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS',
            note: '',
            requestedActions: []
        })
        const newSite: Site = {...site, notations: [newNotation, ...site.notations]}

        dispatch(updateSite(newSite));
    }

    function newParticipant({ notationIndex }){
        const newParticipant = {name: '', role: '', siteRegistry: false};
        // Push to array in newSite.notations[HOW-GET-THIS-ID].participants
        const newSite: Site = {...site, notations: [...site.notations]}
        newSite.notations[notationIndex].notationParticipants = [...newSite.notations[notationIndex].notationParticipants, newParticipant]
        dispatch(updateSite(newSite))

    }


    return (
        <div>

            {/* <div className={siteDetailsStyles.metadataGrid}> */}
            <div className="row my-4">
                <div className="col-10">
                    <input type="text" className={"form-control " + styles.searchBar} placeholder="Search Notations" aria-label="Search Notations" />
                </div>
                <div className="col-2">
                    <DropdownButton variant='outline-secondary' id="dropdown-notation-search-type" title="Sort results by: Date">
                        <Dropdown.Item eventKey='Date'>Date</Dropdown.Item>
                        <Dropdown.Item eventKey='???'>???</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            {editMode && <Button onClick={newNotation} variant='secondary'>+ New Notation</Button>}

            {site.notations.map((siteNotationData, index) => {
                return <NotationItem key={index} notation={siteNotationData} index={index} onClickAddParticipant={newParticipant}/>
            })}


        </div>
    )
}


function NotationItem({ notation, index, onClickAddParticipant }: { notation: Notation, index: number, onClickAddParticipant: any }) {
    const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
    const editMode = useSelector((state: RootState) => state.edit.editMode);


    // const 
    // TODO: Need to handle 'SR', update data model


    return (
        <div className={styles.notationItem}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation {index + 1}</p>
                    {isMinistry && <p className='mx-3'>Created: {notation.createdAt.toISOString().split('T')[0]}</p>}
                </div>
                <div className="d-inline-flex">
                    <p className='mx-3'>SR</p>
                    <p>DELETE</p>
                </div>
            </div>
            <div className={siteDetailsStyles.metadataGrid}>
                <SiteGridItem label='Notation Type' value={notation.notationType} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />
                <SiteGridItem label='Notation Class' value={notation.notationClass} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />

                <SiteGridItem label='Initiated' value={notation.initiated.toISOString().split('T')[0]} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Completed' value={notation.completed.toISOString().split('T')[0]} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Ministry Contact' value={notation.ministryContact} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Note' value={notation.note} showSR={editMode} extraClasses={siteDetailsStyles.gridSpan3} />
                <SiteGridItem label='Required Actions' value={notation.requestedActions} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
            </div>


            <div>
                {editMode && <div className="my-4 d-flex justify-content between">
                    <div className="d-inline-flex">
                        <Button variant='secondary' onClick={() => { onClickAddParticipant({notationIndex: index })}}>+ Add</Button>
                        <Button disabled={true} variant='secondary' className='ms-3'>Make Selected Visible to Public</Button>
                    </div>
                </div>}


                {/* TODO - Rip this out and make its own component, but how handle differing columns and fields elegantly? children props / slots most likely. */}
                {/* SiteDetailsTable */}
                <div className={`${siteDetailsStyles.metadataGridItem} ${siteDetailsStyles.formLabel} mt-4 px-2`}>Notation Participants</div>
                <Table bordered hover>
                    <thead className={siteDetailsStyles.formLabel}>
                        <tr>
                            {editMode && <th><Form.Check aria-label="Select all Notation Participants" /></th> }
                            <th>Name</th>
                            <th>Role</th>
                            {editMode && <th>SR</th>}
                        </tr>
                    </thead>
                    <tbody>

                        {notation.notationParticipants.map((participant, id) => {
                            return (
                                <tr key={id}>
                                    {editMode && <td><Form.Check aria-label="Select this notation participant"/></td> }
                                    <td>{participant.name}</td>
                                    <td>{participant.role}</td>
                                    {editMode && <td>{participant.siteRegistry}</td>}
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </div>
        </div>
    )
}
