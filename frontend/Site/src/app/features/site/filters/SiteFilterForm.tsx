import React, { useEffect, useState } from "react"
import { format } from 'date-fns';
import { formRows} from '../dto/SiteFilterConfig';
import './SiteFilterForm.css';
import {XmarkIcon } from "../../../components/common/icon";
import 'rsuite/DateRangePicker/styles/index.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../Store";
import { fetchSites } from "../dto/SiteSlice";
import Form from "../../../components/form/Form";
import { FormFieldType, IFormField } from "../../../components/form/IForm";

interface childProps {
    cancelSearchFilter : () => void
}

const SiteFilterForm : React.FC<childProps> = ({cancelSearchFilter}) => {
    const dispatch = useDispatch<AppDispatch>();
    const sites = useSelector((state:any) => state.sites);
    const [formData, setFormData] =  useState<{ [key: string]: any | [Date, Date] }>({});
    const [selectedFilters, setSelectedFilters] = useState<{ key: any; value: any, label: string  }[]>([]);
    
    const formatDateRange = (range: [Date, Date]) => {
        const [startDate, endDate] = range;
        const formattedStartDate = format(startDate, 'dd-MMM-yy');
        const formattedEndDate = format(endDate, 'dd-MMM-yy');
        return `${formattedStartDate} - ${formattedEndDate}`;
    };
    
    const handleInputChange = (graphQLPropertyName: any, value: String | [Date, Date]) => {
        setFormData((prevData) => ({
            ...prevData,
            [graphQLPropertyName]:value 
        }));
    };

    const flattenFormRows = (arr: IFormField[][]): IFormField[] => {
        const flattened: IFormField[] = [];
        
        const flatten = (arr: IFormField[][]): void => {
            for (const item of arr) {
                for (const field of item) {
                    if (field.type === FormFieldType.Group && field.children) {
                        flattened.push(field);
                        flatten([field.children]);
                    } else {
                        flattened.push(field);
                    }
                }
            }
        }
    
        flatten(arr);
        return flattened;
    }

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const filteredFormData: { [key: string]: string } = {};
        const filters: { key: string, value: string, label: string }[] = [];
        const flattedArr = flattenFormRows(formRows)
        // Filter out form data with non-empty values and construct filteredFormData and filters
        for (const [key, value] of Object.entries(formData)) {
            debugger;
            let currLabel = flattedArr && flattedArr.find(row => row.graphQLPropertyName === key);
            console.log('kkkll ---> ', currLabel);
            if(key === 'whenCreated' || key === 'whenUpdated' )
            {
                let dateRangeValue = formatDateRange(value);
                filteredFormData[key] = dateRangeValue
                filters.push({ key, value: dateRangeValue, label: currLabel?.label ?? '' });
            }
            else if (value.trim() !== '') {
                filteredFormData[key] = value;
                filters.push({ key, value, label: currLabel?.label ?? '' });
            }
        }

        // show and format pill.
        if(filters.length !== 0)
        {
            console.log('filters ---> ',filters);
            dispatch(fetchSites({searchParam: sites.searchQuery, filter: filteredFormData}));
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
            dispatch(fetchSites({searchParam: sites.searchQuery, filter: newData}));
            return newData;
        });
        let currFilter = selectedFilters.filter(item => item.key !== filter.key);
        setSelectedFilters(currFilter);
        localStorage.setItem('siteFilterPills', JSON.stringify(currFilter));
    };

    useEffect(() => {
        // Load filter selections from local storage when component mounts
        const storedFilters = localStorage.getItem('siteFilterPills');
        if (storedFilters) {
            setSelectedFilters(JSON.parse(storedFilters));
        }
    }, [setSelectedFilters]);

    return (
        <>
        <form onSubmit={handleFormSubmit}>
            <Form formRows={formRows} formData={formData} handleInputChange={handleInputChange}/>
            <div className="d-flex flex-wrap justify-content-between w-100">
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
                {filter && `${filter.label} : ${filter.value}`}
                 <div className="d-flex align-items-center x-mark" onClick={() => handleRemoveFilter(filter)}><XmarkIcon/></div>
             </div>
         ))}
     </div>
     </>
    );
}


export default SiteFilterForm;