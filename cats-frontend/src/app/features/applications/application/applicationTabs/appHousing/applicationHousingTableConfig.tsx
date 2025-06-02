import { Link } from 'react-router-dom';
import {
  PencilIcon,
  QuestionMarkIcon,
  TickIcon,
} from '../../../../../components/common/icon';
import {
  FormFieldType,
  IFormField,
} from '../../../../../components/input-controls/IFormField';
import {
  ColumnSize,
  TableColumn,
} from '../../../../../components/table/TableColumn';
import { formatDateUTC } from '../../../../../helpers/utility';
import { HousingTypeDto } from '../../../../../../generated/types';
import { RelatedApplicationsField } from './components/RelatedApplicationsField';

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

// This needs to be a function, at least for now
// The href in the Actions column needs to be evaluated on component mount, not on app load
// This makes sure that the user is not redirected back to the tab they loaded the app to originally
// If this beocmes a problem, we should try using a tertiary button there instead
export const getApplicationHousingColumns = (): TableColumn[] => [
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
    graphQLPropertyName: 'housing.isIndigenousLed.abbrev',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return <YesNoCodeCell value={value as YesNoCodeInput} />;
    },
  },
  {
    id: 4,
    displayName: '# of Units',
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
              <Link to={`/applications/${id}`}>{id}</Link>
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

const getHousingTypeField = (housingTypes: HousingTypeDto[]): IFormField => ({
  type: FormFieldType.DropDown,
  label: 'Housing Type',
  graphQLPropertyName: 'housingType',
  placeholder: 'Select Housing Type',
  options: housingTypes.map((type) => ({
    key: type.id,
    value: type.description,
  })),
  colSize: 'col-lg-6 col-md-6 col-sm-12',
  validation: {
    required: true,
    customMessage: 'Housing Type is required.',
  },
});

const getRelatedApplicationsField = (
  relatedApplicationsValue: string,
  setRelatedApplicationsValue: (value: string) => void,
): IFormField => ({
  type: FormFieldType.Custom,
  label: 'Related Application(s)',
  renderField: (
    <RelatedApplicationsField
      value={relatedApplicationsValue}
      onChange={setRelatedApplicationsValue}
    />
  ),
});

const housingFormFields: {
  [key: string]: IFormField;
} = {
  numberOfUnits: {
    type: FormFieldType.Text,
    label: '# of Units',
    graphQLPropertyName: 'numberOfUnits',
    allowNumbersOnly: true,
    validation: {
      pattern: /^[0-9]*$/,
      customMessage: 'Number of Units must be a positive integer',
    },
    colSize: 'col-lg-6 col-md-6 col-sm-12',
  },
  effectiveDate: {
    type: FormFieldType.Date,
    label: 'Effective Date',
    placeholder: 'EE MMM dd yyyy',
    dateFormat: 'EE MMM dd yyyy',
    graphQLPropertyName: 'effectiveDate',
    colSize: 'col-lg-6 col-md-6 col-sm-12',
    validation: {
      required: true,
      customMessage: 'Effective Date is required.',
    },
  },
  expiryDate: {
    type: FormFieldType.Date,
    label: 'Expiry Date',
    placeholder: 'EE MMM dd yyyy',
    dateFormat: 'EE MMM dd yyyy',
    graphQLPropertyName: 'expiryDate',
    colSize: 'col-lg-6 col-md-6 col-sm-12',
    validation: {
      required: true,
      customMessage: 'Expiry Date is required.',
    },
  },

  replaceFileRow: {
    type: FormFieldType.Group,
    label: 'Replace File',
    value: '',
    children: [
      {
        type: FormFieldType.Checkbox,
        label: 'Rental',
        placeholder: 'Rental',
        graphQLPropertyName: 'isRental',
      },
      {
        type: FormFieldType.Checkbox,
        label: 'Social',
        placeholder: 'Social',
        graphQLPropertyName: 'isSocial',
      },
      {
        type: FormFieldType.Checkbox,
        label: 'Indigenous Led',
        placeholder: 'Indigenous Led',
        graphQLPropertyName: 'isIndigenousLed',
      },
    ],
  },
};

export const getHousingFormFields = ({
  housingTypes,
  relatedApplicationsValue,
  setRelatedApplicationsValue,
}: {
  housingTypes: HousingTypeDto[];
  relatedApplicationsValue: string;
  setRelatedApplicationsValue: (value: string) => void;
}): IFormField[][] => [
    [getHousingTypeField(housingTypes), housingFormFields['numberOfUnits']],
    [housingFormFields['effectiveDate'], housingFormFields['expiryDate']],
    [housingFormFields['replaceFileRow']],
    [
      getRelatedApplicationsField(
        relatedApplicationsValue,
        setRelatedApplicationsValue,
      ),
    ],
  ];
