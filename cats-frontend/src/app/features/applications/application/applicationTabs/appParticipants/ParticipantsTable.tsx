import React, { useCallback, useEffect, useState } from 'react';
import { TableColumn } from '../../../../../components/table/TableColumn';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { UserMode } from '../../../../../helpers/requests/userMode';
import Widget from '../../../../../components/widget/Widget';
import { Button } from '../../../../../components/button/Button';
import { Plus, UserPlus } from '../../../../../components/common/icon';
import { AppParticipantsTableControls } from './AppParticipantsTableControls';
import GetConfig from './ParticipantsConfig';
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

import { set } from 'date-fns';
import de from 'date-fns/esm/locale/de/index.js';
import { print } from 'graphql';
import { GRAPHQL } from '../../../../../helpers/endpoints';

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
    participantColumnInternal
  } = GetConfig();

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

  const [participantNames, setParticipantNames] = useState<
    { key: string; value: string }[] | undefined
  >(undefined);

  const [role, setRole] = useState<string | null>(null);
  const [options, setOptions] = useState<any>([]);

  //const { data } = useGetParticipantRolesQuery();

  // useEffect(() => {
  //   if(data) {
  //     const fetchedRoles = data?.getAllParticipantRoles.data?.map((role) => ({
  //       key: role.id.toString(),
  //       value: role.description,
  //     }));
  //     setRoles(fetchedRoles);
  //     appParticipantsForm.role.options = fetchedRoles;
  //   }
  // },[data]);

  
  const [searchParam, setSearchParam] = useState<string>('');


  // const fetchParticipantNames = useCallback(async (searchParam: string) => {
  //   const { data } = useGetParticipantNamesQuery({
  //     variables: {searchParam},
  //   });
  //   const fetchedNames = data?.getParticipantNames.data?.map((participant) => ({
  //     key: participant.id.toString(),
  //     value: participant.fullName,
  //   }));
  //   setParticipantNames(fetchedNames);
  //   appParticipantsForm.participantName.options = fetchedNames;
  // }, []);


  const fetchParticipantNames = useCallback(async (searchParam: string) => {
    if (searchParam.trim()) {
      try {
        // Check cache first
        if (resultCache[searchParam]) {
          return resultCache[searchParam];
        }

        // const { data } = useGetParticipantNamesQuery({
        //   variables: {searchParam},
        // });

        const response = await getAxiosInstance().post(GRAPHQL, {
          query: print(GetParticipantNamesDocument),
          variables: { searchParam },
        });
        console.log(response)
        // Store result in cache if successful
        if (response?.data?.data?.getParticipantNames?.success) {
          resultCache[searchParam] =response.data.data.getParticipantNames.data;
          return response.data.data.getParticipantNames;
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
      console.log('PT: handle search: value:  ', value);

      setSearchParam(value.trim());
      console.log('PT: searchParam after set: ', searchParam);

      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === "fullName"),
      );

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
    },
    [options],
  );

  // useEffect(() => {
  //   console.log(appParticsData)
  //   const uniqueParticName= Array.from(
  //     new Map(
  //       appParticsData?.map((item: any) => [
  //         item.id,
  //         { key: item.id, value: item.name },
  //       ]),
  //     ).values(),
  //   );
  //   setOptions(uniqueParticName);
  //   const indexToUpdate = appParticsForm.findIndex((row) =>
  //     row.some((field) => field.graphQLPropertyName === "fullName"),
  //   );

  //   setAppParticsForm((prev) =>
  //     updateFields(prev, {
  //       indexToUpdate,
  //       updates: {
  //         isLoading: RequestStatus.success,
  //         options: uniqueParticName,
  //         filteredOptions: [],
  //         handleSearch,
  //         customInfoMessage: <></>,
  //       },
  //     }),
  //   );
  // }, [appParticsData])
 
  // useEffect(() => {
  //   if(searchParam) {
  //     fetchParticipantNames(searchParam);
  //     const indexToUpdate = appParticsForm.findIndex((row) =>
  //       row.some((field) => field.graphQLPropertyName === "fullName"),
  //     );
      
  //     setAppParticsForm((prev) =>
  //       updateFields(prev, {
  //         indexToUpdate,
  //         updates: {
  //           isLoading: RequestStatus.success,
  //           //options: participantNames,
  //           filteredOptions: participantNames,
  //           handleSearch,
  //           customInfoMessage: '',
  //         },
  //       }),
  //     );
  //   }
  // }, [searchParam, options]);
    
  useEffect(() => {
    if (searchParam) {
      const timeoutId = setTimeout(async () => {
        debugger;
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
  
  const initialAppParticipantDetails = {
    isMainParticipant: false,
    startDate: new Date().toString(),
    endDate: new Date().toString(),
    role: '',
    person: '',
    organization: '',
  };

  const [formData, setFormData] = useState(initialAppParticipantDetails);

  const [appParticipant, setAppParticipant] = useState({
    isAppParticipantModal: false,
    appParticipantDetails: initialAppParticipantDetails,
    appParticipantActionType: AppParticipantsActionTypes.ViewAppParticipants,
  });

  handleAddParticipant = () => {
    setAppParticipant({
      isAppParticipantModal: true,
      appParticipantDetails: initialAppParticipantDetails,
      appParticipantActionType: AppParticipantsActionTypes.AddParticipant,
    });
  };

  useEffect(() => {
    console.log("PT: inside useeffect");
    console.log("PT: handlesearch ", handleSearch);
    const indexToUpdate = appParticsForm.findIndex((row) =>
      row.some((field) => field.graphQLPropertyName === "fullName"),
    );
    setAppParticsForm((prev) =>
      updateFields(prev, {
        indexToUpdate,
        updates: {
          isLoading: RequestStatus.success,
          //options: participantNames,
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
    console.log('graphQLPropertyName', graphQLPropertyName);
    // if (graphQLPropertyName === 'description') {
    //   const indexToUpdate = appParticsForm.findIndex((row) =>
    //     row.some((field) => field.graphQLPropertyName === graphQLPropertyName),
    //   );
    //   setAppParticsForm((prev) =>
    //     updateFields(prev, {
    //       indexToUpdate,
    //       updates: {
    //         isLoading: RequestStatus.success,
    //         options: roles,
    //         customInfoMessage: '',
    //       },
    //     }),
    //   );
    // }

    // if (graphQLPropertyName === 'fullName') {
    //   //fetchParticipantNames(value as string);
      const indexToUpdate = appParticsForm.findIndex((row) =>
        row.some((field) => field.graphQLPropertyName === graphQLPropertyName),
      );
      
      setAppParticsForm((prev) =>
        updateFields(prev, {
          indexToUpdate,
          updates: {
            isLoading: RequestStatus.success,
            options,
            filteredOptions: [],
            handleSearch,
            customInfoMessage: '',
          },
        }),
      );
   // }

    setFormData({ ...formData, [graphQLPropertyName]: value });
  };

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
