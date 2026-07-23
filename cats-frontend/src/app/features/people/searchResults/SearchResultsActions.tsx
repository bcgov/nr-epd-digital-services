import { FC } from 'react';
import { useAuth } from 'react-oidc-context';

import { Button } from '../../../components/button/Button';
import { getUser } from '../../../helpers/utility';

import { PlainTrashIcon } from '../../../components/common/icon';
import Actions from '../../../components/action/Actions';
import { usePeopleUpdate } from '../hooks/usePeopleUpdate';
import { UpdatePerson } from '../../../../generated/types';

interface SearchResultsActionsProps {
  selectedRows: any[];
}

export const SearchResultsActions: FC<SearchResultsActionsProps> = ({
  selectedRows,
}) => {
  const auth = useAuth();
  const { mutate, isPending } = usePeopleUpdate();
  const controlsDisabled = selectedRows.length === 0 || isPending;

  const buildUpdateInput = (overrides: Partial<UpdatePerson>): UpdatePerson[] =>
    selectedRows.map((row) => ({
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
      updatedDatetime: new Date().toISOString(),
      ...overrides,
    }));

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      return;
    }

    const loggedInUser = getUser();
    if (loggedInUser === null) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
      return;
    }

    mutate(
      buildUpdateInput({
        isActive: false,
        isDeleted: true,
      }),
    );
  };

  const handleActiveStatusChange = (event: any) => {
    const loggedInUser = getUser();
    if (loggedInUser === null) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: 'idir' } });
      return;
    }

    mutate(
      buildUpdateInput({
        isActive: event === 'Active',
      }),
    );
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
        onClick={handleDelete}
        disabled={controlsDisabled}
      >
        <PlainTrashIcon />
        Delete Selected
      </Button>
    </div>
  );
};
