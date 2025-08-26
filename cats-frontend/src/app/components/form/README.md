# Form Component Documentation

This documentation covers the usage and features of the `Form` component, which renders a dynamic form with multiple input types and configurable fields. It is designed to handle a wide variety of form elements such as text inputs, dropdowns, date pickers, checkboxes, and more.

## Table of Contents
1. [Overview](#overview)
2. [Props](#props)
3. [FormField Types](#formfield-types)
4. [Usage](#usage)
5. [Component Structure](#component-structure)
6. [Custom Styling](#custom-styling)
7. [Example Usage](#example-usage)

---

## Overview

The `Form` component is a flexible and extensible form renderer built using **React**. It supports a wide variety of input types (e.g., text fields, checkboxes, dropdowns, date pickers) and is fully customizable. The component dynamically generates form fields based on the `formRows` prop, which contains a 2D array of field definitions. 

---

## Props

The `Form` component accepts the following props:

| Prop Name            | Type                                     | Description |
|----------------------|------------------------------------------|-------------|
| `formRows`           | `IFormField[][]`                         | A 2D array representing the rows of form fields. Each field is defined by an object of type `IFormField`. |
| `formData`           | `{ [key: string]: any | [Date, Date] }`  | An object that holds the data for each form field. The keys are field names, and values can be any type or a date range (for fields like DateRange). |
| `editMode`           | `boolean` (optional)                     | Optional flag to indicate whether the form is in "edit mode". Defaults to `true`. |
| `isLoading`          | `RequestStatus` (optional)               | Optional flag indicating whether data is being fetched or submitted. |
| `srMode`             | `boolean` (optional)                     | Optional flag to render the form in a screen reader (accessibility) mode. |
| `handleInputChange`  | `(graphQLPropertyName: string, value: string | [Date, Date]) => void` | Callback function to handle changes in input values. Receives the field's GraphQL property name and its updated value. |

---

## FormField Types

The `IFormField` interface defines the different types of fields that can be used in the form. Here are the main field types supported:

| Field Type              | Description |
|-------------------------|-------------|
| `FormFieldType.Text`     | A standard text input field. |
| `FormFieldType.Search`   | A text input field with search capabilities. |
| `FormFieldType.TextArea` | A multi-line text input (textarea). |
| `FormFieldType.DropDown` | A dropdown select input. |
| `FormFieldType.DropDownWithSearch` | A searchable dropdown input. |
| `FormFieldType.DateRange` | A date range picker input. |
| `FormFieldType.Date`     | A single date picker input. |
| `FormFieldType.Checkbox` | A checkbox input. |
| `FormFieldType.Group`    | A group of form fields, usually used to group related fields together. |
| `FormFieldType.Link`     | A link or clickable text. |

---

## Usage

To use the `Form` component, you need to import it and provide the necessary props.

### Basic Example

```tsx
import React, { useState } from 'react';
import { Form } from './Form';
import { FormFieldType } from '../inputControl/IFormField';

const ExampleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
  });

  const handleInputChange = (property: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [property]: value,
    }));
  };

  const formRows = [
    [
      {
        type: FormFieldType.Text,
        label: 'Name',
        graphQLPropertyName: 'name',
        placeholder: 'Enter your name',
      },
      {
        type: FormFieldType.Text,
        label: 'Email',
        graphQLPropertyName: 'email',
        placeholder: 'Enter your email',
      },
    ],
    [
      {
        type: FormFieldType.Checkbox,
        label: 'Is Active?',
        graphQLPropertyName: 'isActive',
        isChecked: formData.isActive,
      },
    ],
  ];

  return (
    <Form
      formRows={formRows}
      formData={formData}
      handleInputChange={handleInputChange}
    />
  );
};

export default ExampleForm;
```

## Component Structure

### `IFormField` Interface

Each form field is defined by an object that conforms to the `IFormField` interface. Here's the structure of the `IFormField` interface:

```tsx
export interface IFormField {
  type: FormFieldType; // The type of the form field
  label: string; // The label text for the field
  graphQLPropertyName: string; // The GraphQL property name corresponding to the field
  placeholder?: string; // Placeholder text
  value?: any; // The value of the field
  options?: Array<string>; // Options for dropdowns, etc.
  validation?: any; // Validation rule for the field
  isDisabled?: boolean; // Flag to disable the field
  isChecked?: boolean; // For checkbox type fields
  textAreaRow?: number; // Row count for textarea fields
  textAreaColoum?: number; // Column count for textarea fields
  customLabelCss?: string; // Custom CSS class for label
  customInputTextCss?: string; // Custom CSS class for input text
  customPlaceholderCss?: string; // Custom CSS class for placeholder
  isImage?: boolean; // For image-based dropdown fields
  srMode?: boolean; // Flag for screen reader mode
  handleSearch?: (searchQuery: string) => void; // Search handler for searchable dropdown
  filteredOptions?: Array<any>; // Filtered options for searchable dropdown
  customInfoMessage?: string; // Custom message to be shown with the input
  customMenuMessage?: string; // Custom menu message for dropdown
}
```

# Form Component Documentation

## Field Types

The `FormFieldType` enum provides the possible types of fields that can be rendered by the `Form` component. Here’s a list of available field types:

```tsx
export enum FormFieldType {
  Text = "Text",
  Search = "Search",
  TextArea = "TextArea",
  DropDown = "DropDown",
  DropDownWithSearch = "DropDownWithSearch",
  DateRange = "DateRange",
  Date = "Date",
  Checkbox = "Checkbox",
  Group = "Group",
  Link = "Link"
}
```

# Field Types

- **Text**: A standard text input field.
- **Search**: A text input field with search capabilities.
- **TextArea**: A multi-line text input field (textarea).
- **DropDown**: A dropdown select input field.
- **DropDownWithSearch**: A dropdown input with a search bar.
- **DateRange**: A field for selecting a date range.
- **Date**: A single date picker field.
- **Checkbox**: A checkbox field.
- **Group**: A group of related fields, usually used to group form fields that belong together (like a set of related options).
- **Link**: A clickable link, usually for navigation purposes.

---

# Field Components

## TextInput

- **Type**: `FormFieldType.Text`
- **Props**:
  - `label`: The label of the input field.
  - `placeholder`: Placeholder text inside the input.
  - `value`: The current value of the input.
  - `onChange`: Callback function that handles input changes.
  - `customLabelCss`, `customInputTextCss`: Custom CSS for the input field and label.
  - `isEditing`: Whether the field is in edit mode.

---

## SearchCustomInput

- **Type**: `FormFieldType.Search`
- **Props**:
  - Same as `TextInput`, but includes additional props for handling search options.

---

## TextAreaInput

- **Type**: `FormFieldType.TextArea`
- **Props**:
  - `rows`: The number of rows for the textarea.
  - `cols`: The number of columns for the textarea.

---

## DropdownInput

- **Type**: `FormFieldType.DropDown`
- **Props**:
  - `options`: The options for the dropdown field.
  - `isImage`: Whether the dropdown options are images.

---

## DropdownSearchInput

- **Type**: `FormFieldType.DropDownWithSearch`
- **Props**:
  - `options`: List of options for the dropdown.
  - `handleSearch`: Function to handle filtering options based on user input.

---

## DateRangeInput

- **Type**: `FormFieldType.DateRange`
- **Props**:
  - `value`: The currently selected date range.
  - `onChange`: Callback to handle date range changes.

---

## DateInput

- **Type**: `FormFieldType.Date`
- **Props**:
  - `value`: The currently selected date.
  - `onChange`: Callback to handle date changes.

---

## CheckBoxInput

- **Type**: `FormFieldType.Checkbox`
- **Props**:
  - `isChecked`: Whether the checkbox is checked.
  - `isLabel`: Whether to show the label next to the checkbox.

---

## GroupInput

- **Type**: `FormFieldType.Group`
- **Props**:
  - `children`: Nested form fields inside the group.
  - `isChildLabel`: Whether to show labels for child fields.

---

## Link

- **Type**: `FormFieldType.Link`
- **Props**:
  - `href`: The URL the link should navigate to.
  - `customLinkValue`: Custom link text or value.
  - `customIcon`: Icon to display next to the link.

---
# Example Usage

Here is an example of how you can use the Form component to create a form with various field types.

```tsx
import React, { useState } from 'react';
import { Form, FormFieldType } from './Form';
import { IFormField } from '../inputControl/IFormField';

const ExampleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isActive: true,
  });

  const handleInputChange = (property: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [property]: value,
    }));
  };

  const formRows: IFormField[][] = [
    [
      {
        type: FormFieldType.Text,
        label: 'Name',
        graphQLPropertyName: 'name',
        placeholder: 'Enter your name',
      },
      {
        type: FormFieldType.Email,
        label: 'Email',
        graphQLPropertyName: 'email',
        placeholder: 'Enter your email',
      },
    ],
    [
      {
        type: FormFieldType.Checkbox,
        label: 'Is Active?',
        graphQLPropertyName: 'isActive',
        isChecked: formData.isActive,
      },
    ],
  ];

  return (
    <Form
      formRows={formRows}
      formData={formData}
      handleInputChange={handleInputChange}
    />
  );
};

export default ExampleForm;
```

# Custom Styling

You can style individual elements using the `customLabelCss`, `customInputTextCss`, and `customPlaceholderCss` props.

Here is an example of custom styling:

```css
/* Example custom CSS for text input */
.custom-label {
  color: blue;
}

.custom-input {
  background-color: lightgrey;
}
```

By applying the `custom CSS` classes through the props, you can easily customize the look and feel of each input field in the form.