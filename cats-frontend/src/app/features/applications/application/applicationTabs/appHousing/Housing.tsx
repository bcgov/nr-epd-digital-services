import { useParams } from 'react-router-dom';
import { Button } from '../../../../../components/button/Button';
import { Plus } from '../../../../../components/common/icon';
import Widget from '../../../../../components/widget/Widget';
import { RequestStatus } from '../../../../../helpers/requests/status';
import {
  getApplicationHousingColumns,
  getHousingFormFields,
} from './applicationHousingTableConfig';
import {
  useGetApplicationHousingByApplicationIdQuery,
  useAddHousingToApplicationMutation,
  useGetHousingTypesQuery,
  GetApplicationHousingByApplicationIdQuery,
  useUpdateApplicationHousingMutation,
} from './Housing.generated';
import { useState } from 'react';
import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';
import { YesNoCodeDto } from '../../../../../../generated/types';

const yesNoCodeToBoolean = (yesNoCode: Pick<YesNoCodeDto, 'abbrev'>) => {
  return yesNoCode.abbrev === 'Y';
};

type ApplicationHousing =
  GetApplicationHousingByApplicationIdQuery['getApplicationHousingByApplicationId']['data'][number]['housing'];

type HousingModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  housingData: {
    applicationHousingId?: string | null;
    housingType: string;
    numberOfUnits: string;
    effectiveDate: string;
    expiryDate: string;
    isRental: boolean;
    isSocial: boolean;
    isIndigenousLed: boolean;
    relatedApplications: string;
  };
};

const initialHousingModalState = (): HousingModalState => ({
  isOpen: false,
  mode: 'add',
  housingData: {
    applicationHousingId: null,
    housingType: '',
    numberOfUnits: '',
    effectiveDate: '',
    expiryDate: '',
    isRental: false,
    isSocial: false,
    isIndigenousLed: false,
    relatedApplications: '',
  },
});

export const Housing = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const [housingModal, setHousingModal] = useState<HousingModalState>(
    initialHousingModalState(),
  );

  const { data: housingTypesData } = useGetHousingTypesQuery({
    skip: !applicationId || !housingModal.isOpen,
  });

  const {
    data,
    loading,
    refetch: refetchHousingTableData,
  } = useGetApplicationHousingByApplicationIdQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  const housingForm = getHousingFormFields({
    housingTypes: housingTypesData?.getHousingTypes.data || [],
    relatedApplicationsValue: housingModal.housingData.relatedApplications,
    setRelatedApplicationsValue: (value) => {
      setHousingModal({
        ...housingModal,
        housingData: {
          ...housingModal.housingData,
          relatedApplications: value,
        },
      });
    },
  });

  const [addHousingToApplication, { loading: addHousingLoading }] =
    useAddHousingToApplicationMutation();

  const [
    updateApplicationHousing,
    { loading: updateApplicationHousingLoading },
  ] = useUpdateApplicationHousingMutation();

  const tableChangeHandler = (event: any) => {
    if (event.property !== 'edit') {
      return;
    }

    const applicationHousingId = event.row.id;
    const housing = event.row.housing as ApplicationHousing;
    setHousingModal({
      isOpen: true,
      mode: 'edit',
      housingData: {
        applicationHousingId,
        housingType: housing.housingType.id.toString(),
        numberOfUnits: housing.numberOfUnits.toString(),
        effectiveDate: housing.effectiveDate,
        expiryDate: housing.expiryDate,
        isRental: yesNoCodeToBoolean(housing.isRental),
        isSocial: yesNoCodeToBoolean(housing.isSocial),
        isIndigenousLed: yesNoCodeToBoolean(housing.isIndigenousLed),
        relatedApplications: housing.relatedApplications.join(','),
      },
    });
  };

  const saveApplicationHousingHandler = () => {
    const {
      housingData: {
        housingType,
        numberOfUnits,
        effectiveDate,
        expiryDate,
        isRental,
        isSocial,
        isIndigenousLed,
        relatedApplications,
        applicationHousingId,
      },
    } = housingModal;

    const input = {
      effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      housingTypeId: parseInt(housingType, 10),
      numberOfUnits: parseInt(numberOfUnits, 10),
      isRental: isRental,
      isSocial: isSocial,
      isIndigenousLed: isIndigenousLed,
      relatedApplicationIds: relatedApplications
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter(Boolean),
    };

    if (housingModal.mode === 'add') {
      addHousingToApplication({
        variables: {
          input: {
            applicationId,
            ...input,
          },
        },
        onCompleted: () => {
          setHousingModal(initialHousingModalState());
          refetchHousingTableData();
        },
      });
    } else {
      updateApplicationHousing({
        variables: {
          input: {
            applicationHousingId: parseInt(applicationHousingId!, 10),
            ...input,
          },
        },
        onCompleted: () => {
          setHousingModal(initialHousingModalState());
          refetchHousingTableData();
        },
      });
    }
  };

  const handleInputChange = (graphQLPropertyName: string, value: any) => {
    setHousingModal({
      ...housingModal,
      housingData: {
        ...housingModal.housingData,
        [graphQLPropertyName]: value,
      },
    });
  };

  const dataSaveInProgress =
    addHousingLoading || updateApplicationHousingLoading;

  const isFormValid = [
    housingModal.housingData.housingType,
    housingModal.housingData.numberOfUnits,
    housingModal.housingData.effectiveDate,
    housingModal.housingData.expiryDate,
  ].every(Boolean);

  return (
    <>
      <Widget
        primaryKeycolumnName="id"
        tableData={data?.getApplicationHousingByApplicationId.data || []}
        title={'Housing'}
        tableColumns={getApplicationHousingColumns()}
        tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
        changeHandler={tableChangeHandler}
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            disabled={dataSaveInProgress}
            onClick={() =>
              setHousingModal({
                ...initialHousingModalState(),
                isOpen: true,
              })
            }
          >
            <Plus />
            New Housing Type
          </Button>
        </div>
      </Widget>
      {housingModal.isOpen && (
        <ModalDialog
          headerLabel={
            housingModal.mode === 'add' ? 'Add Housing' : 'Edit Housing'
          }
          cancelBtnLabel="Cancel"
          saveBtnLabel="Save Housing Type"
          saveButtonDisabled={dataSaveInProgress || !isFormValid}
          cancelButtonDisabled={dataSaveInProgress}
          closeHandler={(saved) => {
            if (!saved) {
              return setHousingModal(initialHousingModalState());
            }
            saveApplicationHousingHandler();
          }}
        >
          <Form
            editMode={true}
            formRows={housingForm}
            formData={housingModal.housingData}
            handleInputChange={handleInputChange}
          />
        </ModalDialog>
      )}
    </>
  );
};
