import { useState } from "react";
import { FormFieldType, IFormField } from "./IFormField";
import avatar from "../../images/avatar.png";
import { formatDateRange } from "../../helpers/utility";
import { DateRangePicker } from "rsuite";
import { CalendarIcon } from "../common/icon";
import { Link as RouterLink } from "react-router-dom";

interface InputProps extends IFormField {
  children?: InputProps[];
  isEditing?: boolean;
  srMode?: boolean;
  onChange: (value: any) => void;
}

export const Link: React.FC<InputProps> = ({
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
  return (
    <td className="table-border-light content-text">
      <RouterLink
        to={href + value}
        className={`${customInputTextCss ?? ""}`}
        aria-label={`${label + " " + value}`}
      >
        View
      </RouterLink>
    </td>
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
  onChange,
  tableMode,
}) => {
  return (
    <td className="table-border-light content-text">
      <p className={`${customInputTextCss ?? ""}`}>{value}</p>
    </td>
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
  srMode,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  onChange,
  tableMode,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateInput = (inputValue: string) => {
    if (validation) {
      if (validation.pattern && !validation.pattern.test(inputValue)) {
        setError(validation.customMessage || "Invalid input");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (allowNumbersOnly) {
      if (validateInput(inputValue)) {
        onChange(inputValue); // Update parent component state only if validation passes
      }
    } else {
      onChange(inputValue);
    }
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };

  // Replace any spaces in the label with underscores to create a valid id
  const inputTxtId = label.replace(/\s+/g, "_");

  console.log("tableMode", tableMode);
  if (tableMode) {
    return (
      <td className="table-border-light content-text">
        {isEditing ? (
          <input
            type={type}
            id={inputTxtId}
            className={`form-control custom-input ${
              customEditInputTextCss ?? "custom-input-text"
            }  ${error && "error"}`}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleTextInputChange}
            aria-label={label} // Accessibility
            required={error ? true : false}
          />
        ) : (
          <p className={`${customInputTextCss ?? ""}`}>{value}</p>
        )}
        {error && <div className="text-danger p-1 small">{error}</div>}
      </td>
    );
  } else {
    return (
      <div className="mb-3">
        {!tableMode && (
          <>
            {srMode && (
              <CheckBoxInput
                type={FormFieldType.Checkbox}
                label={inputTxtId}
                isLabel={false}
                onChange={handleCheckBoxChange}
              />
            )}
            <label
              htmlFor={inputTxtId}
              className={`${
                !isEditing
                  ? customLabelCss ?? ""
                  : `form-label ${customEditLabelCss ?? "custom-label"}`
              }`}
            >
              {label}
            </label>
          </>
        )}
        {isEditing ? (
          <input
            type={type}
            id={inputTxtId}
            className={`form-control custom-input ${
              customEditInputTextCss ?? "custom-input-text"
            }  ${error && "error"}`}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleTextInputChange}
            aria-label={label} // Accessibility
            required={error ? true : false}
          />
        ) : (
          <p className={`${customInputTextCss ?? ""}`}>{value}</p>
        )}
        {error && <div className="text-danger p-1 small">{error}</div>}
      </div>
    );
  }
};

export const Dropdown: React.FC<InputProps> = ({
  label,
  placeholder,
  options,
  value,
  isEditing,
  srMode,
  isImage,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  onChange,
  tableMode,
}) => {
  // Replace any spaces in the label with underscores to create a valid id
  const drdownId = label.replace(/\s+/g, "_");
  const [selected, setSelected] = useState<boolean>(false);
  const imgUrl = avatar;

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value.trim();
    setSelected(selectedOption !== "");
    onChange(selectedOption);
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };

  const isFirstOptionGrey = value === "";
  if (tableMode) {
    return (
        <td className="table-border-light content-text">          
  
          {/* Create a select element with the form-select class */}
          {isEditing ? (
            <select
              id={drdownId}
              className={`form-select custom-input custom-select ${
                customEditInputTextCss ?? "custom-input-text"
              } ${selected ? "custom-option" : ""} ${
                isFirstOptionGrey
                  ? "custom-disabled-option"
                  : "custom-primary-option"
              }`}
              value={value.trim() ?? ""}
              onChange={handleSelectChange}
              aria-label={label}
              placeholder={placeholder}
            >
              <option value="" className="custom-disabled-option">
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
          ) : (
            <p className={`${customInputTextCss ?? ""}`}>
              {options?.find((opt) => opt.key === value)?.value}
            </p>
          )}
        </td>
      );

  } else {
    return (
      <div className="mb-3">
        {srMode && (
          <CheckBoxInput
            type={FormFieldType.Checkbox}
            label={drdownId}
            isLabel={false}
            onChange={handleCheckBoxChange}
          />
        )}
        {/* Create a label for the dropdown using the form-label class */}

        <label
          htmlFor={drdownId}
          className={`${
            !isEditing
              ? customLabelCss ?? ""
              : `form-label ${customEditLabelCss ?? "custom-label"}`
          }`}
        >
          {label}
        </label>

        {/* Create a select element with the form-select class */}
        {isEditing ? (
          <select
            id={drdownId}
            className={`form-select custom-input custom-select ${
              customEditInputTextCss ?? "custom-input-text"
            } ${selected ? "custom-option" : ""} ${
              isFirstOptionGrey
                ? "custom-disabled-option"
                : "custom-primary-option"
            }`}
            value={value.trim() ?? ""}
            onChange={handleSelectChange}
            aria-label={label}
            placeholder={placeholder}
          >
            <option value="" className="custom-disabled-option">
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
            <img
              src={
                options?.find((opt) => opt.key === value)?.imageUrl ?? imgUrl
              }
              alt="User image."
              className="custom-form-image"
              aria-hidden="true"
              role="img"
              aria-label="User image"
            />
            <p className={`m-0 ${customInputTextCss ?? ""}`}>
              {options?.find((opt) => opt.key === value)?.value}
            </p>
          </div>
        ) : (
          <p className={`${customInputTextCss ?? ""}`}>
            {options?.find((opt) => opt.key === value)?.value}
          </p>
        )}
      </div>
    );
  }
};

export const GroupInput: React.FC<InputProps> = ({
  label,
  children,
  isEditing,
  srMode,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  onChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  let currentConcatenatedValue;

  if (!isEditing) {
    currentConcatenatedValue = children?.reduce(
      (accumulator, currentValue, index) => {
        if (currentValue.value) {
          accumulator = accumulator + currentValue.value + currentValue.suffix;
        }
        return accumulator;
      },
      ""
    );
  }
  const validateInput = (
    inputValue: string,
    validation?: RegExp,
    customMessage?: string
  ) => {
    if (validation) {
      if (validation && !validation.test(inputValue)) {
        setError(customMessage || "Invalid input");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    child: InputProps
  ) => {
    const inputValue = e.target.value.trim();
    if (child.allowNumbersOnly) {
      if (
        validateInput(
          inputValue,
          child.validation?.pattern,
          child.validation?.customMessage
        )
      ) {
        child.onChange(inputValue); // Update parent component state only if validation passes
      }
    } else {
      child.onChange(inputValue);
    }
  };

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };

  return (
    <div className="mb-3">
      {" "}
      {/* Container for the group input */}
      {srMode && (
        <CheckBoxInput
          type={FormFieldType.Checkbox}
          label={""}
          isLabel={false}
          onChange={handleCheckBoxChange}
        />
      )}
      {/* Label for the group input */}
      <label
        className={`${
          !isEditing
            ? customLabelCss ?? ""
            : `form-label ${customEditLabelCss ?? "custom-label"}`
        }`}
      >
        {label}
      </label>
      {/* Bootstrap row for the group of child fields */}
      <div className="row">
        {isEditing ? (
          children?.map((child, index) => (
            <div key={index} className="col">
              {/* Render each child field as an input element */}
              <input
                type={child.type}
                className={`form-control custom-input ${
                  customEditInputTextCss ?? "custom-input-text"
                } ${error && "error"}`}
                placeholder={child.placeholder}
                value={child.value ?? ""}
                onChange={(e) => handleTextInputChange(e, child)}
                aria-label={child.label} // Accessibility
              />
            </div>
          ))
        ) : (
          <span className={`${customInputTextCss ?? ""}`}>
            {currentConcatenatedValue != undefined
              ? currentConcatenatedValue
              : ""}
          </span>
        )}
        {error && <div className="text-danger p-1 mx-2 small">{error}</div>}
      </div>
    </div>
  );
};

export const DateInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  isEditing,
  srMode,
  customLabelCss,
  customInputTextCss,
  customEditLabelCss,
  customEditInputTextCss,
  onChange,
}) => {
  let dateRangeValue;
  if (value.length > 0) {
    dateRangeValue = formatDateRange(value);
  }

  const handleCheckBoxChange = (isChecked: boolean) => {
    onChange(isChecked);
  };
  // Replace any spaces in the label with underscores to create a valid id
  const dateRangeId = label.replace(/\s+/g, "_");
  return (
    <div className="mb-3">
      {srMode && (
        <CheckBoxInput
          type={FormFieldType.Checkbox}
          label={dateRangeId}
          isLabel={false}
          onChange={handleCheckBoxChange}
        />
      )}
      <label
        htmlFor={dateRangeId}
        className={`${
          !isEditing
            ? customLabelCss ?? ""
            : `form-label ${customEditLabelCss ?? "custom-label"}`
        }`}
      >
        {label}
      </label>
      {isEditing ? (
        <DateRangePicker
          id={dateRangeId}
          showOneCalendar
          ranges={[]}
          aria-label={label}
          className="custom-date-range"
          placeholder={placeholder}
          format="MM/dd/yy"
          character=" - "
          caretAs={CalendarIcon}
          value={value ?? []}
          onChange={(value) => onChange(value)}
        />
      ) : (
        <p className={`${customInputTextCss ?? ""}`}>{dateRangeValue ?? ""}</p>
      )}
    </div>
  );
};

export const CheckBoxInput: React.FC<InputProps> = ({
  label,
  isLabel,
  isChecked,
  customLabelCss,
  customEditLabelCss,
  customEditInputTextCss,
  isEditing,
  type,
  value,
  onChange,
  tableMode
}) => {
  const inputTxtId = label.replace(/\s+/g, "_");
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked); // Toggle the checked state and pass it to the parent component
  };

  if(tableMode)
    {
        return (
            <td className="table-border-light content-text">
            <div className="">
                <input
                id={inputTxtId}
                type={type}
                className={`form-check-input custom-checkbox ${
                    customEditInputTextCss ?? "custom-input-text"
                }`}
                checked={isChecked}
                aria-label={label} // Accessibility
                onChange={handleCheckboxChange}
                disabled={!isEditing}
                />
                {isLabel && (
                <label
                    htmlFor={inputTxtId}
                    className={`${
                    !isEditing
                        ? customLabelCss ?? ""
                        : `px-1 form-label ${customEditLabelCss ?? "custom-label"}`
                    }`}
                >
                    {label}
                </label>
                )}
            </div>
            </td>
        );
    }
    else
    {
        return (
            <div className="d-inline mb-3">
            <div className="d-inline form-check p-0">
                <input
                id={inputTxtId}
                type={type}
                className={`form-check-input custom-checkbox ${
                    customEditInputTextCss ?? "custom-input-text"
                }`}
                checked={isChecked}
                aria-label={label} // Accessibility
                onChange={handleCheckboxChange}
                />
                {isLabel && (
                <label
                    htmlFor={inputTxtId}
                    className={`${
                    !isEditing
                        ? customLabelCss ?? ""
                        : `px-1 form-label ${customEditLabelCss ?? "custom-label"}`
                    }`}
                >
                    {label}
                </label>
                )}
            </div>
            </div>
        );
    }
};
