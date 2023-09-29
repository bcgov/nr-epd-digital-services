import { Button, Dropdown, DropdownButton, Form, Table } from 'react-bootstrap'
import styles from './css/notations.module.css'
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem from './SiteGridItem'
import { TableEditItem } from "./TableEditItem";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Notation, Site } from '@/api/sites';
import { RootState } from '@/store';
import { updateSite } from '../simple-search/simple-search';
import { useEffect, useState } from 'react';
import SiteRegistryIcon from '@/components/SiteRegistryIcon';
import SubSearch from './sub-search/SubSearch';
import SiteDetailsTable from './table/SiteDetailsTable';
import formatDateToString from '@/helpers/formatDateToString';



export default function Notations() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const dispatch = useDispatch();


    function newNotation() {
        const newNotation: Notation = {
            completed: formatDateToString(new Date),
            createdAt: formatDateToString(new Date),
            initiated: formatDateToString(new Date),
            ministryContact: '',
            notationClass: 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL',
            notationParticipants: [],
            notationType: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS',
            note: '',
            requestedActions: [],
            siteRegistry: false,
        }
        const newSite: Site = {...site, notations: [newNotation, ...site.notations]}

        dispatch(updateSite(newSite));
    }

    function newParticipant({ notationIndex }){
        const newParticipant = {name: '', role: '', siteRegistry: false};
        const newSite: Site = {
            ...site,
            notations: site.notations.map((notation, index) => {
              if (index === notationIndex) {
                return {
                  ...notation,
                  notationParticipants: [...notation.notationParticipants, newParticipant],
                };
              }
              return notation;
            }),
          };

        dispatch(updateSite(newSite))
    }


    return (
        <div>

           <SubSearch label='Notations' showResultsDropdown={false} /> 

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

    // Toggling these two makes it mirror exact state, but it shouldn't, instead should be for batch changing of them.
    // const defaultSelectionState: {index: number, siteRegistry: boolean}[] = notation.notationParticipants.map((x,index) => {return {index, siteRegistry: x.siteRegistry}} )
    // const defaultSelectionState: {index: number, siteRegistry: boolean}[] = notation.notationParticipants.map((x,index) => {return {index, siteRegistry: false}} )
    // const [participationSelection, setParticipationSeleciton] = useState(defaultSelectionState)


    // const 
    // TODO: Need to handle 'SR', update data model


    return (
        <div className={styles.notationItem}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation {index + 1}</p>
                    {isMinistry && <p className='mx-3'>Created: {notation.createdAt}</p>}
                </div>
                {editMode && <div className="d-inline-flex">
                    <Button className='text-dark' variant='link'><SiteRegistryIcon siteRegistry={false} /><span className="ms-1 me-3">SR</span></Button>
                    <Button className='text-dark' variant='link'>Delete</Button>
                </div>}
            </div>
            <div className={siteDetailsStyles.metadataGrid}>
                <SiteGridItem label='Notation Type' value={notation.notationType} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />
                <SiteGridItem label='Notation Class' value={notation.notationClass} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />

                <SiteGridItem label='Initiated' value={notation.initiated} showSR={editMode} />
                <SiteGridItem label='Completed' value={notation.completed} showSR={editMode} />
                <SiteGridItem label='Ministry Contact' value={notation.ministryContact} showSR={editMode}  />
                <SiteGridItem label='Note' value={notation.note} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
                <SiteGridItem label='Required Actions' value={notation.requestedActions} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
            </div>


            <SiteDetailsTable 
                headers={[
                    {label: 'Name', accessor: 'name'},
                    {label: 'Role', accessor: 'role'},
                ]}
                data={notation.notationParticipants}
                onClickAdd={() => { onClickAddParticipant({notationIndex: index})}}
            />



            
        </div>
    )
}
