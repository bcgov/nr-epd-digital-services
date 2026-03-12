import cx from 'classnames';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CollapsiblePanel from '../../../../../components/simple/CollapsiblePanel';
import { TickIcon } from '../../../../../components/common/icon';
import { formatDateUTC } from '../../../../../helpers/utility';
import { DropdownInput } from '../../../../../components/input-controls/InputControls';
import { FormFieldType } from '../../../../../components/input-controls/IFormField';
import {
  SaveButton,
  CancelButton,
} from '../../../../../components/simple/CustomButtons';

import { SiteDetails } from './components/SiteDetails';
import {
  useGetApplicationDetailsByIdQuery,
  useGetSiteDetailsBySiteIdQuery,
} from './Details.generated';
import {
  useGetApplicationServiceTypesQuery,
  useUpdateApplicationServiceTypeMutation,
  useUpdateSecondaryServiceTypesMutation,
} from '../../../../assignment/graphql/assignment.generated';
import styles from './Details.module.css';

interface IDetailsProps {
  applicationIdParam?: number;
  showSiteDetails?: boolean;
  defaultOpen?: boolean;
}

export const Details: React.FC<IDetailsProps> = ({
  applicationIdParam,
  showSiteDetails = true,
  defaultOpen = true,
}) => {
  const { id = '' } = useParams();
  const applicationId =
    id === '' ? (applicationIdParam ?? NaN) : parseInt(id, 10);

  const [serviceTypeId, setServiceTypeId] = useState<string>('');
  const [isEditingServiceType, setIsEditingServiceType] = useState(false);
  const [secondaryServiceTypeIds, setSecondaryServiceTypeIds] = useState<
    number[]
  >([]);
  const [isEditingSecondary, setIsEditingSecondary] = useState(false);

  const { data, loading: applicationDataLoading } =
    useGetApplicationDetailsByIdQuery({
      variables: {
        applicationId,
      },
      skip: !applicationId,
    });

  const application = data?.getApplicationDetailsById.data;

  const { data: serviceTypesList } = useGetApplicationServiceTypesQuery();
  const [updateServiceType, { loading: updating }] =
    useUpdateApplicationServiceTypeMutation();
  const [updateSecondaryServiceTypes, { loading: updatingSecondary }] =
    useUpdateSecondaryServiceTypesMutation();

  useEffect(() => {
    if (application?.serviceTypeId) {
      setServiceTypeId(application.serviceTypeId.toString());
    }
  }, [application?.serviceTypeId]);

  useEffect(() => {
    if (application?.secondaryServiceTypeIds) {
      setSecondaryServiceTypeIds(application.secondaryServiceTypeIds);
    }
  }, [application?.secondaryServiceTypeIds]);

  const handleSaveServiceType = async () => {
    try {
      await updateServiceType({
        variables: {
          applicationId: application?.id,
          serviceTypeId: Number(serviceTypeId),
        },
        refetchQueries: ['getApplicationDetailsById'],
      });
      setIsEditingServiceType(false);
    } catch (error) {
      console.error('Error updating service type:', error);
    }
  };

  const handleCancelEdit = () => {
    setServiceTypeId(application?.serviceTypeId?.toString() || '');
    setIsEditingServiceType(false);
  };

  const handleClearServiceType = async () => {
    try {
      await updateServiceType({
        variables: {
          applicationId: application?.id,
          serviceTypeId: null,
        },
        refetchQueries: ['getApplicationDetailsById'],
      });
      setServiceTypeId('');
      setIsEditingServiceType(false);
    } catch (error) {
      console.error('Error clearing service type:', error);
    }
  };

  const handleSaveSecondary = async () => {
    try {
      await updateSecondaryServiceTypes({
        variables: {
          applicationId: application?.id,
          serviceTypeIds: secondaryServiceTypeIds,
        },
        refetchQueries: ['getApplicationDetailsById'],
      });
      setIsEditingSecondary(false);
    } catch (error) {
      console.error('Error updating secondary service types:', error);
    }
  };

  const handleCancelSecondary = () => {
    setSecondaryServiceTypeIds(application?.secondaryServiceTypeIds || []);
    setIsEditingSecondary(false);
  };

  const handleClearSecondary = async () => {
    try {
      await updateSecondaryServiceTypes({
        variables: {
          applicationId: application?.id,
          serviceTypeIds: [],
        },
        refetchQueries: ['getApplicationDetailsById'],
      });
      setSecondaryServiceTypeIds([]);
      setIsEditingSecondary(false);
    } catch (error) {
      console.error('Error clearing secondary service types:', error);
    }
  };

  const handleSecondaryCheckboxChange = (typeId: number, checked: boolean) => {
    if (checked) {
      setSecondaryServiceTypeIds([...secondaryServiceTypeIds, typeId]);
    } else {
      setSecondaryServiceTypeIds(
        secondaryServiceTypeIds.filter((id) => id !== typeId),
      );
    }
  };

  const availableSecondaryOptions =
    serviceTypesList?.getApplicationServiceTypes?.data?.filter(
      (item) => item.key !== serviceTypeId,
    ) || [];

  const {
    data: siteData,
    loading: siteDataLoading,
    called: siteDataCalled,
  } = useGetSiteDetailsBySiteIdQuery({
    variables: {
      siteId: application?.siteId?.toString() || '',
    },
    skip: !application?.siteId,
  });

  const site = siteData?.getSiteDetailsBySiteId.data;

  return (
    <div className="d-flex flex-column gap-3">
      <CollapsiblePanel
        defaultOpen={defaultOpen}
        label="Application Information"
        loading={applicationDataLoading}
        defaultCloseBtnPosition="left"
        showBorder={applicationIdParam === undefined}
        showPadding={applicationIdParam === undefined}
        smallFont={!(applicationIdParam === undefined)}
        content={
          <div className={styles.rowsContainer}>
            <div className={cx(styles.row, styles.rowGrid6)}>
              <div className={styles.cell}>
                <label>Application ID</label>
                <div>{application?.id}</div>
              </div>
              <div className={styles.cell}>
                <label>CSAP Reference #</label>
                <div>{application?.csapRefNumber}</div>
              </div>
              <div className={styles.cell}>
                <label>Priority</label>
                <div>{application?.priority?.abbrev}</div>
              </div>
              <div className={styles.cell}>
                <label>Housing</label>
                <div>{application?.isHousing && <TickIcon />}</div>
              </div>
              <div className={styles.cell}>
                <label>Tax Exempt</label>
                <div>{application?.isTaxExempt && <TickIcon />}</div>
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid6)}>
              <div className={styles.cell}>
                <label>Received</label>
                <div>
                  {application?.receivedDate
                    ? formatDateUTC(application?.receivedDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Queued</label>
                <div>
                  {application?.queuedDate
                    ? formatDateUTC(application?.queuedDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Completed</label>
                <div>
                  {application?.endDate
                    ? formatDateUTC(application?.endDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Outcome</label>
                <div>{application?.outcome?.description}</div>
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid2)}>
              <div className={styles.cell}>
                <label>Application Type</label>
                <div>{application?.appType?.description}</div>
              </div>
              <div className={styles.cell}>
                <label>Status</label>
                <div>{application?.currentStatus?.description}</div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.cell}>
                <label>Site Type</label>
                <div>{application?.siteType?.description}</div>
              </div>
              <div className={styles.cell}>
                <label>Review Process</label>
                <div>{application?.reviewProcess?.description}</div>
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid2)}>
              <div className={styles.cell}>
                <label>Primary Application Service Type</label>
                {isEditingServiceType ? (
                  <div className="d-flex gap-2 align-items-center">
                    <DropdownInput
                      label={''}
                      placeholder={'Select Service Type'}
                      options={serviceTypesList?.getApplicationServiceTypes?.data?.map(
                        (item) => ({
                          key: item.key,
                          value: item.value,
                        }),
                      )}
                      value={serviceTypeId}
                      onChange={setServiceTypeId}
                      type={FormFieldType.DropDown}
                      isEditing={true}
                    />
                    <SaveButton
                      clickHandler={handleSaveServiceType}
                      label={'Save'}
                      variant={'primary'}
                      isDisabled={updating || !serviceTypeId}
                    />
                    <CancelButton
                      clickHandler={handleCancelEdit}
                      label={'Cancel'}
                      variant={'tertiary'}
                      isDisabled={false}
                    />
                  </div>
                ) : (
                  <div className="d-flex gap-2 align-items-center">
                    <div
                      onClick={() => setIsEditingServiceType(true)}
                      className={styles.clickableText}
                    >
                      {serviceTypesList?.getApplicationServiceTypes?.data?.find(
                        (item) => item.key === serviceTypeId,
                      )?.value || 'Click to set CSSA service type'}
                    </div>
                    {application?.serviceTypeId && (
                      <CancelButton
                        clickHandler={handleClearServiceType}
                        label={'Clear'}
                        variant={'secondary'}
                        isDisabled={false}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid2)}>
              <div className={styles.cell}>
                <label>Secondary Application Service Types</label>
                {isEditingSecondary ? (
                  <div>
                    <div className={styles.multiSelectContainer}>
                      {availableSecondaryOptions.map((item) => (
                        <div key={item.key} className={styles.multiSelectItem}>
                          <input
                            type="checkbox"
                            id={`secondary-${item.key}`}
                            checked={secondaryServiceTypeIds.includes(
                              Number(item.key),
                            )}
                            onChange={(e) =>
                              handleSecondaryCheckboxChange(
                                Number(item.key),
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            htmlFor={`secondary-${item.key}`}
                            className={styles.multiSelectLabel}
                          >
                            {item.value}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex gap-2 align-items-center mt-2">
                      <SaveButton
                        clickHandler={handleSaveSecondary}
                        label={'Save'}
                        variant={'primary'}
                        isDisabled={updatingSecondary}
                      />
                      <CancelButton
                        clickHandler={handleCancelSecondary}
                        label={'Cancel'}
                        variant={'tertiary'}
                        isDisabled={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-2 align-items-center">
                    {secondaryServiceTypeIds.length > 0 ? (
                      <ul className={styles.secondaryServiceTypeList}>
                        {secondaryServiceTypeIds
                          .map((id) =>
                            serviceTypesList?.getApplicationServiceTypes?.data?.find(
                              (item) => item.key === id.toString(),
                            ),
                          )
                          .filter(Boolean)
                          .map((item) => (
                            <li key={item.key}>{item.value}</li>
                          ))}
                      </ul>
                    ) : (
                      <div
                        onClick={() => setIsEditingSecondary(true)}
                        className={styles.clickableText}
                      >
                        Click to set secondary service types
                      </div>
                    )}
                    {secondaryServiceTypeIds.length > 0 && (
                      <>
                        <div
                          onClick={() => setIsEditingSecondary(true)}
                          className={styles.clickableTextSmall}
                        >
                          Edit
                        </div>
                        <CancelButton
                          clickHandler={handleClearSecondary}
                          label={'Clear'}
                          variant={'secondary'}
                          isDisabled={false}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      />
      {showSiteDetails && (
        <SiteDetails
          primarySite={site}
          associatedSites={site?.associatedSites || []}
          loading={siteDataLoading || !siteDataCalled}
        />
      )}
    </div>
  );
};
