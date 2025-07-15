import { FillEye, TickIcon } from '../../../components/common/icon';
import { FormFieldType } from '../../../components/input-controls/IFormField';
import { TableColumn } from '../../../components/table/TableColumn';

const getPeopleSearchResultsColumns = () => {
  const columns: TableColumn[] = [
    {
      id: 1,
      displayName: 'First Name',
      active: true,
      graphQLPropertyName: 'firstName',
      groupId: 1,
      disabled: true,
      isDefault: true,
      sortOrder: 1,
      isChecked: true,
      displayType: getColumnType('First Name', 'firstName', ''),
    },
    new TableColumn(
      6,
      'Last Name',
      true,
      'lastName',
      2,
      true,
      true,
      1,
      true,
      getColumnType('Last Name', 'lastName', ''),
      'people/details/',
      false,
    ),
    new TableColumn(
      7,
      'Address',
      true,
      'address_1,address_2',
      2,
      false,
      true,
      1,
      true,
      getColumnType('Address', 'address_1,address_2', ''),
    ),
    new TableColumn(
      2,
      'Email',
      true,
      'email',
      1,
      false,
      true,
      1,
      true,
      getColumnType('Email', 'email', ''),
    ),
    new TableColumn(
      3,
      'Active',
      true,
      'isActive',
      1,
      false,
      true,
      1,
      true,
      getIconColumnType('Active', 'isActive', ''),
    ),
    new TableColumn(
      4,
      'Tax Exempt',
      true,
      'isTaxExempt',
      1,
      false,
      true,
      1,
      true,
      getIconColumnType('Tax Exempt', 'isTaxExempt', ''),
    ),
    {
      id: 18,
      displayName: 'Actions',
      active: true,
      graphQLPropertyName: 'id',
      groupId: 4,
      disabled: true,
      isDefault: true,
      sortOrder: 1,
      isChecked: true,
      displayType: {
        type: FormFieldType.Link,
        label: 'View',
        graphQLPropertyName: 'id',
        value: '',
        customLinkValue: 'View',
        customIcon: <FillEye />,
        customInputTextCss: 'custom-search-link',
        tableMode: true,
        href: '/person/',
        customContainerCss: 'custom-search-column-position',
        componentName: 'Manage People',
      },
      customHeaderCss: 'custom-search-tbl-header custom-search-column-position',
      dynamicColumn: true,
    },
  ];

  return columns;
};

const getColumnType = (label: string, propertyName: string, value: string) => {
  return {
    type: FormFieldType.Label,
    label: label,
    graphQLPropertyName: propertyName,
    value: value,
    customInputTextCss: 'custom-search-input-text',
    tableMode: true,
  };
};

const getIconColumnType = (
  label: string,
  propertyName: string,
  value: string,
) => {
  return {
    type: FormFieldType.Icon,
    label: 'Tax Exempt',
    graphQLPropertyName: 'siteId',
    value: '',
    customLinkValue: 'View',
    customInputTextCss: 'custom-manage-people-icon',
    tableMode: true,
    href: 'site/map/',
    customIcon: <TickIcon />,
  };
};

export { getPeopleSearchResultsColumns };

export const B: any = 1;
