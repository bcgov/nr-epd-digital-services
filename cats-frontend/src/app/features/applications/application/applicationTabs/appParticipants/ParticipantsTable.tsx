import React, { useCallback, useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus, UserPlus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import GetConfig, { getRolesConfig } from './ParticipantsConfig';
import {
  AppParticipantFilter,
  ViewParticipantsRolesDto,
} from '../../../../../../generated/types';
import {
  GetAppParticipantsByAppIdQuery,
  GetParticipantNamesDocument,
  useGetParticipantNamesQuery,
  useGetParticipantRolesQuery,
} from './graphql/Participants.generated';

import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';

import './ParticipantsTable.css';
import { getAxiosInstance, resultCache, updateFields } from '../../../../../helpers/utility';
import { useNavigate } from 'react-router-dom';

import { add, set } from 'date-fns';
import de from 'date-fns/esm/locale/de/index.js';
import { print } from 'graphql';
import { GRAPHQL } from '../../../../../helpers/endpoints';
import { getRoles } from '@testing-library/react';
import { ro } from 'date-fns/locale';

export const AppParticipantsActionTypes = {
  AddParticipant: 'Add Participant',
  EditParticipant: 'Edit Participant',
  ViewAppParticipants: 'View AppParticipants',
};
interface IParticipantTableProps {
  handleTableChange: (event: any) => void;
  internalRow: TableColumn[];
  userType: UserType;
  appParticsData: GetAppParticipantsByAppIdQuery['getAppParticipantsByAppId']['data'];
  loading: boolean;
  viewMode: UserMode;
  handleTableSort: (row: any, ascDir: any) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (particIsDelete?: boolean) => void;
  handleItemClick: (value: string) => void;
  approveRejectHandler?: (value: boolean) => void;
  showApproveRejectSection?: boolean;
  hideLabelForWidget?: boolean;
  handleFilterChange: (filter: AppParticipantFilter) => void;
  filter: AppParticipantFilter;
}

const ParticipantTable: React.FC<IParticipantTableProps> = ({
  handleTableChange,
  internalRow,
  userType,
  appParticsData,
  loading,
  viewMode,
  handleTableSort,
  handleAddParticipant,
  handleRemoveParticipant,
  handleItemClick,
  showApproveRejectSection,
  approveRejectHandler,
  hideLabelForWidget,
  handleFilterChange,
  filter,
}) => {
  showApproveRejectSection = showApproveRejectSection ?? false;
  hideLabelForWidget = hideLabelForWidget ?? false;

  approveRejectHandler = approveRejectHandler ?? (() => {});

  const {
    addAppParticipantsForm,
    participantColumnInternal,
  } = GetConfig();

  const rolesConfig = getRolesConfig();
  const [appParticsForm, setAppParticsForm] = useState(addAppParticipantsForm);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const onFilterChange = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
    handleFilterChange(newFilter);
  };

  const [roles, setRoles] = useState<
    { key: string; value: string }[] | undefined
  >(undefined);

  // const [participantNames, setParticipantNames] = useState<
  //   { key: string; value: string }[] | undefined
  // >(undefined);

  const [participantNames, setParticipantNames] = useState<{ key: string; value: string }[] | undefined>(undefined);

  const [role, setRole] = useState<string | null>(null);
  const [options, setOptions] = useState(rolesConfig);
  
  const [searchParam, setSearchParam] = useState<string>('');
  
   
  const initialAppParticipantDetails = {
    isMainParticipant: false,
    startDate: new Date().toString(),
    endDate: new Date().toString(),
    role: '',
    person: '',
    organization: '',
  };

  const [formData, setFormData] = useState({});

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: AppParticipantsActionTypes.ViewAppParticipants,
  });

  const fetchParticipantNames = useCallback(async (searchParam: string) => {
    if (searchParam.trim()) {
      try {
        // Check cache first
        if (resultCache[searchParam]) {
          return resultCache[searchParam];
        }
        // Store result in cache if successful
        const personData = await getAxiosInstance().post(GRAPHQL, {
          query: print(GetParticipantNamesDocument),
          variables: { searchParam },
        });
       // console.log('PT: personData: ', personData);
        if (personData?.data?.data?.getParticipantNames?.data) {  
          console.log('PT: ND: personData: ', personData?.data?.data?.getParticipantNames?.data);
          // const getParticipantNames = personData?.data?.data?.getParticipantNames?.data?.map((participant: any) => (
          //  {
          //   key: participant.id.toString(),
          //   value: participant.fullName,
          // }));
          //console.log('PT: ND: fetchParticipantNames: ', fetchParticipantNames);
          //setParticipantNames(getParticipantNames);
          resultCache[searchParam] = personData?.data?.data?.getParticipantNames?.data;
          //resultCache[searchParam] = getParticipantNames;
          setOptions(personData?.data?.data?.getParticipantNames?.data);
          //setOptions(getParticipantNames);
          //console.log("ND: participant names inside fetchParticipantNames: ", options, ": ", participantNames);
          return personData?.data?.data?.getParticipantNames?.data;
          //return getParticipantNames;
        }
        
      } catch (error) {
        console.error('Error fetching participant:', error);
        return [];
      }
    }
    return [];
  }, []);



    // Handle search action
  const handleSearch = useCallback(
    (value: any) => {
      //console.log('PT: handle search: value:  ', value);
      //console.log("ND: options inside handlesearch: ", options);
      setSearchParam(value.trim());
      //console.log('PT: searchParam after set: ', searchParam);

      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === "fullName"),
      );
      console.log('PT:  HS - indexToUpdate: ', indexToUpdate);
      console.log('PT: HS - options: ', options);

      setAppParticsForm((prev) =>
        updateFields(prev, {
          indexToUpdate,
          updates: {
            isLoading: RequestStatus.success,
            //options: rolesConfig, 
            filteredOptions: [],
            handleSearch,
            customInfoMessage: <></>,
          },
        }),
      );
    },
    [options],
  );
    
  
    
  useEffect(() => {
    if (searchParam) {
      const timeoutId = setTimeout(async () => {
      const res = await fetchParticipantNames(searchParam);
      

      const indexToUpdate = appParticsForm.findIndex((row) =>
              row.some((field) => field.graphQLPropertyName === "fullName"),
            );
            
        // const infoMsg = !res.success ? (
        //   <div className="px-2">
        //     <img
        //       src={infoIcon}
        //       alt="info"
        //       aria-hidden="true"
        //       role="img"
        //       aria-label="User image"
        //     />
        //     <span
        //       aria-label={'info-message'}
        //       className="text-wrap px-2 custom-not-found"
        //     >
        //       No results found.
        //     </span>
        //   </div>
        // ) : (
        //   <></>
        // );
        console.log('PT: ND: res: ', res);
        setAppParticsForm((prev) =>
          updateFields(prev, {
            indexToUpdate,
            updates: {
              isLoading: RequestStatus.success,
              options,
              filteredOptions:
                res.data ?? resultCache[searchParam] ?? [],
              customInfoMessage: <></>,
              handleSearch,
            },
          }),
        );
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParam, options]);
 

  handleAddParticipant = () => {
    setAppParticipant({
      isAppParticipantModal: true,
      appParticipantDetails: initialAppParticipantDetails,
      appParticipantActionType: AppParticipantsActionTypes.AddParticipant,
    });
  };

  useEffect(() => {
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === "description"),
    );
    console.log('ND: rolesConfig: ', rolesConfig);
    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          options: rolesConfig,
          filteredOptions: [],
          //handleSearch,
          customInfoMessage: <></>,
        },
      }),
    );
  }, [appParticipant.isAppParticipantModal]); 
  

  useEffect(() => {
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === "fullName"),
    );
    console.log('ND: participantNames: ', participantNames);
    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          options,
          filteredOptions: [],
          handleSearch,
          customInfoMessage: <></>,
        },
      }),
    );
  }, [appParticipant.isAppParticipantModal]); 
 

  const handleFormChange = (
    graphQLPropertyName: any,
    value: String | [Date, Date],
  ) => {
    console.log('PT: handleFormChange: ', graphQLPropertyName, value);
    if(value && typeof value === 'object' && 'key' in value) {
      value = (value as { key: string }).key;
      console.log('PT: handleFormChange: value: ', value);
    }
    setFormData({...formData, [graphQLPropertyName]: value });
    console.log('PT: formData: ', formData);
  };;

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h4 className="participants-title">Participants</h4>

        {userType === UserType.Internal && (
          <div className="d-flex gap-2 flex-wrap">
            <AppParticipantsTableControls
              handleFilterChange={onFilterChange}
              filter={filterOption}
            />
          </div>
        )}
      </div>
      <Widget
        currentPage={1}
        changeHandler={handleTableChange}
        title={''}
        tableColumns={internalRow}
        tableData={appParticsData ?? []}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        aria-label="App Participant Widget"
        hideTable={false}
        hideTitle={hideLabelForWidget}
        // primaryKeycolumnName="particRoleId"
        sortHandler={(row, ascDir) => {
          handleTableSort(row, ascDir);
        }}
      >
        {userType === UserType.Internal && (
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={handleAddParticipant}>
              <Plus />
              Add Participant
            </Button>
          </div>
        )}
        {appParticipant.isAppParticipantModal && (
          <ModalDialog
            headerLabel={appParticipant.appParticipantActionType}
            saveButtonDisabled={true}
            closeHandler={() => {}}
          >
            <Form
              formRows={appParticsForm}
              formData={formData}
              handleInputChange={(graphQLPropertyName, value) =>
                handleFormChange(graphQLPropertyName, value)
              }
            />
          </ModalDialog>
        )}
      </Widget>
    </div>
  );
};

export default ParticipantTable;
