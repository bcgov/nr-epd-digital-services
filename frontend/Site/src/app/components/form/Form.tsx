import React, { useState } from "react";
import { DateRangePicker } from 'rsuite';
import './Form.css';
import { CalendarIcon, DropdownIcon, XmarkIcon } from '../common/icon';
import 'rsuite/DateRangePicker/styles/index.css';
import { FormFieldType, IFormField } from "./IForm";
import { formatDateRange } from "../../helpers/dateFormat";
import avatar from '../../images/avatar.png';

interface IFormRendererProps {
    formRows: IFormField[][]; // Define the type of formRows according to your application
    formData: { [key: string]: any | [Date, Date] };
    editMode?: boolean;
    handleInputChange:  (graphQLPropertyName: any, value: string | [Date, Date]) => void;
}

interface InputProps extends IFormField {
    children?: InputProps[];
    isEditing?: boolean;
    onChange: (value: any) => void;
}

const TextInput: React.FC<InputProps> =  ({label, placeholder, type, value, validation, allowNumbersOnly, isEditing, customLabelCss, customInputTextCss, customEditLabelCss, customEditInputTextCss, onChange})=> {

    const [error, setError] = useState<string | null>(null);

    const validateInput = (inputValue: string) => {
        if(validation)
        {
            if(validation.pattern && !validation.pattern.test(inputValue))
            {
                setError(validation.customMessage || 'Invalid input');
                return false;
            }
        }

        setError(null);
        return true;
    }

    const handleTextInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if(allowNumbersOnly)
        {
                if(validateInput(inputValue))
                {
                    onChange(inputValue); // Update parent component state only if validation passes
                }
        }
        else
        {
            onChange(inputValue); 
        }
    }

    // Replace any spaces in the label with underscores to create a valid id
    const inputTxtId = label.replace(/\s+/g, '_');
    return (
        <div className="mb-3">
            <label htmlFor={inputTxtId} className={`${!isEditing ? customLabelCss ?? '' : `form-label ${ customEditLabelCss ?? 'custom-label'}`}`}>
                {label}
            </label>
           {  isEditing ? 
                <input
                    type={type}
                    id={inputTxtId}
                    className={`form-control custom-input ${ customEditInputTextCss ?? 'custom-input-text'}  ${error && 'error'}`}
                    placeholder={placeholder}
                    value={value ?? ''}
                    onChange={handleTextInputChange}
                    aria-label={label} // Accessibility
                    required = {error ? true : false}
                />
                :
                <p className={`${customInputTextCss ?? ''}`}>{value}</p>
            }
            {error && <div className="text-danger p-1 small">{error}</div>}
        </div>
    );
}

const Dropdown: React.FC<InputProps> = ({ label, placeholder, options, value, isEditing, isImage, customLabelCss, customInputTextCss, customEditLabelCss, customEditInputTextCss, onChange }) => {

    // Replace any spaces in the label with underscores to create a valid id
    const drdownId = label.replace(/\s+/g, '_');
    const [selected, setSelected] = useState<boolean>(false);
    const imgUrl = avatar;

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value.trim();
        setSelected(selectedOption !== '');
        onChange(selectedOption);
    };

    const isFirstOptionGrey = value === '';
    return(
        <div className="mb-3">
            {/* Create a label for the dropdown using the form-label class */}
            <label htmlFor={drdownId} className={`${!isEditing ? customLabelCss ?? '' :  `form-label ${ customEditLabelCss ?? 'custom-label'}`}`}>
                {label}
            </label>

            {/* Create a select element with the form-select class */}
            { isEditing ?
                <select
                    id={drdownId}
                    className={`form-select custom-input custom-select ${ customEditInputTextCss ?? 'custom-input-text'} ${selected ? 'custom-option' : ''} ${isFirstOptionGrey? 'custom-disabled-option' : 'custom-primary-option'}`}
                    value={value.trim() ?? ''}
                    onChange={handleSelectChange}
                    aria-label={label}
                    placeholder={placeholder}
                >
                    <option value="" className="custom-disabled-option">{placeholder}</option>
                    {options?.map((option, index) => (
                        <option key={index} value={option.key} className="custom-option custom-primary-option">
                            {option.value}
                        </option>
                    ))}
                </select>
                :
                isImage ?
                <div className="d-flex align-items-center gap-2">
                    <img src={options?.find(opt => opt.key === value)?.imageUrl ?? imgUrl} alt="User image." className="custom-form-image"  aria-hidden="true" role="img" aria-label="User image"/>
                    <p className={`m-0 ${customInputTextCss ?? ''}`}>{options?.find(opt => opt.key === value)?.value}</p>
                </div>
                :
                    <p className={`${customInputTextCss ?? ''}`}>{options?.find(opt => opt.key === value)?.value}</p>
            }
        </div>
    );
}

