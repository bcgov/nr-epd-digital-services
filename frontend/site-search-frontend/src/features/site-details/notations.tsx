import { Button, Dropdown, DropdownButton, Form, Table } from 'react-bootstrap'
import styles from './css/siteDetails.module.css'
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem, { SiteGridDateItem } from './SiteGridItem'
import { TableEditItem } from "./TableEditItem";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Notation, Site } from '@/api/sites';
import { RootState } from '@/store';
import { deleteNotation, updateSite } from '../simple-search/simple-search';
import { useEffect, useState } from 'react';
import SiteRegistryIcon, { SiteRegistryIconButton } from '@/components/SiteRegistryIcon';
import SubSearch from './sub-search/SubSearch';
import SiteDetailsTable from './table/SiteDetailsTable';
import formatDateToString from '@/helpers/formatDateToString';
import { faker } from '@faker-js/faker';



export default function Notations() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const dispatch = useDispatch();


    function newNotation() {
        const newNotation: Notation = {
            uuid: faker.string.uuid(),
            completed: formatDateToString(new Date),
            createdAt: formatDateToString(new Date),
            initiated: formatDateToString(new Date),
            ministryContact: '',
            notationClass: '',
            notationParticipants: [],
            notationType: '',
            note: '',
            requestedActions: [],
            siteRegistry: false,
        }
        const newSite: Site = {...site, notations: [...site.notations, newNotation]}
        // const newSite: Site = {...site, notations: [newNotation, ...site.notations]}

        // Potentially should put this in a useEffect()?
        // Goal is to scroll into new element only after it has been rendered.
        setTimeout(() => {
            const el = document.getElementById('notation-' + site.notations.length)
            if (el) {
                el.scrollIntoView({behavior: 'smooth'})
            }
        }, 150)

        dispatch(updateSite(newSite));
    }

    function newParticipant({ notationIndex }){
        const newParticipant = {name: '', role: '', siteRegistry: false, uuid: faker.string.uuid()};
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

    // Correctly updates state, but still have issue where deleting from the top has the top values overwrite it's replacement
    function clickDeleteNotation(notation: Notation) {
        dispatch(deleteNotation({ siteUUID: site.uuid, notationUUID: notation.uuid }))
    }

    function removeAtWithSplice(array, index) {
        const copy = [...array];
        copy.splice(index, 1);
        return copy;
      }

    function removeParticipant({notationIndex, checked}) {
        console.log('notation removeParticipant', {checked, notationIndex})
        const newSite: Site = {
            ...site,

            notations: [...site.notations.map((notation, index) => {
                if (index=== notationIndex) {
                    return {
                        ...notation,
                        notationParticipants: [...notation.notationParticipants.filter((_, participantIndex) => { 
                            if (checked[participantIndex] === true) {
                                // console.log(`checked[participantIndex] === ${checked[participantIndex]} at ${participantIndex}` )
                                return false
                            }
                            return true;
                        })]
                    }
                }
                return notation
            })]
          };

        dispatch(updateSite(newSite))
    }


    return (
        <div>
           <SubSearch label='Notations' showResultsDropdown={false} /> 
            {editMode && <Button onClick={newNotation} variant='secondary'>+ New Notation</Button>}

            {site.notations.map((siteNotationData, index) => {
                // return <NotationItem key={siteNotationData.uuid} notation={siteNotationData} index={index} onClickAddParticipant={newParticipant} onClickRemoveParticipant={removeParticipant} onClickDeleteNotation={clickDeleteNotation} />
                return <NotationItem key={index} notation={siteNotationData} index={index} onClickAddParticipant={newParticipant} onClickRemoveParticipant={removeParticipant}  onClickDeleteNotation={clickDeleteNotation}  />
            })}
        </div>
    )
}


function NotationItem({ notation, index, onClickAddParticipant, onClickRemoveParticipant, onClickDeleteNotation }: { notation: Notation, index: number, onClickAddParticipant: any, onClickRemoveParticipant: any, onClickDeleteNotation: any}) {
    const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    return (
        <div className={styles.detailsItem} id={`notation-${index}`}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation {index + 1}</p>
                    {isMinistry && <p className='mx-3'>Created: {notation.createdAt}</p>}
                </div>
                {editMode && <div className="d-inline-flex">
                    <SiteRegistryIconButton siteRegistry={false}></SiteRegistryIconButton><span className="mt-2">SR</span>
                    <Button className='text-dark' variant='link' onClick={() => {onClickDeleteNotation(notation)}}>DELETE</Button>
                </div>}
            </div>
            <div className={siteDetailsStyles.metadataGrid}>
                <SiteGridItem label='Notation Type' value={notation.notationType} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />
                <SiteGridItem label='Notation Class' value={notation.notationClass} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />

                <SiteGridDateItem label='Initiated' value={notation.initiated} showSR={editMode}/>
                <SiteGridDateItem label='Completed' value={notation.completed} showSR={editMode} />
                <SiteGridItem label='Ministry Contact' value={notation.ministryContact} showSR={editMode}  />
                <SiteGridItem label='Note' value={notation.note} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
                <SiteGridItem label='Required Actions' value={notation.requestedActions} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
            </div>


            <SiteDetailsTable 
                label='Notation Participants'
                headers={[
                    {label: 'Name', accessor: 'name'},
                    {label: 'Role', accessor: 'role'},
                ]}
                data={notation.notationParticipants}
                onClickAdd={() => { onClickAddParticipant({notationIndex: index})}}
                onClickRemove={(checked) => { onClickRemoveParticipant({notationIndex: index, checked})}}
            />
            
        </div>
    )
}
