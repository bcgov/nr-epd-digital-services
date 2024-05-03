import React, { useEffect, useState } from "react"
import { DateRangePicker } from 'rsuite';
import { format } from 'date-fns';
import { formRows, FormField } from '../dto/SiteFilterConfig';
import './SiteFilterForm.css';
import { CalendarIcon, DropdownIcon, XmarkIcon } from "../../../components/common/icon";
import 'rsuite/DateRangePicker/styles/index.css';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Store";
import { fetchSites } from "../dto/SiteSlice";


interface InputProps extends FormField {
    // graphQLPropertyName?: string,
    children?: InputProps[];
    onChange: (value: any) => void;
}

interface childProps {
    cancelSearchFilter : () => void
}

const TextInput: React.FC<InputProps> =  ({label, placeholder, type, value, validation, onChange})=> {

    // const [error, setError] = useState<string | null>(null);
    // const [inputValue, setInputValue] = useState<string>(value); // Maintain local state for input value

    // const validateInput = (inputValue: string) => {
    //     if(validation)
    //     {
    //         if(validation.pattern && !validation.pattern.test(inputValue))
    //         {
    //             setError(validation.customMessage || 'Invalid input');
    //             return false;
    //         }
    //     }

    //     setError(null);
    //     return true;
    // }

    const handleTextInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // setInputValue(inputValue); // Update local state immediately
        // if(validateInput(inputValue))
        // {
            // onChange(inputValue); // Update parent component state only if validation passes
        // }
    }

    // Replace any spaces in the label with underscores to create a valid id
    const inputTxtId = label.replace(/\s+/g, '_');
    return (
        <div className="mb-3">
            <label htmlFor={inputTxtId} className="form-label custom-label">
                {label}
            </label>
            <input
                type={type}
                id={inputTxtId}
                className="form-control custom-input"
                placeholder={placeholder}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label} // Accessibility
            />
            {/* {error && <div className="error-message">{error}</div>} */}
        </div>
    );
}

const Dropdown: React.FC<InputProps> = ({ label, placeholder, options, value, onChange }) => {

    // Replace any spaces in the label with underscores to create a valid id
    const drdownId = label.replace(/\s+/g, '_');
    const [selected, setSelected] = useState<boolean>(false);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        console.log(event.target)
        setSelected(selectedOption !== '');
        onChange(selectedOption);
    };

    const isFirstOptionGrey = value === '';
    return(
        <div className="mb-3">
            {/* Create a label for the dropdown using the form-label class */}
            <label htmlFor={drdownId} className="form-label custom-label">
                {label}
            </label>

            {/* Create a select element with the form-select class */}
            <select
                id={drdownId}
                className={`form-select custom-input custom-select ${selected ? 'custom-option' : ''} ${isFirstOptionGrey? 'custom-disabled-option' : 'custom-primary-option'}`}
                // className="form-select custom-input custom-select"
                value={value ?? ''}
                // onChange={(e) => onChange(e.target.value)}
                onChange={handleSelectChange}
                aria-label={label}
            >
                <option value="" className="custom-disabled-option">{placeholder}</option>
                {options?.map((option, index) => (
                    <option key={index} value={option.key} className="custom-option custom-primary-option">
                        {option.value}
                    </option>
                ))}
            </select>
        </div>
    );
}