const GroupInput: React.FC<InputProps> = ({label, children, isEditing, customLabelCss, customInputTextCss, customEditLabelCss, customEditInputTextCss,}) =>{
    const [error, setError] = useState<string | null>(null);
    let currentConcatenatedValue;

    if(!isEditing)
    {
        currentConcatenatedValue = children?.reduce((accumulator, currentValue, index) => {
            if(currentValue.value)
            {
                accumulator = accumulator +  currentValue.value + currentValue.suffix;
            }
            return accumulator;
        }, '');
    }
    const validateInput = (inputValue: string, validation?: RegExp, customMessage?: string) => {
        if(validation)
        {
            if(validation && !validation.test(inputValue))
            {
                setError(customMessage || 'Invalid input');
                return false;
            }
        }

        setError(null);
        return true;
    }

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

    return(
        <div className="mb-3"> {/* Container for the group input */}
            {/* Label for the group input */}
            <label className={`${!isEditing ? customLabelCss ?? '' :  `form-label ${ customEditLabelCss ?? 'custom-label'}`}`}>{label}</label>
            
            {/* Bootstrap row for the group of child fields */}
            <div className="row">
                { isEditing ? 
                    children?.map((child, index) => (
                        <div key={index} className="col">
                            {/* Render each child field as an input element */}
                                <input
                                type={child.type}
                                className={`form-control custom-input ${ customEditInputTextCss ?? 'custom-input-text'} ${error && 'error'}`}
                                placeholder={child.placeholder}
                                value={child.value ?? ''}
                                onChange={(e) => handleTextInputChange(e, child)}
                                aria-label={child.label} // Accessibility
                                />
                            
                        </div>
                    ))
                :
                <span className={`${customInputTextCss ?? ''}`}>{currentConcatenatedValue != undefined ? currentConcatenatedValue : ''}</span>
                }
                {error && <div className="text-danger p-1 mx-2 small">{error}</div>}
            </div>
        </div>
    );
}

const DateInput: React.FC<InputProps> = ({ label, placeholder, value, isEditing, customLabelCss, customInputTextCss, customEditLabelCss, customEditInputTextCss, onChange }) => {
    let dateRangeValue;
    if(value.length > 0)
    {
        dateRangeValue = formatDateRange(value);
    }
    
    // Replace any spaces in the label with underscores to create a valid id
    const dateRangeId = label.replace(/\s+/g, '_');
    return (
    <div className="mb-3">
        <label htmlFor={dateRangeId} className={`${!isEditing ? customLabelCss ?? '' :  `form-label ${ customEditLabelCss ?? 'custom-label'}`}`}>{label}</label>
        { isEditing ? 
            <DateRangePicker 
            id={dateRangeId}
            showOneCalendar
            ranges={[]}
            aria-label={label}
            className="custom-date-range"
            placeholder={placeholder}
            format="MM/dd/yy" character=' - '
            caretAs={CalendarIcon}
            value={value ?? []}
            onChange={(value) => onChange(value)}
            />
            :
            <p className={`${customInputTextCss ?? ''}`}>{dateRangeValue ?? ''}</p>
        }
        
    </div>
)};

const Form: React.FC<IFormRendererProps>  = ({ formRows, formData, editMode, handleInputChange }) => {
    return(<>
     {formRows.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((field, colIndex) => (
                        <div key={colIndex} className={field.colSize}>
                            {field.type === FormFieldType.Text && (
                                <TextInput
                                    label={field.label}
                                    customLabelCss = {field.customLabelCss}
                                    customInputTextCss={field.customInputTextCss}
                                    customEditLabelCss = {field.customEditLabelCss}
                                    customEditInputTextCss={field.customEditInputTextCss}
                                    placeholder={field.placeholder}
                                    value={formData[field.graphQLPropertyName ?? ''] || ''}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    validation={field.validation}
                                    allowNumbersOnly={field.allowNumbersOnly}
                                    isEditing={editMode ?? true}
                                    
                                />
                            )}
                            {field.type === FormFieldType.DropDown && (
                                <Dropdown
                                    label={field.label}
                                    customLabelCss = {field.customLabelCss}
                                    customInputTextCss={field.customInputTextCss}
                                    customEditLabelCss = {field.customEditLabelCss}
                                    customEditInputTextCss={field.customEditInputTextCss}
                                    placeholder={field.placeholder}
                                    options={field.options || []}
                                    value={formData[field.graphQLPropertyName ?? ''] || ''}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    isEditing={editMode ?? true}
                                    isImage = {field.isImage}
                                />
                            )}
                            {field.type === FormFieldType.Date && (
                                <DateInput
                                    label={field.label}
                                    customLabelCss = {field.customLabelCss}
                                    customInputTextCss={field.customInputTextCss}
                                    customEditLabelCss = {field.customEditLabelCss}
                                    customEditInputTextCss={field.customEditInputTextCss}
                                    placeholder={field.placeholder}
                                    value={formData[field.graphQLPropertyName ?? ''] || []}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    isEditing={editMode ?? true}
                                />
                            )}
                            {field.type === FormFieldType.Group && (
                                <GroupInput
                                    label={field.label}
                                    children={field.children?.map((child) => ({
                                        validation : child.validation,
                                        allowNumbersOnly: child.allowNumbersOnly,
                                        type: child.type,
                                        label: child.label,
                                        placeholder: child.placeholder,
                                        value: formData[child.graphQLPropertyName ?? ''] || '',
                                        suffix: child.suffix,
                                        onChange: (value:any) =>
                                            handleInputChange(child.graphQLPropertyName, value),
                                    }))}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    value={formData[field.label] || ''}
                                    isEditing={editMode ?? true}
                                    customLabelCss = {field.customLabelCss}
                                    customInputTextCss={field.customInputTextCss}
                                    customEditLabelCss = {field.customEditLabelCss}
                                    customEditInputTextCss={field.customEditInputTextCss}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}

    </>);
}


export default Form;