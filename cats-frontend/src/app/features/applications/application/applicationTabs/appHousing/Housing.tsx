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
} from './Housing.generated';
import { useState } from 'react';
import ModalDialog from '../../../../../components/modaldialog/ModalDialog';
import Form from '../../../../../components/form/Form';

const initialHousingModalState = () => ({
  isOpen: false,
  housingData: {
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

  const [housingModal, setHousingModal] = useState(initialHousingModalState());

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

  const tableChangeHandler = (event: any) => {
    if (event.property === 'edit') {
      console.log('Edit housing ', event.row.id);
    }
  };

  const addHousingToApplicationHandler = () => {
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
      },
    } = housingModal;

    addHousingToApplication({
      variables: {
        input: {
          applicationId,
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
        },
      },
      onCompleted: () => {
        setHousingModal(initialHousingModalState());
        refetchHousingTableData();
      },
    });
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
            disabled={addHousingLoading}
            onClick={() => setHousingModal({ ...housingModal, isOpen: true })}
          >
            <Plus />
            New Housing Type
          </Button>
        </div>
      </Widget>
      {housingModal.isOpen && (
        <ModalDialog
          headerLabel={'Add Housing'}
          saveButtonDisabled={addHousingLoading}
          cancelButtonDisabled={addHousingLoading}
          closeHandler={(saved) => {
            if (!saved) {
              return setHousingModal(initialHousingModalState());
            }

            addHousingToApplicationHandler();
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