const GroupInput: React.FC<InputProps> = ({label, children}) =>{
    return(
        <div className="mb-3"> {/* Container for the group input */}
            {/* Label for the group input */}
            <label className="form-label custom-label">{label}</label>
            
            {/* Bootstrap row for the group of child fields */}
            <div className="row">
                {children?.map((child, index) => (
                    <div key={index} className="col">
                        {/* Render each child field as an input element */}
                        <input
                            type={child.type}
                            className="form-control custom-input"
                            placeholder={child.placeholder}
                            value={child.value ?? ''}
                            onChange={(e) => child.onChange(e.target.value)}
                            aria-label={child.label} // Accessibility
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

const DateInput: React.FC<InputProps> = ({ label, placeholder, value, onChange }) => {
    // Replace any spaces in the label with underscores to create a valid id
    const dateRangeId = label.replace(/\s+/g, '_');
    return (
    <div className="mb-3">
        <label htmlFor={dateRangeId} className="form-label custom-label">{label}</label>
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
        
    </div>
)};

const SiteFilterForm : React.FC<childProps> = ({cancelSearchFilter}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] =  useState<{ [key: string]: any | [Date, Date] }>({});
    const [selectedFilters, setSelectedFilters] = useState<{ key: any; value: any }[]>([]);
    
    const formatDateRange = (range: [Date, Date]) => {
        const [startDate, endDate] = range;
        const formattedStartDate = format(startDate, 'dd-MMM-yy');
        const formattedEndDate = format(endDate, 'dd-MMM-yy');
        return `${formattedStartDate} - ${formattedEndDate}`;
    };
    
    const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
       if(value !== '' || value != undefined)
        {
            setFormData((prevData) => ({
                ...prevData,
                [graphQLPropertyName]:value 
            }));
        }
       
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Add logic for form submission (e.g., API call)
        // const selectedInput = Object.keys(formData).join(', ')
        // console.log(selectedInput);
        console.log(formData);
        debugger;
        // dispatch(updateSearchQuery(selectedInput));
        dispatch(fetchSites({filter: formData}));
        // show and format pill.
        if(Object.keys(formData).length !== 0)
        {
            var filters = Object.entries(formData).map(([key, value]) => ({ key, value}));
            setSelectedFilters(filters);
            // Save filter selections to local storage
            localStorage.setItem('siteFilterPills', JSON.stringify(filters));
        }
    };

    const handleReset = () => {
        setFormData({});
        setSelectedFilters([]);
    };

    const handleRemoveFilter = (filter: any) => {
        setFormData(prevData => {
            const newData = { ...prevData };
            delete newData[filter.key]; // Remove the filter key from the form data
            dispatch(fetchSites({filter: newData}));
            return newData;
        });
      
        setSelectedFilters(selectedFilters.filter(item => item.key !== filter.key));
    };

    useEffect(() => {
        // Load filter selections from local storage when component mounts
        const storedFilters = localStorage.getItem('siteFilterPills');
        if (storedFilters) {
            setSelectedFilters(JSON.parse(storedFilters));
        }
    }, []);

    return (
        <>
        <form onSubmit={handleFormSubmit}>
            {formRows.map((row, rowIndex) => (
                <div key={rowIndex} className="row mb-3">
                    {row.map((field, colIndex) => (
                        <div key={colIndex} className="col-lg-4 col-md-6 col-sm-12">
                            {field.type === 'text' && (
                                <TextInput
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    value={formData[field.graphQLPropertyName ?? ''] || ''}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    validation={field.validation}
                                />
                            )}
                            {field.type === 'dropdown' && (
                                <Dropdown
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    options={field.options || []}
                                    value={formData[field.graphQLPropertyName ?? ''] || ''}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                />
                            )}
                            {field.type === 'date' && (
                                <DateInput
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    value={formData[field.graphQLPropertyName ?? ''] || []}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                />
                            )}
                            {field.type === 'group' && (
                                <GroupInput
                                    label={field.label}
                                    children={field.children?.map((child) => ({
                                        validation : child.validation,
                                        type: child.type,
                                        label: child.label,
                                        placeholder: child.placeholder,
                                        value: formData[child.graphQLPropertyName ?? ''] || '',
                                        onChange: (value:any) =>
                                            handleInputChange(child.graphQLPropertyName, value),
                                    }))}
                                    onChange={(value) => handleInputChange(field.graphQLPropertyName, value)}
                                    type={field.type}
                                    value={formData[field.label] || ''}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}


            <div className="d-flex flex-sm-wrap justify-content-between w-100">
                <div>
                    <button type="reset" className="reset-button" onClick={handleReset}>Reset Filters</button>
                </div>
                <div>
                    {/* Submit button */}
                    <button type="submit" className=" submit-button">
                        Submit
                    </button>
                    {/* Cancel button */}
                    <button type="button" className=" cancel-button" onClick={() => {handleReset(); cancelSearchFilter()}}>
                        Cancel
                    </button>
                </div>
            </div>
        </form>
         <div id="filter-pill" className="d-flex justify-content-end flex-wrap selected-filter">
         {selectedFilters.map((filter, index) => (
             <div key={index} className="d-flex custom-pill align-items-center">
                 {filter.key === 'whenCreated' || filter.key === 'whenUpdated' ? formatDateRange(filter.value) : filter.value}
                 <div className="d-flex align-items-center x-mark" onClick={() => handleRemoveFilter(filter)}><XmarkIcon/></div>
             </div>
         ))}
     </div>
     </>
    );
}


export default SiteFilterForm;