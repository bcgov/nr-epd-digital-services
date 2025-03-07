import { Link } from 'react-router-dom';
import {
  PencilIcon,
  QuestionMarkIcon,
  TickIcon,
} from '../../../../../components/common/icon';
import { FormFieldType } from '../../../../../components/input-controls/IFormField';
import {
  ColumnSize,
  TableColumn,
} from '../../../../../components/table/TableColumn';
import { formatDateUTC } from '../../../../../helpers/utility';

type YesNoCodeInput = 'Y' | 'N' | 'U';
const YesNoCodeCell = ({ value }: { value: YesNoCodeInput }) => {
  if (value === 'Y') {
    return <TickIcon />;
  }
  if (value === 'U') {
    return <QuestionMarkIcon />;
  }
  return '';
};

export const applicationHousingColumns: TableColumn[] = [
  {
    id: 1,
    displayName: 'Service',
    active: true,
    graphQLPropertyName: 'housing.housingType.description',
    displayType: { type: FormFieldType.Label },
    columnSize: ColumnSize.Double,
    dynamicColumn: true,
  },
  {
    id: 2,
    displayName: 'Rental Housing',
    active: true,
    graphQLPropertyName: 'housing.isRental.abbrev',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return <YesNoCodeCell value={value as YesNoCodeInput} />;
    },
  },
  {
    id: 3,
    displayName: 'Social Housing',
    active: true,
    graphQLPropertyName: 'housing.isSocial.abbrev',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return <YesNoCodeCell value={value as YesNoCodeInput} />;
    },
  },
  {
    id: 3,
    displayName: 'Indigenous Led',
    active: true,
    graphQLPropertyName: 'housing.isSocial.abbrev',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return <YesNoCodeCell value={value as YesNoCodeInput} />;
    },
  },
  {
    id: 4,
    displayName: '# Units',
    active: true,
    graphQLPropertyName: 'housing.numberOfUnits',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    columnSize: ColumnSize.XtraSmall,
  },
  {
    id: 5,
    displayName: 'Effective Date',
    active: true,
    graphQLPropertyName: 'housing.effectiveDate',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return formatDateUTC(value);
    },
  },
  {
    id: 5,
    displayName: 'Expiry Date',
    active: true,
    graphQLPropertyName: 'housing.expiryDate',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return formatDateUTC(value);
    },
  },
  {
    id: 6,
    displayName: 'Related Application(s)',
    active: true,
    graphQLPropertyName: 'housing.relatedApplications',
    displayType: { type: FormFieldType.Label, tableMode: true },
    dynamicColumn: true,
    renderCell: (value: any) => {
      if (value && Array.isArray(value)) {
        const applicationLinks = value.map((id, i) => {
          return (
            <span key={id}>
              {i > 0 && ', '}
              <Link to={`/application/${id}`}>{id}</Link>
            </span>
          );
        });

        return applicationLinks;
      }
      return value;
    },
  },
  {
    id: 8,
    displayName: 'Actions',
    active: true,
    graphQLPropertyName: 'edit',
    displayType: {
      type: FormFieldType.Link,
      label: 'Edit',
      graphQLPropertyName: 'edit',
      value: '',
      customLinkValue: 'Edit',
      tableMode: true,
      href: window.location.toString(),
      customIcon: <PencilIcon />,
    },
    dynamicColumn: true,
    columnSize: ColumnSize.XtraSmall,
  },
];
