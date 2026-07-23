import { FC } from 'react';
import { useAuth } from 'react-oidc-context';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../Store';
import { Button } from '../../../components/button/Button';
import { getUser } from '../../../helpers/utility';
import { RequestStatus } from '../../../helpers/requests/status';

import { PlainTrashIcon } from '../../../components/common/icon';
import Actions from '../../../components/action/Actions';
import { updatePeopleRequested, updatePeopleStatus } from '../dto/PeopleSlice';
import { PeopleUpdateInput } from '../dto/PeopleUpdateTypes';

interface SearchResultsActionsProps {
  selectedRows: any[];
}

const buildUpdateInput = (
  row: any,
  overrides: Partial<PeopleUpdateInput>,
): PeopleUpdateInput => ({
  id: row.id,
  middleName: '',
  firstName: row.firstName,
  lastName: row.lastName,
  isTaxExempt: row.isTaxExempt,
  isEnvConsultant: row.isEnvConsultant,
  loginUserName: row.loginUserName,
  address_1: row.address_1,
  address_2: row.address_2,
  city: row.city,
  prov: row.prov,
  country: row.country,
  postal: row.postal,
  phone: row.phone,
  mobile: row.mobile,
  fax: row.fax,
  email: row.email,
  updatedBy: '',
  // ISO string keeps the Redux action payload serializable.
  updatedDatetime: new Date().toISOString(),
  ...overrides,
});

export const SearchResultsActions: FC<SearchResultsActionsProps> = ({
  selectedRows,
}) => {
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const updateStatus = useSelector(updatePeopleStatus);
  const isUpdating = updateStatus === RequestStatus.loading;
  const controlsDisabled = selectedRows.length === 0 || isUpdating;

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0 || isUpdating) {
      return;
    }

    const loggedInUser = getUser();
    if (loggedInUser === null) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
      return;
    }

    const updatePeopleInput = selectedRows.map((row) =>
      buildUpdateInput(row, { isActive: false, isDeleted: true }),
    );
    dispatch(updatePeopleRequested(updatePeopleInput));
  };

  const handleActiveStatusChange = (event: string) => {
    if (selectedRows.length === 0 || isUpdating) {
      return;
    }

    const loggedInUser = getUser();
    if (loggedInUser === null) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
      return;
    }

    const updatePeopleInput = selectedRows.map((row) =>
      buildUpdateInput(row, { isActive: event === 'Active' }),
    );
    dispatch(updatePeopleRequested(updatePeopleInput));
  };

  return (
    <div className="search-result-actions">
      <Actions
        label="Set Active Status"
        items={[
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
        onItemClick={handleActiveStatusChange}
        toggleButtonVariant="secondary"
        disable={controlsDisabled}
      />

      <Button
        variant="secondary"
        onClick={handleDeleteSelected}
        disabled={controlsDisabled}
      >
        <PlainTrashIcon />
        Delete Selected
      </Button>
    </div>
  );
};
