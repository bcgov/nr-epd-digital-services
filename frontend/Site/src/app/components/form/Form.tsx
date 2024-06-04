import React, { useState } from "react";
import './Form.css';
import { CalendarIcon, DropdownIcon, XmarkIcon } from '../common/icon';
import 'rsuite/DateRangePicker/styles/index.css';
import { FormFieldType, IFormField } from "../input-controls/IFormField";
import { DateInput, Dropdown ,GroupInput,TextInput, } from "../input-controls/InputControls";
 

interface IFormRendererProps {
    formRows: IFormField[][]; // Define the type of formRows according to your application
    formData: { [key: string]: any | [Date, Date] };
    editMode?: boolean;
    handleInputChange:  (graphQLPropertyName: any, value: string | [Date, Date]) => void;
}



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