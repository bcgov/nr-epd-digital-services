import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormFieldType, IFormField } from './IFormField';
import { formatDate, formatDateRange, formatDateUTC, normalizeDate, parseLocalDate } from '../../helpers/utility';
import { DatePicker, DateRangePicker } from 'rsuite';
import {
  CalendarIcon,
  CircleXMarkIcon,
  MagnifyingGlassIcon,
  SpinnerIcon,
  TrashCanIcon,
} from '../common/icon';
import { Link as RouterLink } from 'react-router-dom';
import { v4 } from 'uuid';
import Dropdown from 'react-bootstrap/Dropdown';
import SearchInput from '../search/SearchInput';
import Avatar from '../avatar/Avatar';
import { RequestStatus } from '../../helpers/requests/status';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import {
  Switch as ReactAriaSwitch,
  SwitchProps as ReactAriaSwitchProps,
} from 'react-aria-components';

import styles from './InputControls.module.css';
import { format } from 'date-fns';

interface InputProps extends IFormField {
  children?: InputProps[];
  isEditing?: boolean;
  isLoading?: RequestStatus;
  srMode?: boolean;
  onChange: (value: any) => void;
}

const renderTableCell = (
  content: JSX.Element | string,
  stickyCol?: boolean,
) => {
  return (
    <td
      className={`"table-border-light align-content-center" ${stickyCol ? 'positionSticky' : ''}`}
    >
      {content}
    </td>
  );
};

export const Link: React.FC<InputProps> = ({
  label,
  value,
  customInputTextCss,
  customLinkValue,
  customIcon,
  onChange,
  stickyCol,
  href,
  componentName,
}) => {
  return renderTableCell(
    <RouterLink
      to={href + value}
      className={`d-flex pt-1 ${styles.baseTableLinkStyles} ${customInputTextCss ?? ''}`}
      aria-label={`${label + ' ' + value}`}
      state={{ from: componentName ?? '' }}
      onClick={onChange}
    >
      {customIcon && customIcon}{' '}
      <span className="ps-1">{customLinkValue ?? value}</span>
    </RouterLink>,
    stickyCol,
  );
};

export const IconButton: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  validation,
  allowNumbersOnly,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customLinkValue,
  customIcon,
  onChange,
  tableMode,
  stickyCol,
  href,
}) => {
  return renderTableCell(
    <div onClick={onChange} className={`${customInputTextCss ?? ''}`}>
      {customIcon && customIcon}{' '}
      <span className="ps-1">{customLinkValue ?? value}</span>
    </div>,
  );
};

export const Icon: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  validation,
  allowNumbersOnly,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customLinkValue,
  customIcon,
  onChange,
  tableMode,
  stickyCol,
  href,
}) => {
  if (value === 'true' || value === true) {
    return renderTableCell(
      <div className={`${customInputTextCss ?? ''}`}>
        {customIcon && customIcon}{' '}
        {/* <span className="ps-1">{customLinkValue ?? value}</span> */}
      </div>,
    );
  } else {
    return renderTableCell(<></>);
  }
};

export const DeleteIcon: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  validation,
  allowNumbersOnly,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  onChange,
  tableMode,
  href,
}) => {
  return renderTableCell(
    <div onClick={onChange}>
      <TrashCanIcon title="Remove" />
      <span aria-label={label}>&nbsp;Remove</span>
    </div>,
  );
};

export const Label: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  validation,
  allowNumbersOnly,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  stickyCol,
  onChange,
  tableMode,
}) => {
  return renderTableCell(
    <span
      aria-label={label}
      className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
    >
      {value}
    </span>,
    stickyCol,
  );
};

