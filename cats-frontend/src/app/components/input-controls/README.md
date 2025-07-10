# Custom Input Components Documentation

This document provides detailed usage and explanations for custom input components, including links, buttons, checkboxes, text inputs, dropdowns, search inputs, and date inputs, implemented in React. These components are highly customizable and suitable for various form scenarios.

---

## Table of Contents

1. [Link](#link)
2. [IconButton](#iconbutton)
3. [DeleteIcon](#deleteicon)
4. [Label](#label)
5. [TextInput](#textinput)
6. [DropdownInput](#dropdowninput)
7. [GroupInput](#groupinput)
8. [DateRangeInput](#daterangeinput)
9. [DateInput](#dateinput)
10. [CheckBoxInput](#checkboxinput)
11. [TextAreaInput](#textareainput)
12. [DropdownSearchInput](#dropdownsearchinput)
13. [SearchCustomInput](#searchcustominput)

---

## Link

The `Link` component is a customizable link element in React. It supports a variety of props to control its appearance and behavior. Below is a comprehensive list of the props available for the `Link` component.

### Props

| **Prop Name**               | **Type**            | **Description**                                                                                           | **Default Value**         |
|-----------------------------|---------------------|-----------------------------------------------------------------------------------------------------------|---------------------------|
| `label`                     | `string`            | The label for the link, used for accessibility purposes. This can be styled with custom CSS.               | N/A                       |
| `value`                     | `string`            | The value that will be appended to the `href` prop. This forms the complete URL by concatenating `href + value`. | N/A                       |
| `customLabelCss`            | `string`            | A custom CSS class to style the label part of the link.                                                   | `"ps-1"` (if not provided)|
| `customInputTextCss`        | `string`            | A custom CSS class to style the text inside the link.                                                    | N/A                       |
| `customLinkValue`           | `string`            | Custom text to be displayed in place of `value`. If not provided, `value` will be displayed.              | `value` (if not provided) |
| `isPrefixcustomLinkValue`   | `boolean`           | Determines if the `customIcon` should be placed before (`true`) or after (`false`) the link text.         | `false`                   |
| `customIcon`                | `ReactNode`         | A custom icon to be displayed before or after the link text based on the value of `isPrefixcustomLinkValue`. | N/A                       |
| `tableMode`                 | `boolean`           | If `true`, the component is rendered inside a table cell (`<td>`).                                         | `false`                   |
| `href`                      | `string`            | The base URL to which `value` is appended to form the complete URL.                                         | N/A                       |

#### Example Usage
#### 1. Link with Custom Text and Icon
In this example:

- The `label` is **"User Profile"**.
- The value **12345** is appended to `/profile/` to form the complete link `/profile/12345`.
- The link text will display **"View Profile"**.
- The custom icon **(<FaUser />)** will be placed **after** the link text.
- Custom CSS classes are applied to the label (`customLabelCss`) and text (`customInputTextCss`).
- Since `tableMode` is `false`, the link will **not** be rendered inside a table cell.
```tsx
<Link
  label="User Profile"
  value="12345"
  customLabelCss="text-primary"
  customInputTextCss="font-weight-bold"
  customLinkValue="View Profile"
  isPrefixcustomLinkValue={false}
  customIcon={<FaUser />}
  href="/profile/"
  tableMode={false}
/>
```

```tsx
<Link
  label="Go to Google"
  url="https://www.google.com"
  isEditing={false}
  onClick={() => console.log('Link clicked!')}
/>
```


## IconButton

The `IconButton` component is used to display a clickable button with an icon and an optional label. The component is highly customizable with different props for controlling the appearance and behavior of the button.

### Props

| **Prop**               | **Type**               | **Description**                                                                                       |
|------------------------|------------------------|-------------------------------------------------------------------------------------------------------|
| `value`                | `string`               | The default value to display on the button if no `customLinkValue` is provided.                       |
| `customInputTextCss`   | `string` (optional)    | Custom CSS class for styling the text content of the button.                                          |
| `customLinkValue`      | `string` (optional)    | Custom label to display on the button instead of the `value`.                                          |
| `customIcon`           | `ReactNode` (optional) | The icon to display on the button, typically passed as an icon component (e.g., `<FaUser />`).        |
| `onChange`             | `() => void`           | Function to handle the click event of the button. This is typically used to trigger some action.       |

### Example Usage

 **1. Basic IconButton with Custom Text and Icon**

In this example:

- The `value` is **"Submit"** and it will be displayed as the label on the button.
- A custom icon **(<FaCheck />)** is added before the label text.
- A custom CSS class (`customInputTextCss`) is applied for additional styling of the button's content.
- When the button is clicked, the `onChange` function will be triggered.

```tsx
import { FaCheck } from 'react-icons/fa';

<IconButton
  value="Submit"
  customInputTextCss="btn btn-primary"
  customLinkValue="Submit Now"
  customIcon={<FaCheck />}
  onChange={() => console.log("Button clicked!")}
/>
```

#### Result:
- The button will display the text **"Submit Now"** and the **FaCheck** icon before it.
- Clicking the button will trigger the `onChange` function, which logs **"Button clicked!"** to the console.

---

 **2. IconButton Inside Table**
When tableMode is enabled (via renderTableCell), the button will be rendered within a table cell, making it suitable for use in table-based layouts.

```tsx

import { FaEdit } from 'react-icons/fa';

<IconButton
  value="Edit"
  customInputTextCss="btn btn-warning"
  customIcon={<FaEdit />}
  onChange={() => console.log("Edit clicked!")}
/>
```

#### Result:
- The button will appear in a table cell with the label **"Edit"** and the **FaEdit** icon.
- Clicking the button triggers the `onChange` event, logging **"Edit clicked!"** to the console.

---
 **3. IconButton in Table Mode with Custom Text and Icon**
In this example, the `IconButton` is used with the `renderTableCell` function in table mode.

```tsx

import { FaTrash } from 'react-icons/fa';

<IconButton
  value="Delete"
  customInputTextCss="btn btn-danger"
  customLinkValue="Delete Item"
  customIcon={<FaTrash />}
  onChange={() => console.log("Delete clicked!")}
/>

```

#### Result:
- The button will be rendered within a table cell, showing the **"Delete Item"** text and the **FaTrash** icon.
- The `onChange` function will log **"Delete clicked!"** when clicked.

---

## DeleteIcon


The `DeleteIcon` component renders a clickable icon (trash can) that triggers an action when clicked.

### Props

| Prop      | Type               | Description                                               |
|-----------|--------------------|-----------------------------------------------------------|
| `label`   | `string`           | The label text associated with the icon (for accessibility). |
| `onChange` | `() => void`       | The callback function to be triggered when the icon is clicked. |

### Example Usage

```tsx
import { FaTrashCan } from 'react-icons/fa';

<DeleteIcon
  label="Delete item"
  onChange={() => console.log("Item deleted!")}
/>
```
----
## Label

## `Label` Component

The `Label` component renders a label element that displays a value, with optional custom styling. It is especially useful for displaying dynamic or static text in both normal and table layouts.

### Props

| Prop               | Type                | Description                                                               |
|--------------------|---------------------|---------------------------------------------------------------------------|
| `label`            | `string`            | The text or identifier associated with the label (for accessibility).     |
| `value`            | `string | ReactNode` | The content or value to be displayed within the label.                     |
| `customInputTextCss` | `string`          | Optional custom CSS class to style the label text.                        |

### Example Usage

```tsx
<Label
  label="Username"
  value="john_doe"
  customInputTextCss="text-primary"
/>
```
----
## TextInput

The `TextInput` component provides a customizable text input field with support for validation, error handling, custom styling, and integration with table layouts. It allows you to control the input field's behavior based on various props, such as validation rules, placeholder, and editing state.

### Props

| Prop                    | Type                          | Description                                                                 |
|-------------------------|-------------------------------|-----------------------------------------------------------------------------|
| `label`                 | `string`                      | The label displayed for the input field.                                     |
| `placeholder`           | `string`                      | Placeholder text for the input field.                                        |
| `type`                  | `string`                      | Specifies the input type (e.g., "text", "email", "password", etc.).          |
| `value`                 | `string`                      | The current value of the input field.                                        |
| `validation`            | `Validation`                  | Validation object containing pattern and custom error message.               |
| `allowNumbersOnly`      | `boolean`                     | If `true`, only numeric input is allowed.                                    |
| `isEditing`             | `boolean`                     | If `true`, the input field is editable; otherwise, it displays the value.    |
| `isDisabled`            | `boolean`                     | If `true`, disables the input field.                                         |
| `srMode`                | `boolean`                     | If `true`, renders the input as a screen reader-only checkbox.               |
| `customLabelCss`        | `string`                      | Optional custom CSS class for the label.                                     |
| `customInputTextCss`    | `string`                      | Optional custom CSS class for the text input field.                          |
| `customEditLabelCss`    | `string`                      | Optional custom CSS class for the label when editing.                        |
| `customEditInputTextCss`| `string`                      | Optional custom CSS class for the input field when editing.                  |
| `customPlaceholderCss`  | `string`                      | Optional custom CSS class for the placeholder text.                          |
| `customErrorCss`        | `string`                      | Optional custom CSS class for the error message.                             |
| `onChange`              | `(value: string) => void`     | Callback function to handle value changes.                                   |
| `tableMode`             | `boolean`                     | If `true`, renders the input field within a table cell.                      |

### Example Usage

```tsx
<TextInput
  label="Username"
  type="text"
  value="john_doe"
  placeholder="Enter your username"
  validation={{ pattern: /^[a-zA-Z0-9_]+$/, customMessage: "Invalid username" }}
  allowNumbersOnly={false}
  isEditing={true}
  onChange={(value) => console.log(value)}
/>
```

#### Table Mode Example
In table mode, the `TextInput` component will be rendered inside a table cell, and you can apply custom CSS classes or make the column sticky.

```tsx
<TextInput
  label="Age"
  type="number"
  value="25"
  placeholder="Enter your age"
  isEditing={true}
  tableMode={true}
  onChange={(value) => console.log(value)}
/>

```

#### Error Handling Example
You can handle errors in the input field by passing a validation object and rendering the error message if the validation fails.

```tsx
<TextInput
  label="Email"
  type="email"
  value="invalid_email"
  validation={{ pattern: /^[^@]+@[^@]+\.[^@]+$/, customMessage: "Invalid email address" }}
  isEditing={true}
  onChange={(value) => console.log(value)}
/>
```

#### Custom Styling Example
You can customize the appearance of the input field, label, and error message by using various CSS props:

```tsx
<TextInput
  label="Password"
  type="password"
  value="secret123"
  isEditing={true}
  customLabelCss="text-info"
  customInputTextCss="form-control-lg"
  customErrorCss="text-danger small"
  onChange={(value) => console.log(value)}
/>
```
----
## DropdownInput

The `DropdownInput` component is used to render a customizable dropdown (select) input field. It provides various features, such as custom styling, support for images in the dropdown, validation handling, and the ability to integrate with table layouts.

### Props

| Prop                    | Type                          | Description                                                                 |
|-------------------------|-------------------------------|-----------------------------------------------------------------------------|
| `label`                 | `string`                      | The label displayed for the dropdown input field.                            |
| `placeholder`           | `string`                      | Placeholder text displayed when no option is selected.                       |
| `options`               | `Array<{ key: string, value: string }>` | List of options for the dropdown. Each option has a `key` and `value`. |
| `value`                 | `string`                      | The currently selected value of the dropdown.                                |
| `isEditing`             | `boolean`                     | If `true`, the dropdown is editable; otherwise, it displays the selected value. |
| `srMode`                | `boolean`                     | If `true`, renders the dropdown as a screen reader-only checkbox.            |
| `isImage`               | `boolean`                     | If `true`, displays the selected value as an image or avatar, instead of text. |
| `customLabelCss`        | `string`                      | Optional custom CSS class for the label.                                    |
| `customInputTextCss`    | `string`                      | Optional custom CSS class for the text displayed in the dropdown.           |
| `customEditLabelCss`    | `string`                      | Optional custom CSS class for the label when editing.                       |
| `customEditInputTextCss`| `string`                      | Optional custom CSS class for the input field when editing.                 |
| `customPlaceholderCss`  | `string`                      | Optional custom CSS class for the placeholder text.                         |
| `onChange`              | `(value: string) => void`     | Callback function to handle value changes.                                  |
| `tableMode`             | `boolean`                     | If `true`, renders the dropdown inside a table cell.                         |

### Example Usage

```tsx
<DropdownInput
  label="Select Country"
  placeholder="Choose a country"
  value="USA"
  options={[
    { key: 'USA', value: 'United States' },
    { key: 'CAN', value: 'Canada' },
    { key: 'MEX', value: 'Mexico' },
  ]}
  isEditing={true}
  onChange={(selectedValue) => console.log(selectedValue)}
/>
```

#### Table Mode Example
In table mode, the `DropdownInput` component will be rendered inside a table cell, making it suitable for table-based layouts.
```tsx
<DropdownInput
  label="Select Department"
  placeholder="Choose a department"
  value="HR"
  options={[
    { key: 'HR', value: 'Human Resources' },
    { key: 'ENG', value: 'Engineering' },
    { key: 'MKT', value: 'Marketing' },
  ]}
  tableMode={true}
  onChange={(selectedValue) => console.log(selectedValue)}
/>
```
#### Image/Avatar Mode Example
When `isImage` is set to `true`, the selected option will be displayed as an avatar or image instead of text.
```tsx
<DropdownInput
  label="Select User"
  value="123"
  options={[
    { key: '123', value: 'John Doe, Developer' },
    { key: '456', value: 'Jane Smith, Designer' },
  ]}
  isImage={true}
  onChange={(selectedValue) => console.log(selectedValue)}
/>
```

#### Error Handling Example
The `DropdownInput` component supports custom styling for error handling via the `customErrorCss` prop. If the input is required, you can display an error message based on validation.

```tsx
<DropdownInput
  label="Select Role"
  value=""
  options={[
    { key: '', value: 'Select Role' },
    { key: 'admin', value: 'Admin' },
    { key: 'user', value: 'User' },
  ]}
  isEditing={true}
  onChange={(selectedValue) => console.log(selectedValue)}
  customErrorCss="text-danger"
/>
```

#### Custom Styling Example
You can style the dropdown with custom CSS classes for labels, inputs, and placeholders:
```tsx
<DropdownInput
  label="Select Product"
  value="laptop"
  options={[
    { key: 'laptop', value: 'Laptop' },
    { key: 'phone', value: 'Smartphone' },
    { key: 'tablet', value: 'Tablet' },
  ]}
  isEditing={true}
  customLabelCss="text-success"
  customInputTextCss="form-control-lg"
  customPlaceholderCss="text-muted"
  onChange={(selectedValue) => console.log(selectedValue)}
/>
```
----
## GroupInput

The `GroupInput` component allows you to group multiple input fields (such as text inputs) into one cohesive form. It provides the flexibility to display the fields as editable or read-only and includes features like validation, custom styling, and error handling.

### Props

| Prop                      | Type                              | Description                                                                 |
|---------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `label`                   | `string`                          | The label for the group of input fields.                                     |
| `children`                | `Array<InputProps>`               | A list of child input components to be grouped together. Each child should have the `InputProps` structure. |
| `isEditing`               | `boolean`                         | If `true`, the inputs are editable. If `false`, the inputs are displayed as read-only. |
| `srMode`                  | `boolean`                         | If `true`, renders a screen reader-only checkbox.                            |
| `customLabelCss`          | `string`                          | Custom CSS class for the group label.                                        |
| `customInputTextCss`      | `string`                          | Custom CSS class for the text displayed in the group.                        |
| `customEditLabelCss`      | `string`                          | Custom CSS class for the label when editing.                                 |
| `customEditInputTextCss`  | `string`                          | Custom CSS class for the input fields when editing.                          |
| `customPlaceholderCss`    | `string`                          | Custom CSS class for the placeholder text in the inputs.                     |
| `isChildLabel`            | `boolean`                         | If `true`, renders a label for each individual child input.                  |
| `customErrorCss`          | `string`                          | Custom CSS class for the error message.                                      |
| `onChange`                | `(value: string) => void`         | Callback function to handle changes in the input values.                     |

### Example Usage

```tsx
<GroupInput
  label="User Information"
  isEditing={true}
  onChange={(updatedValues) => console.log(updatedValues)}
  customLabelCss="form-label"
  customInputTextCss="custom-input-text"
>
  <TextInput
    label="First Name"
    value="John"
    placeholder="Enter your first name"
    onChange={(value) => console.log(value)}
  />
  <TextInput
    label="Last Name"
    value="Doe"
    placeholder="Enter your last name"
    onChange={(value) => console.log(value)}
  />
</GroupInput>
```
#### Error Handling Example
The `GroupInput` component supports error messages for validation purposes. If any of the child inputs trigger an error (e.g., invalid input), the error message will be displayed.
```tsx
<GroupInput
  label="Contact Information"
  isEditing={true}
  onChange={(updatedValues) => console.log(updatedValues)}
  customErrorCss="text-danger"
>
  <TextInput
    label="Email"
    value="invalid-email"
    validation={{ pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, customMessage: 'Invalid email address' }}
    onChange={(value) => console.log(value)}
  />
</GroupInput>
```

#### Grouping Multiple Inputs
You can group multiple inputs under one label. Each input can have its own validation, error handling, and custom styles.
```tsx
<GroupInput
  label="Address Details"
  isEditing={true}
  onChange={(updatedValues) => console.log(updatedValues)}
>
  <TextInput
    label="Street"
    value="123 Main St"
    placeholder="Enter street"
    onChange={(value) => console.log(value)}
  />
  <TextInput
    label="City"
    value="New York"
    placeholder="Enter city"
    onChange={(value) => console.log(value)}
  />
  <TextInput
    label="Zip Code"
    value="10001"
    placeholder="Enter zip code"
    onChange={(value) => console.log(value)}
  />
</GroupInput>
```

#### Read-Only Mode Example
When `isEditing` is set to `false`, the inputs are displayed as read-only text.
```tsx
<GroupInput
  label="User Profile"
  isEditing={false}
  onChange={(updatedValues) => console.log(updatedValues)}
>
  <TextInput
    label="Username"
    value="johndoe"
    onChange={(value) => console.log(value)}
  />
  <TextInput
    label="Email"
    value="johndoe@example.com"
    onChange={(value) => console.log(value)}
  />
</GroupInput>
```

#### Custom Child Labels Example
If `isChildLabel` is set to `true`, each child input field will have its own label.
```tsx
<GroupInput
  label="Personal Information"
  isEditing={true}
  isChildLabel={true}
  onChange={(updatedValues) => console.log(updatedValues)}
>
  <TextInput
    label="First Name"
    value="John"
    onChange={(value) => console.log(value)}
  />
  <TextInput
    label="Last Name"
    value="Doe"
    onChange={(value) => console.log(value)}
  />
</GroupInput>
```
----
## DateRangeInput

The `DateRangeInput` component allows users to select a date range using a calendar input. It supports both editable and read-only modes, customizable styling, and integrates with screen readers for accessibility. 

### Props

| Prop                      | Type                              | Description                                                                 |
|---------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `label`                   | `string`                          | The label for the date range input.                                          |
| `placeholder`              | `string`                          | Placeholder text to show when no value is selected.                          |
| `value`                    | `string[]`                        | An array of two strings representing the selected date range, formatted as `['startDate', 'endDate']`. |
| `isEditing`                | `boolean`                         | If `true`, the date range input is editable; otherwise, it is displayed as read-only text. |
| `srMode`                   | `boolean`                         | If `true`, renders a screen reader-only checkbox.                            |
| `customLabelCss`           | `string`                          | Custom CSS class for the label.                                              |
| `customInputTextCss`       | `string`                          | Custom CSS class for the displayed date range text.                          |
| `customEditLabelCss`       | `string`                          | Custom CSS class for the label when editing.                                 |
| `customEditInputTextCss`   | `string`                          | Custom CSS class for the input when editing.                                 |
| `customPlaceholderCss`     | `string`                          | Custom CSS class for the placeholder.                                        |
| `tableMode`                | `boolean`                         | If `true`, renders the component inside a table cell.                        |
| `onChange`                 | `(value: string[]) => void`       | Callback function to handle the selected date range.                         |

### Example Usage

```tsx
<DateRangeInput
  label="Select Date Range"
  value={['01/01/2024', '01/31/2024']}
  isEditing={true}
  placeholder="Select a date range"
  onChange={(value) => console.log('Selected Date Range:', value)}
  customLabelCss="form-label"
  customInputTextCss="custom-input-text"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-edit-input"
  tableMode={false}
/>
```
----
## DateInput

The `DateInput` component allows users to select a single date using a date picker. It supports both editable and read-only modes, can be used within table-based layouts, and offers various customization options including styling and accessibility features.

### Props

| Prop                        | Type                                | Description                                                                 |
|-----------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| `label`                     | `string`                            | The label for the date input.                                                |
| `placeholder`                | `string`                            | Placeholder text to show when no value is selected.                          |
| `value`                      | `string \| Date`                    | The selected date value, formatted as `Date` or `string`.                    |
| `isEditing`                  | `boolean`                           | If `true`, the input is editable; otherwise, it is displayed as read-only text. |
| `srMode`                     | `boolean`                           | If `true`, renders a screen reader-only checkbox.                            |
| `customLabelCss`             | `string`                            | Custom CSS class for the label.                                              |
| `customInputTextCss`         | `string`                            | Custom CSS class for the displayed date text.                                |
| `customEditLabelCss`         | `string`                            | Custom CSS class for the label when editing.                                 |
| `customEditInputTextCss`     | `string`                            | Custom CSS class for the input when editing.                                 |
| `customPlaceholderCss`       | `string`                            | Custom CSS class for the placeholder.                                        |
| `tableMode`                  | `boolean`                           | If `true`, renders the component inside a table cell.                        |
| `onChange`                   | `(value: Date \| string) => void`   | Callback function to handle the selected date value.                         |
| `isDisabled`                 | `boolean`                           | If `true`, disables the input field, preventing user interaction.            |

### Example Usage

```tsx
<DateInput
  label="Select Date"
  value={new Date()}
  isEditing={true}
  placeholder="Select a date"
  onChange={(value) => console.log('Selected Date:', value)}
  customLabelCss="form-label"
  customInputTextCss="custom-input-text"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-edit-input"
  tableMode={false}
/>
```
----
## CheckBoxInput

The `CheckBoxInput` component is used to render a checkbox input field, optionally with a label. It supports both editable and read-only modes, can be used in table layouts, and offers various customization options, including styling and accessibility features.

### Props

| Prop                         | Type                                | Description                                                                 |
|------------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| `label`                      | `string`                            | The label for the checkbox input.                                             |
| `isLabel`                    | `boolean`                           | If `true`, renders the label along with the checkbox.                          |
| `isChecked`                  | `boolean`                           | Specifies whether the checkbox is checked or not.                             |
| `customLabelCss`             | `string`                            | Custom CSS class for the label.                                               |
| `customEditLabelCss`         | `string`                            | Custom CSS class for the label when editing.                                  |
| `customEditInputTextCss`     | `string`                            | Custom CSS class for the checkbox when editing.                               |
| `customPlaceholderCss`       | `string`                            | Custom CSS class for the placeholder.                                         |
| `isEditing`                  | `boolean`                           | If `true`, the checkbox is editable; otherwise, it's displayed in read-only mode. |
| `type`                       | `string`                            | The type of the input, typically `checkbox`.                                  |
| `onChange`                   | `(isChecked: boolean) => void`      | Callback function to handle the checkbox change event.                        |
| `tableMode`                  | `boolean`                           | If `true`, renders the component inside a table cell.                         |
| `srMode`                     | `boolean`                           | If `true`, renders a screen-reader only checkbox for better accessibility.    |

### Example Usage

```tsx
<CheckBoxInput
  label="Accept Terms"
  isChecked={true}
  isEditing={true}
  onChange={(isChecked) => console.log('Checked:', isChecked)}
  customLabelCss="form-label"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-checkbox-edit"
  customPlaceholderCss="custom-placeholder"
  tableMode={false}
/>
```
----
## TextAreaInput

The `TextAreaInput` component renders a customizable `<textarea>` element. It supports both editable and read-only modes and can be used in table layouts. The component also provides various customization options such as styling, placeholder text, and accessibility features.

### Props

| Prop                         | Type                                | Description                                                                 |
|------------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| `label`                      | `string`                            | The label for the textarea input.                                             |
| `placeholder`                | `string`                            | The placeholder text for the textarea input.                                 |
| `value`                      | `string`                            | The value of the textarea.                                                    |
| `isEditing`                  | `boolean`                           | If `true`, the textarea is editable; otherwise, it displays the value in a read-only format. |
| `srMode`                     | `boolean`                           | If `true`, renders a screen-reader only checkbox for better accessibility.    |
| `customLabelCss`             | `string`                            | Custom CSS class for the label.                                               |
| `customInputTextCss`         | `string`                            | Custom CSS class for the text input (read-only mode).                         |
| `customEditLabelCss`         | `string`                            | Custom CSS class for the label when editing.                                  |
| `customEditInputTextCss`     | `string`                            | Custom CSS class for the textarea when editing.                               |
| `customPlaceholderCss`       | `string`                            | Custom CSS class for the placeholder.                                         |
| `onChange`                   | `(value: string) => void`           | Callback function to handle the change event of the textarea.                 |
| `tableMode`                  | `boolean`                           | If `true`, renders the component inside a table cell.                         |
| `textAreaRow`                | `number`                            | The number of rows for the textarea.                                          |
| `textAreaColoum`             | `number`                            | The number of columns for the textarea.                                       |

### Example Usage

```tsx
<TextAreaInput
  label="Description"
  value="This is a description."
  isEditing={true}
  placeholder="Enter description"
  onChange={(value) => console.log('Textarea value:', value)}
  customLabelCss="form-label"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-textarea-edit"
  customPlaceholderCss="custom-placeholder"
  tableMode={false}
/>
```
----
## DropdownSearchInput

`DropdownSearchInput` is a custom dropdown input field with search functionality. It allows users to select an option from a dropdown list that can be filtered based on a search term. This component supports both table and form-based layouts and allows for customization of styles and behavior.

### Props:

| Prop                      | Type                                           | Description                                                                                                                                                       |
|---------------------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `label`                   | `string`                                       | The label to display for the dropdown.                                                                                                                           |
| `placeholder`             | `string`                                       | The placeholder text displayed when no option is selected.                                                                                                      |
| `options`                 | `Array<{ key: any; value: any }>`              | Array of options to display in the dropdown. Each option should have a `key` and `value` field.                                                                 |
| `value`                   | `any`                                          | The selected value. This will be matched with the `key` of an option from the `options` array.                                                                  |
| `isEditing`               | `boolean`                                      | Determines whether the dropdown is in an editable mode (to allow user selection).                                                                               |
| `srMode`                  | `boolean`                                      | If true, hides the label and displays a checkbox for screen readers.                                                                                            |
| `customLabelCss`          | `string`                                       | Custom CSS class for the label.                                                                                                                                 |
| `customInputTextCss`      | `string`                                       | Custom CSS class for the text area (input text).                                                                                                                |
| `customEditLabelCss`      | `string`                                       | Custom CSS class for the editable label.                                                                                                                         |
| `customEditInputTextCss`  | `string`                                       | Custom CSS class for the editable input text.                                                                                                                   |
| `customPlaceholderCss`    | `string`                                       | Custom CSS class for the placeholder text.                                                                                                                      |
| `onChange`                | `(selectedOption: any) => void`                | Callback function to handle the selected option from the dropdown. It will pass the selected option object.                                                      |
| `handleSearch`            | `(searchTerm: string) => void`                 | Callback function that triggers when the search term is changed.                                                                                               |
| `tableMode`               | `boolean`                                      | If true, the dropdown is displayed inside a table (`td`). Otherwise, it is a regular `div`.                                                                    |
| `filteredOptions`         | `Array<{ key: any; value: any }>`              | A filtered list of options that match the current search term. Default is an empty array.                                                                      |
| `isLoading`               | `boolean`                                      | If true, shows a loading spinner inside the dropdown.                                                                                                           |
| `customInfoMessage`       | `string`                                       | A custom message to display when no options are available or when search results are empty.                                                                   |

### Usage:

```tsx
<DropdownSearchInput
  label="Select Staff"
  placeholder="Search Staff..."
  options={options}
  value={selectedValue}
  isEditing={true}
  srMode={false}
  customLabelCss="custom-label"
  customInputTextCss="custom-input-text"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-edit-input-text"
  customPlaceholderCss="custom-placeholder"
  onChange={(selectedOption) => setSelectedValue(selectedOption.key)}
  handleSearch={(searchTerm) => filterOptions(searchTerm)}
  tableMode={false}
  filteredOptions={filteredOptions}
  isLoading={false}
  customInfoMessage="No results found"
/>
```
----
## SearchCustomInput

`SearchCustomInput` is a customizable input component that allows users to enter search terms and provides real-time validation and suggestions. It supports custom styling, validation, and handles both numeric-only inputs and regular text inputs. The component also offers features like a loading spinner, error handling, and the ability to display a custom message when no options are available.

### Props:

| Prop                      | Type                                           | Description                                                                                                                                                       |
|---------------------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `label`                   | `string`                                       | The label to display for the input field.                                                                                                                          |
| `placeholder`             | `string`                                       | The placeholder text displayed when the input is empty.                                                                                                          |
| `options`                 | `Array<{ key: any; value: any }>`              | An array of suggestions to display as a dropdown when the user types. Each option should have a `key` and `value` field.                                           |
| `value`                   | `any`                                          | The current value of the input field.                                                                                                                              |
| `type`                    | `string`                                       | The type of input field (e.g., "text", "number").                                                                                                                  |
| `validation`              | `object`                                       | A validation object with a `pattern` (RegEx) and an optional `customMessage` for validation failure.                                                              |
| `allowNumbersOnly`        | `boolean`                                      | If true, the input will only allow numeric values.                                                                                                               |
| `isEditing`               | `boolean`                                      | Determines if the input is editable or not.                                                                                                                        |
| `customLabelCss`          | `string`                                       | Custom CSS class for the label.                                                                                                                                 |
| `customInputTextCss`      | `string`                                       | Custom CSS class for the input field text.                                                                                                                        |
| `customEditLabelCss`      | `string`                                       | Custom CSS class for the editable label.                                                                                                                           |
| `customEditInputTextCss`  | `string`                                       | Custom CSS class for the editable input text.                                                                                                                     |
| `customPlaceholderCss`    | `string`                                       | Custom CSS class for the placeholder text.                                                                                                                        |
| `customLeftIconCss`       | `string`                                       | Custom CSS class for the left icon.                                                                                                                                |
| `customRightIconCss`      | `string`                                       | Custom CSS class for the right icon.                                                                                                                               |
| `customErrorCss`          | `string`                                       | Custom CSS class for the error message.                                                                                                                            |
| `customInfoMessage`       | `React.ReactNode`                              | A custom message to display below the input when there is no input or when the search term results in no matching options.                                         |
| `customMenuMessage`       | `React.ReactNode`                              | A custom message to display inside the dropdown menu, typically used when no options are available.                                                              |
| `isLoading`               | `boolean`                                      | If true, a loading spinner is displayed while the options are being fetched or loaded.                                                                            |
| `onChange`                | `(value: any) => void`                         | Callback function to handle the input value changes.                                                                                                              |
| `tableMode`               | `boolean`                                      | If true, the input is displayed inside a table (`td`). Otherwise, it is a regular `div`.                                                                        |

### Usage:

```tsx
<SearchCustomInput
  label="Search Product"
  placeholder="Search products..."
  options={options}
  value={inputValue}
  type="text"
  validation={{
    pattern: /^[a-zA-Z\s]*$/,
    customMessage: 'Only letters and spaces are allowed',
  }}
  allowNumbersOnly={false}
  isEditing={true}
  customLabelCss="custom-label"
  customInputTextCss="custom-input-text"
  customEditLabelCss="custom-edit-label"
  customEditInputTextCss="custom-edit-input-text"
  customPlaceholderCss="custom-placeholder"
  customLeftIconCss="custom-left-icon"
  customRightIconCss="custom-right-icon"
  customErrorCss="error-text"
  customInfoMessage="No results found"
  customMenuMessage="Select an option"
  isLoading={false}
  onChange={handleInputChange}
  tableMode={false}
/>
```