export const TextInput: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  value,
  validation,
  allowNumbersOnly,
  isEditing,
  isDisabled,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  customErrorCss,
  stickyCol,
  onChange,
  tableMode,
  customInfoMessage,
}) => {
  const ContainerElement = tableMode ? 'td' : 'div';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      (validation?.required || validation?.pattern) &&
      validation?.onLoadValidation
    ) {
      setError(null);
      validateInput(value);
    }
  }, []);

  const validateInput = (inputValue: any) => {
    if (validation) {
      if (validation?.pattern && !validation.pattern?.test(inputValue)) {
        setError(validation.customMessage || '');
        return false;
      }
      if (validation.required && !inputValue.trim()) {
        setError(validation.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (validation?.required || validation?.pattern) {
      validateInput(inputValue);
    }

    if (allowNumbersOnly) {
      if (validateInput(parseFloat(inputValue))) {
        onChange(inputValue); // Update parent component state only if validation passes
      }
    } else {
      onChange(inputValue);
    }
  };

  // Replace any spaces in the label with underscores to create a valid id
  const inputTxtId = label?.replace(/\s+/g, '_') + '_' + v4();
  return (
    <ContainerElement
      className={`${tableMode ? 'table-border-light align-content-center ' : 'mb-3'} ${tableMode && stickyCol ? 'positionSticky' : ''} `}
    >
      {!tableMode && (
        <>
          {!tableMode && (
            <label
              htmlFor={inputTxtId}
              className={`${!isEditing ? (customLabelCss ?? '') : `form-label ${customEditLabelCss ?? 'custom-label'}`} ${validation?.required ? 'required-field' : ''}`}
            >
              {label}
            </label>
          )}
        </>
      )}
      {isEditing ? (
        <input
          type={type}
          id={inputTxtId}
          data-testid={inputTxtId}
          className={`form-control custom-input ${customPlaceholderCss ?? ''} ${
            customEditInputTextCss ?? 'custom-input-text'
          }  ${error && 'error'}`}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleTextInputChange}
          aria-label={label} // Accessibility
          required={error ? true : false}
          disabled={isDisabled ?? false}
        />
      ) : (
        <span className={`d-flex ${customInputTextCss ?? ''}`}>{value}</span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
      {customInfoMessage && (
        <div className="custom-search-input-item-label pt-2">
          {customInfoMessage}
        </div>
      )}
    </ContainerElement>
  );
  // }
};

export const DropdownInput: React.FC<InputProps> = ({
  label,
  placeholder,
  options,
  value,
  isEditing,
  isImage,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  onChange,
  tableMode,
  isDisabled,
  customErrorCss,
  validation,
}) => {
  const [error, setError] = useState<string | null>(null);
  const ContainerElement = tableMode ? 'td' : 'div';
  // Replace any spaces in the label with underscores to create a valid id
  const drdownId = label?.replace(/\s+/g, '_') + '_' + v4();
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value);
    }
  }, []);

  const validateInput = (inputValue: string) => {
    if (validation) {
      if (validation?.required && !inputValue.trim()) {
        setError(validation?.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setError(null);
    const selectedOption = event.target.value.trim();
    if (validation?.required) {
      validateInput(selectedOption);
    }
    setSelected(selectedOption !== '');
    onChange(selectedOption);
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };
  const isFirstOptionGrey = value === '';
  return (
    <ContainerElement
      className={tableMode ? 'table-border-light align-content-center' : 'mb-3'}
    >
      {/* Create a label for the dropdown using the form-label class */}

      {!tableMode && (
        <label
          htmlFor={drdownId}
          className={`${
            !isEditing
              ? (customLabelCss ?? '')
              : `form-label ${customEditLabelCss ?? 'custom-label'}`
          } ${validation?.required ? 'required-field' : ''}`}
          aria-labelledby={label}
        >
          {label}
        </label>
      )}

      {/* Create a select element with the form-select class */}
      {isEditing ? (
        <select
          id={drdownId}
          data-testid={drdownId}
          className={`form-select custom-input custom-select ${
            customEditInputTextCss ?? 'custom-input-text'
          } ${selected ? 'custom-option' : ''} ${
            isFirstOptionGrey
              ? 'custom-disabled-option'
              : 'custom-primary-option'
          }  ${error && 'error'}`}
          value={value.toString().trim() ?? ''}
          onChange={handleSelectChange}
          aria-label={label}
          disabled={isDisabled}
        >
          <option
            value=""
            disabled
            hidden
            className={`custom-disabled-option  ${customPlaceholderCss ?? ''}`}
          >
            {placeholder}
          </option>
          {options?.map((option, index) => (
            <option
              key={index}
              value={option.key}
              className="custom-option custom-primary-option"
            >
              {option.value}
            </option>
          ))}
        </select>
      ) : isImage ? (
        <div className="d-flex align-items-center gap-2">
          <Avatar
            firstName={options
              ?.find((opt) => opt.key === value)
              ?.value.split(',')[0]
              .trim()}
            lastName={options
              ?.find((opt) => opt.key === value)
              ?.value.split(',')[1]
              .trim()}
            customImageCss="custom-form-image"
            customTextCss="custom-form-image-txt"
            aria-hidden="true"
            aria-label="User image"
          />
          <p
            aria-label={label}
            className={`m-0 p-0 ${customInputTextCss ?? ''}`}
          >
            {options?.find((opt) => opt.key === value)?.value}
          </p>
        </div>
      ) : (
        <span
          aria-label={label}
          className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
        >
          {options?.find((opt) => opt.key === value)?.value}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};

export const GroupInput: React.FC<InputProps> = ({
  label,
  children,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  isChildLabel,
  customErrorCss,
  onChange,
  isDisabled,
}) => {
  const [error, setError] = useState<string | null>(null);
  let currentConcatenatedValue;
  useEffect(() => {
    children?.forEach((child) => {
      if (child?.validation?.required && child?.validation?.onLoadValidation) {
        setError(null);
        validateInput(child?.value, child);
      }
    });
  }, []);

  if (!isEditing) {
    currentConcatenatedValue = children?.reduce((accumulator, currentValue) => {
      if (currentValue.value) {
        accumulator = accumulator + currentValue.value + currentValue.suffix;
      }
      return accumulator;
    }, '');
  }
  const validateInput = (inputValue: string, child: InputProps) => {
    if (child?.validation) {
      if (child?.validation && !child?.validation.pattern?.test(inputValue)) {
        setError(child?.validation?.customMessage || ' ');
        return false;
      }
      if (child?.validation?.required && !inputValue.trim()) {
        setError(child?.validation?.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    child: InputProps,
  ) => {
    const inputValue = e.target.value.trim();
    if (child?.validation?.required) {
      validateInput(inputValue, child);
    }
    if (child.allowNumbersOnly) {
      if (validateInput(inputValue, child)) {
        child.onChange(parseFloat(inputValue)); // Update parent component state only if validation passes
      }
    } else {
      child.onChange(inputValue);
    }
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };
  const groupId = label?.replace(/\s+/g, '_') + '_' + v4();
  return (
    <div>
      {' '}
      {/* Container for the group input */}
      {/* Label for the group input */}
      <label
        htmlFor={groupId}
        className={`${
          !isEditing
            ? (customLabelCss ?? '')
            : `form-label ${customEditLabelCss ?? 'custom-label'}`
        }`}
      >
        {label}
      </label>
      {/* Bootstrap row for the group of child fields */}
      <div className="row" id={groupId}>
        {isEditing ? (
          children?.map((child, index) => {
            const grpId = child?.label?.replace(/\s+/g, '_') + '_' + v4();

            if (child.type === FormFieldType.Checkbox) {
              return (
                <div key={index} className="col">
                  <CheckBoxInput
                    label={child.label}
                    isLabel
                    type={FormFieldType.Checkbox}
                    isChecked={child.value}
                    onChange={child.onChange}
                    wrapperClassName={'d-flex gap-2'}
                  />
                </div>
              );
            }
            return (
              <div key={index} className="col">
                {isChildLabel && (
                  <label
                    htmlFor={grpId}
                    className={`${!isEditing ? (customLabelCss ?? '') : `form-label ${customEditLabelCss ?? 'custom-label'}`} ${child?.validation?.required ? 'required-field' : ''}`}
                  >
                    {child.label}
                  </label>
                )}
                {/* Render each child field as an input element */}
                <input
                  id={grpId}
                  type={child.type}
                  className={`form-control custom-input  ${customPlaceholderCss ?? ''} ${
                    customEditInputTextCss ?? 'custom-input-text'
                  } ${error && 'error'}`}
                  placeholder={child.placeholder}
                  value={child.value ?? ''}
                  onChange={(e) => handleTextInputChange(e, child)}
                  aria-label={child.label} // Accessibility
                  disabled={isDisabled}
                />
              </div>
            );
          })
        ) : (
          <span
            aria-label={label}
            className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
          >
            {currentConcatenatedValue != undefined
              ? currentConcatenatedValue
              : ''}
          </span>
        )}
        {error && (
          <span
            aria-label="error-message"
            className={` ${customErrorCss ?? 'text-danger py-2 mx-1 small'}`}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export const DateRangeInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  tableMode,
  onChange,
  customErrorCss,
  validation,
  dateFormat,
}) => {
  const ContainerElement = tableMode ? 'td' : 'div';
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value);
    }
  }, []);

  let dateRangeValue;
  if (value.length > 0) {
    const [startDate, endDate] = value;
    const isStartDateValid =
      startDate instanceof Date && !isNaN(startDate.getTime());
    const isEndDateValid = endDate instanceof Date && !isNaN(endDate.getTime());
    if (isStartDateValid && isEndDateValid) {
      dateRangeValue = formatDateRange(value, dateFormat);
    } else {
      dateRangeValue = ''; // Set an empty string or fallback value if invalid
    }
  }

  const validateInput = (inputValue: any) => {
    if (validation) {
      if (validation.required && !inputValue) {
        setError(validation.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleDateRange = (value: any) => {
    if (validation?.required) {
      validateInput(value);
    }
    onChange(value);
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };

  // Replace any spaces in the label with underscores to create a valid id
  const dateRangeId = label?.replace(/\s+/g, '_') + '_' + v4();
  return (
    <ContainerElement
      className={tableMode ? 'table-border-light align-content-center' : 'mb-3'}
    >
      {!tableMode && (
        <label
          htmlFor={dateRangeId}
          className={`${
            !isEditing
              ? (customLabelCss ?? '')
              : `form-label ${customEditLabelCss ?? 'custom-label'}`
          }`}
        >
          {label}
        </label>
      )}
      {isEditing ? (
        <DateRangePicker
          id={dateRangeId}
          data-testid={dateRangeId}
          showOneCalendar
          ranges={[]}
          aria-label={label}
          className={` w-100  ${customPlaceholderCss ?? ''} ${customEditInputTextCss ?? 'custom-date-range'} ${error && 'rs-picker-error rs-picker-input-group'}`}
          placeholder={placeholder}
          format={dateFormat ?? 'MM/dd/yyyy'}
          character=" - "
          caretAs={CalendarIcon}
          value={value ?? []}
          onChange={(value) => handleDateRange(value)}
          editable={true}
          menuStyle={{ zIndex: 1500 }}
        />
      ) : (
        <span
          aria-label={label}
          className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
        >
          {dateRangeValue ?? ''}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};

export const DateInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  tableMode,
  onChange,
  isDisabled,
  customErrorCss,
  validation,
  dateFormat,
}) => {
  const [error, setError] = useState<string | null>(null);
  const ContainerElement = tableMode ? 'td' : 'div';
  let dateValue;

  if (value != null && value !== '') {
    value =
      tableMode
        ? value instanceof Date
          ? normalizeDate(value)
          : parseLocalDate(value)
        : (!tableMode && isEditing && value instanceof Date)
          ? normalizeDate(value)
          : value;
  }
  
  // Format for UI
  if (value) {
    dateValue = formatDate(value, dateFormat ?? 'MMM dd, yyyy');
  } 
  
  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };

  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value);
    }
  }, []);

  const validateInput = (inputValue: Date | null) => {
    if (validation) {
      if (validation.required && !inputValue) {
        setError(validation.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleDateChange = (newDate: Date | null) => {
    if (validation?.required) {
      validateInput(newDate);
    }
    // Check if the new value is a valid date
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      // Pass valid date to the parent onChange function
      onChange(newDate);
    } else {
      // Handle invalid date entry (Optional: error message, etc.)
      onChange(null); // Optionally set the value to null if invalid
    }
  };

  // Replace any spaces in the label with underscores to create a valid id
  const dateRangeId = label?.replace(/\s+/g, '_') + '_' + v4();
  return (
    <ContainerElement
      className={tableMode ? 'table-border-light align-content-center' : 'mb-3'}
    >
      {!tableMode && (
        <label
          htmlFor={dateRangeId}
          className={`${
            !isEditing
              ? (customLabelCss ?? '')
              : `form-label ${customEditLabelCss ?? 'custom-label'}`
          } ${validation?.required ? 'required-field' : ''}`}
        >
          {label}
        </label>
      )}

      {isEditing ? (
        <DatePicker
          id={dateRangeId}
          data-testid={dateRangeId}
          aria-label={label}
          className={` w-100  ${customPlaceholderCss ?? ''} ${customEditInputTextCss ?? 'custom-date-range'} 
              ${error && 'rs-picker-error rs-picker-input-group'}`}
          placeholder={placeholder}
          format={dateFormat ?? 'MMM dd, yyyy'}
          caretAs={CalendarIcon}
          value={value ?? null}
          onChange={handleDateChange}
          oneTap
          readOnly={isDisabled}
        />
      ) : (
        <span
          aria-label={label}
          className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
        >
          {dateValue ?? ''}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};

export const CheckBoxInput: React.FC<InputProps> = ({
  label,
  isLabel,
  isChecked,
  customLabelCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  isEditing,
  type,
  value,
  onChange,
  tableMode,
  stickyCol,
  srMode,
  wrapperClassName,
  isDisabled,
}) => {
  const ContainerElement = tableMode ? 'td' : 'div';
  const inputTxtId = label?.replace(/\s+/g, '_') + '_' + v4();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked); // Toggle the checked state and pass it to the parent component
  };

  wrapperClassName = wrapperClassName ?? 'd-inline form-check p-0';

  return (
    <ContainerElement
      className={`${tableMode ? 'table-border-light align-content-center ' : 'd-inline mb-3'} ${tableMode && stickyCol ? 'positionSticky' : ''} `}
    >
      <div className={wrapperClassName}>
        <input
          id={inputTxtId}
          data-testid={inputTxtId}
          type={type}
          className={`form-check-input  ${customPlaceholderCss ?? ''} ${!isDisabled ? 'custom-checkbox' : 'custom-checkbox-viewMode'} ${
            customEditInputTextCss ?? 'custom-input-text'
          }`}
          disabled={isDisabled}
          checked={isChecked}
          aria-label={label} // Accessibility
          onChange={handleCheckboxChange}
        />
        {isLabel && !tableMode && (
          <label
            htmlFor={inputTxtId}
            className={`${
              !isEditing
                ? (customLabelCss ?? '')
                : `px-1 form-label ${customEditLabelCss ?? 'custom-label'}`
            }`}
          >
            {label}
          </label>
        )}
      </div>
    </ContainerElement>
  );
};

export const TextAreaInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  onChange,
  tableMode,
  textAreaRow,
  textAreaColoum,
  validation,
  allowNumbersOnly,
  isDisabled,
  customErrorCss,
}) => {
  const textAreaId = label?.replace(/\s+/g, '_') + '_' + v4();
  const ContainerElement = tableMode ? 'td' : 'div';
  const cols = textAreaColoum ?? undefined;
  const rows = textAreaRow ?? undefined;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value);
    }
  }, []);

  const validateInput = (inputValue: string) => {
    if (validation) {
      if (validation?.pattern && !validation.pattern?.test(inputValue)) {
        setError(validation.customMessage || ' ');
        return false;
      }
      if (validation.required && !inputValue.trim()) {
        setError(validation.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (validation?.required) {
      validateInput(inputValue);
    }
    if (allowNumbersOnly) {
      if (validateInput(inputValue)) {
        onChange(inputValue); // Update parent component state only if validation passes
      }
    } else {
      onChange(inputValue);
    }
  };

  return (
    <ContainerElement
      className={tableMode ? 'table-border-light align-content-center' : 'mb-3'}
    >
      {!tableMode && (
        <>
          {!tableMode && (
            <label
              htmlFor={textAreaId}
              className={`${!isEditing ? (customLabelCss ?? '') : `form-label ${customEditLabelCss ?? 'custom-label'}`} ${validation?.required ? 'required-field' : ''}`}
            >
              {label}
            </label>
          )}
        </>
      )}
      {isEditing ? (
        <textarea
          id={textAreaId}
          data-testid={textAreaId}
          className={`form-control custom-textarea  ${customPlaceholderCss ?? ''} ${
            customEditInputTextCss ?? 'custom-input-text'
          } ${error && 'error'}`}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={handleTextAreaChange}
          aria-label={label}
          rows={rows}
          cols={cols}
          disabled={isDisabled}
        />
      ) : (
        <span
          aria-label={label}
          className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
        >
          {value}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};

export const DropdownSearchInput: React.FC<InputProps> = ({
  label,
  placeholder,
  options,
  value,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  stickyCol,
  onChange,
  handleSearch,
  tableMode,
  filteredOptions = [],
  isLoading,
  customInfoMessage,
  isDisabled,
  customErrorCss,
  validation,
}) => {
  const [error, setError] = useState<string | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const ContainerElement = tableMode ? 'td' : 'div';
  const drdownId = label?.replace(/\s+/g, '_') + '_' + v4();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOpts, setFilteredOpts] =
    useState<{ key: any; value: any }[]>(filteredOptions);
  const [isClear, setIsClear] = useState(false);

  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value);
    }
  }, []);

  const validateInput = (inputValue: string) => {
    if (validation) {
      if (validation?.required && !inputValue) {
        setError(validation?.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };
  const handleSelectChange = (selectedOption: any) => {
    setError(null);
    onChange(selectedOption);
    if (validation?.required) {
      validateInput(selectedOption);
    }
    setSearchTerm('');
    setFilteredOpts([]);
    //handler('');
  };

  const handler = handleSearch ?? ((e) => {});
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredOpts([]);
    const searchTerm = event.target.value;
    handler(searchTerm);
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    setFilteredOpts(filteredOptions);
    setIsClear(false);
  }, [filteredOptions]);

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredOpts([]);
    setIsClear(true);
    //handler('');
  };

  // Function to handle clicks outside the div element
  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current != null) {
      // Check if the clicked target is outside the div element
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    }
  };

  // Add and remove event listener for clicks on the document
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const modifiedLabelForSearch = `Search ${label}`;

  return (
    <ContainerElement
      className={`${tableMode ? 'table-border-light align-content-center' : 'mb-3'} ${tableMode && stickyCol ? 'position-sticky' : ''} `}
    >
      {!tableMode && (
        <label
          htmlFor={drdownId}
          className={`${
            !isEditing
              ? (customLabelCss ?? '')
              : `form-label ${customEditLabelCss ?? 'custom-label'}`
          } ${validation?.required ? 'required-field' : ''}`}
        >
          {label}
        </label>
      )}

      {isEditing ? (
        <Dropdown className="custom-dropdown-search">
          <Dropdown.Toggle
            disabled={isDisabled}
            id={drdownId}
            data-testid={drdownId}
            className={`form-control d-flex align-items-center justify-content-between 
                            custom-select custom-input custom-dropdown
                            ${customEditInputTextCss ?? 'custom-input-text'}
                            ${customPlaceholderCss ?? ''}`}
          >
            {value
              ? options?.find((opt) => opt.key === value)?.value
              : // ? value
                placeholder}
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu" ref={divRef}>
            <div className="mx-2">
              <SearchInput
                label={modifiedLabelForSearch}
                searchTerm={searchTerm}
                clearSearch={clearSearch}
                handleSearchChange={handleSearchChange}
              />
            </div>
            {filteredOpts && filteredOpts.length > 0 && <Dropdown.Divider />}
            <div
              className={`${filteredOptions.length === 0 && searchTerm !== '' ? 'custom-min-height' : ''} custom-dropdown-search-menu`}
            >
              {isLoading === RequestStatus.loading ? (
                filteredOptions.length === 0 &&
                searchTerm !== '' && (
                  <div className="custom-loading-overlay">
                    <div className="text-center">
                      <SpinnerIcon
                        data-testid="loading-spinner"
                        className="custom-fa-spin"
                      />
                    </div>
                  </div>
                )
              ) : filteredOpts?.length > 0 ? (
                filteredOpts?.map((option, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleSelectChange(option)}
                      disabled={isDisabled}
                    >
                      {option.value}
                    </Dropdown.Item>
                  );
                })
              ) : (
                <div className="py-2">{!isClear && customInfoMessage}</div>
              )}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <span
          aria-label={label}
          className={`d-flex pt-1 ${customInputTextCss ?? ''}`}
        >
          {options?.find((opt) => opt.key === value)?.value}
        </span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger  py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};

export const SearchCustomInput: React.FC<InputProps> = ({
  label,
  placeholder,
  options,
  value,
  type,
  validation,
  allowNumbersOnly,
  isEditing,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  customPlaceholderCss,
  customLeftIconCss,
  customRightIconCss,
  customErrorCss,
  customInfoMessage,
  customMenuMessage,
  searchCustomInputContainerCss,
  searchCustomInputMenuCss,
  stickyCol,
  isLoading,
  onChange,
  tableMode,
  isDisabled,
  isSearchCustomInputIcon = true,
}) => {
  const ContainerElement = tableMode ? 'td' : 'div';
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasinfoMsg, setHasInfoMsg] = useState<React.ReactNode | null>(null);
  const [menuPositionStyle, setMenuPositionStyle] = useState<CSSProperties>({
    top: '0px',
    left: '0px',
  });
  useEffect(() => {
    if (React.isValidElement(customInfoMessage)) {
      const elementProps = (customInfoMessage as React.ReactElement).props;
      if (Object.keys(elementProps).length > 0) {
        setHasInfoMsg(customInfoMessage);
      }
    } else {
      setHasInfoMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (validation?.required && validation?.onLoadValidation) {
      setError(null);
      validateInput(value.trim());
    }
  }, []);

  const validateInput = (inputValue: any) => {
    if (validation) {
      if (inputValue === null || inputValue === undefined) {
        setError(validation.customMessage || ' ');
        return false;
      }
      if (validation.pattern && !validation.pattern.test(inputValue)) {
        setError(validation.customMessage || ' ');
        return false;
      }
      if (!inputValue.trim()) {
        setError(validation?.customMessage || ' ');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextInputChange = (value: any) => {
    setHasInfoMsg(null);
    const inputValue = value;
    let isValid = true;
    if (validation?.required) {
      isValid = validateInput(inputValue);
    }
    if (allowNumbersOnly) {
      if (validateInput(inputValue)) {
        if (inputValue.trim().toString() === '') {
          setHasInfoMsg(customInfoMessage);
          setIsOpen(false);
        } else {
          setHasInfoMsg(null);
          setIsOpen(true);
        }
        onChange(inputValue); // Update parent component state only if validation passes
      } else {
        setHasInfoMsg(customInfoMessage);
        setIsOpen(false);
      }
    } else {
      setHasInfoMsg(null);
      setIsOpen(isValid);
      onChange(inputValue);
    }
  };

  const handleSelectInputChange = (selectedValue: any) => {
    setHasInfoMsg(customInfoMessage);
    const { value } = selectedValue;
    handleTextInputChange(value.trim());
  };

  const closeSearch = useCallback(() => {
    setHasInfoMsg(null);
    onChange('');
  }, [handleTextInputChange]);

  const adjustMenuPosition = () => {
    if (inputRef.current && divRef.current) {
      const rect = inputRef.current.getBoundingClientRect(); // Get the position of the input
      const menuHeight = divRef.current.offsetHeight; // Height of the dropdown menu
      const menuWidth = divRef.current.offsetWidth; // Width of the dropdown menu
      const windowHeight = window.innerHeight; // Height of the window
      const windowWidth = window.innerWidth; // Width of the window
      const windowScrollTop = window.scrollY; // Scroll position (for handling scrolling)

      // Calculate available space
      const spaceBelow = windowHeight - rect.bottom; // Space available below the input
      const spaceAbove = rect.top; // Space available above the input

      // Position for the dropdown (it will initially open below the input)
      let menuTop = rect.bottom + windowScrollTop; // Position the menu below the input
      let menuLeft = rect.left + window.scrollX; // Align the left side of the dropdown with the input

      // If there's not enough space below the input, position the menu above
      if (spaceBelow < menuHeight && spaceAbove >= menuHeight) {
        menuTop = rect.top + windowScrollTop - menuHeight; // Position the menu above
      }

      // If there's insufficient space on the left or right, adjust left position
      if (rect.left + menuWidth > windowWidth) {
        menuLeft = windowWidth - menuWidth; // Align to the right side of the screen
      }

      // Dynamically apply 'top' or 'bottom' positioning depending on the available space
      let positionStyle: CSSProperties = {
        top: `${menuTop}px`,
        left: `${menuLeft}px`,
        width: `${rect.width}px`, // Ensure the menu width matches the input field's width
      };

      setMenuPositionStyle(positionStyle); // Update the state with the new position
    }
  };

  // Handle window resize
  const handleWindowResize = useCallback(() => {
    if (isOpen) {
      adjustMenuPosition(); // Recalculate position on window resize
    }
  }, [isOpen]);

  // Add event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  // Function to handle clicks outside the div element
  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current != null) {
      // Check if the clicked target is outside the div element
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setHasInfoMsg(null);
        setIsOpen(false); // Close the div
      }
    }
  };

  // Add and remove event listener for clicks on the document
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      adjustMenuPosition();
    }
  }, [options]);

  const inputTxtId = label?.replace(/\s+/g, '_') + '_' + v4();
  return (
    <ContainerElement
      className={`${tableMode ? 'table-border-light align-content-center ' : 'mb-3'} ${tableMode && stickyCol ? 'positionSticky' : ''} `}
    >
      {!tableMode && (
        <label
          htmlFor={inputTxtId}
          className={`${
            !isEditing
              ? (customLabelCss ?? '')
              : `form-label ${customEditLabelCss ?? 'custom-label'}`
          } ${validation?.required ? 'required-field' : ''}`}
        >
          {label}
        </label>
      )}
      {isEditing ? (
        <div
          className={`d-flex align-items-center justify-content-center w-100 ${searchCustomInputContainerCss ?? ''}`}
        >
          <input
            ref={inputRef}
            type={type}
            id={inputTxtId}
            className={`form-control custom-input ${customPlaceholderCss ?? ''} ${
              customEditInputTextCss ?? 'custom-input-text'
            }  ${error && 'error'}`}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(event) => {
              handleTextInputChange(event.target.value);
            }}
            aria-label={label} // Accessibility
            required={error ? true : false}
            disabled={isDisabled}
          />
          {isSearchCustomInputIcon && (
            <div
              className={
                'd-flex align-items-center justify-content-center position-relative custom-search-box-container '
              }
            >
              {value.length <= 0 ? (
                <span
                  id="right-icon"
                  data-testid="right-icon"
                  className={`${customRightIconCss ?? 'custom-search-icon-position custom-search-icon position-absolute px-2'}`}
                >
                  <MagnifyingGlassIcon />
                </span>
              ) : (
                <span
                  data-testid="left-icon"
                  id="left-icon"
                  className={`${customLeftIconCss ?? 'custom-clear-icon-position custom-search-icon position-absolute px-2'}`}
                  onClick={closeSearch}
                >
                  <CircleXMarkIcon />
                </span>
              )}
            </div>
          )}

          {/* Dropdown menu */}
          {options && options?.length >= 0 && isOpen && (
            <div
              id="menu"
              className={`custom-search-input-menu  ${
                menuPosition === 'bottom'
                  ? 'custom-search-input-menu-bottom'
                  : 'custom-search-input-menu-top'
              } ${searchCustomInputMenuCss ?? ''}`}
              style={menuPositionStyle}
              role="menu"
              aria-labelledby="search-input-dropdown"
              ref={divRef}
            >
              {/* Language options */}
              {options && options.length > 0 && (
                <>
                  <div role="none">
                    {/* Default option */}
                    <div
                      id="menu-item"
                      className="custom-search-input-item-first-child w-100"
                      role="menuitem"
                      aria-disabled="true"
                      tabIndex={-1} // Prevent tab focus on disabled items
                    >
                      <div className="custom-search-input-item-label pb-1">
                        {customMenuMessage && customMenuMessage}
                        {customInfoMessage && customInfoMessage}
                      </div>
                    </div>
                  </div>
                  <hr className="m-0 custom-horizontal-line" />
                </>
              )}
              {isLoading === RequestStatus.loading && isOpen ? (
                <div className="custom-loading-overlay">
                  <div className="text-center">
                    <SpinnerIcon
                      data-testid="loading-spinner"
                      className="custom-fa-spin"
                    />
                  </div>
                </div>
              ) : options && options.length > 0 ? (
                options.map((item) => (
                  <div
                    id="menu-item"
                    className="custom-search-input-item d-flex align-items-center w-100"
                    role="menuitem"
                    aria-label={item.value}
                    tabIndex={0} // Allow keyboard focus
                    key={item.key}
                    onClick={() => {
                      handleSelectInputChange(item);
                    }}
                  >
                    <span>{item.value}</span>
                  </div>
                ))
              ) : (
                customInfoMessage && (
                  <div className="p-2">{customInfoMessage}</div>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <span className={`d-flex ${customInputTextCss ?? ''}`}>{value}</span>
      )}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
      {hasinfoMsg !== null && !isOpen && hasinfoMsg}
    </ContainerElement>
  );
};

export const SwitchInput: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  validation,
  isEditing,
  isDisabled,
  customLabelCss,
  customInputTextCss,
  customEditInputTextCss,
  customEditLabelCss,
  customErrorCss,
  stickyCol,
  tableMode,
  labelPosition,
}) => {
  const ContainerElement = tableMode ? 'td' : 'div';
  const [error, setError] = useState<string | null>(null);

  // Validate input on initial render (could be extended based on requirements)
  useEffect(() => {
    if (validation && validation?.required) {
      setError(validation.customMessage || '');
    } else {
      setError(null);
    }
  }, [validation]);

  const handleChange = (checked: boolean) => {
    if (validation?.required) {
      setError(validation?.customMessage || '');
    } else {
      setError(null);
    }
    onChange(checked);
  };
  const inputTxtId = label?.replace(/\s+/g, '_') + '_' + v4();
  const lbl = (
    <label
      htmlFor={label}
      className={`${!isEditing ? customLabelCss : `${customEditLabelCss}`} ${
        validation?.required === false ? 'required-field' : ''
      }`}
    >
      {label}
    </label>
  );

  return (
    <ContainerElement
      className={`${
        tableMode ? 'table-border-light align-content-center ' : 'mb-3'
      } ${tableMode && stickyCol ? 'positionSticky' : ''}`}
    >
      {/* Switch Input */}
      {isEditing ? (
        <div className={`d-inline-block ${customInputTextCss}`}>
          <ReactAriaSwitch
            className={`${customEditInputTextCss ?? 'custom-switch'}`}
            isSelected={value}
            onChange={handleChange}
            isDisabled={isDisabled}
          >
            {labelPosition === 'left' && <>{lbl}</>}
            <div className="indicator" />
            {labelPosition === 'right' && <>{lbl}</>}
          </ReactAriaSwitch>
        </div>
      ) : (
        <div>
          <label
            htmlFor={label}
            className={`${!isEditing ? customLabelCss : `${customEditLabelCss}`} ${
              validation?.required === false ? 'required-field' : ''
            }`}
          >
            {label}
          </label>
          <span className={`d-flex pt-1 ${customInputTextCss ?? ''}`}>
            {value ? <FaCheck /> : <FaXmark />}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span
          aria-label="error-message"
          className={` ${customErrorCss ?? 'text-danger py-2 mx-1 small'}`}
        >
          {error}
        </span>
      )}
    </ContainerElement>
  );
};
