# `Actions` Component

A reusable and customizable dropdown component for React applications. The `Actions` component allows you to display a list of actions that users can select from. It provides flexibility to customize the dropdown button, the items, and their behavior, and can be styled with custom CSS.

## Features

- **Customizable Dropdown**: Modify dropdown button, menu, items, and icons.
- **Responsive**: Works seamlessly across all screen sizes.
- **TypeScript Support**: Fully typed with TypeScript for better development experience.
- **Customizable Styling**: Pass custom CSS classes for the button, menu, and items.
- **Custom Icons**: Add custom icons in the dropdown button or menu items.

## Installation

To install `Actions` in your project, run the following command:

```bash
npm install path-to-actions-component
```

## Usage
### Basic Usage
Here is an example of how to use the Actions component in your React project:
```tsx
import React from 'react';
import { Actions } from 'path-to-actions-component';

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
  { label: 'Archive', value: 'archive' },
];

const handleItemClick = (value: string, index?: any) => {
  console.log(`Item clicked: ${value} at index ${index}`);
};

const MyComponent = () => {
  return (
    <Actions
      label="Choose Action"           // Label displayed on the dropdown button
      items={items}                   // Array of items to display in the dropdown menu
      onItemClick={handleItemClick}    // Callback when an item is clicked
    />
  );
};

export default MyComponent;
```

## Props Overview

The `Actions` component accepts the following props:

| **Prop Name**               | **Type**                           | **Description**                                                                                               | **Required?** |
|-----------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------|---------------|
| `label`                     | `string`                           | The label displayed on the dropdown toggle button. Example: `"Choose Action"`                                 | Yes           |
| `items`                     | `DropdownItem[]`                   | Array of items to display in the dropdown. Each item must have a `label` (string) and a `value` (any).        | Yes           |
| `disable`                   | `boolean`                          | If `true`, the dropdown button will be disabled, preventing users from interacting with it. Default is `false`.| No            |
| `customCssToggleBtn`        | `string`                           | Custom CSS class for the dropdown toggle button. Default is `'custom-action-btn'`.                           | No            |
| `customCssMenu`             | `string`                           | Custom CSS class for the dropdown menu. Default is `'custom-action-menu'`.                                    | No            |
| `customCssMenuItem`         | `string`                           | Custom CSS class for each dropdown item. Default is `'custom-action-item'`.                                   | No            |
| `customDropdownIcon`        | `ReactNode`                        | A custom icon to display next to the label in the dropdown toggle button. Example: `<FaEdit />`               | No            |
| `onItemClick`               | `(value: string, index?: any) => void` | Callback function triggered when an item is clicked. Receives the `value` and optionally the `index`.         | Yes           |
| `toggleButtonVariant`       | `ButtonVariant`                    | Variant for the dropdown button, such as `primary`, `secondary`.                                             | No            |
| `toggleButtonSize`          | `ButtonSize`                       | Size of the dropdown button, such as `sm`, `lg`.                                                             | No            |

### Prop Descriptions

- **`label`** (`string`)  
  **Required**: The text displayed on the dropdown button. This is usually something like "Select Action" or "Choose Option."

- **`items`** (`DropdownItem[]`)  
  **Required**: An array of `DropdownItem` objects. Each item should have a `label` (the text displayed) and a `value` (the value associated with the item). Example:

  ```ts
  const items = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' }
  ];
  ```
## Example
Here’s a complete example of using the Actions component with custom styles and icons:
```tsx
import React from 'react';
import { Actions } from 'path-to-actions-component';
import { FaEdit, FaTrash, FaArchive } from 'react-icons/fa';

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
  { label: 'Archive', value: 'archive' },
];

const handleItemClick = (value: string, index?: any) => {
  console.log(`You clicked on ${value} at index ${index}`);
};

const MyComponent = () => {
  return (
    <Actions
      label="Choose Action"
      items={items}
      onItemClick={handleItemClick}
      customCssToggleBtn="my-custom-toggle-btn"
      customCssMenu="my-custom-menu"
      customCssMenuItem="my-custom-item"
      customDropdownIcon={<FaEdit />}  // Custom icon for dropdown button
    />
  );
};

export default MyComponent;
```

## CSS Customization

You can pass custom CSS classes to various parts of the dropdown to match your project’s branding. For example:

```tsx
<Actions
  customCssToggleBtn="my-custom-toggle-btn"
  customCssMenu="my-custom-menu"
  customCssMenuItem="my-custom-item"
/>
```
This will apply the custom classes to the dropdown button, menu, and items respectively.

## Custom Icons
You can provide custom icons to be displayed in the dropdown button or for each menu item:
```tsx
<Actions
  label="Choose Action"
  items={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' }
  ]}
  customDropdownIcon={<FaEdit />}  // Custom icon for the dropdown button
/>
```

## Exports
The module exports the Actions component and the types DropdownItem and IActions:

```ts
// Named and default exports
export { default as Actions } from './Actions';  // Named export
export type { DropdownItem, IActions } from './IActions';  // Type exports
```

The Actions component can be imported in other files as:

```tsx
import { Actions } from 'path-to-actions-component'; // Named import
```
or

```tsx
import Actions from 'path-to-actions-component'; // Default import
```
The types DropdownItem and IActions can also be imported for use in TypeScript files:

```tsx
import type { DropdownItem, IActions } from 'path-to-actions-component';
```

## Conclusion
The ```Actions``` component provides a flexible and customizable dropdown menu for your React application. It supports custom styling, icons, and behavior, allowing you to integrate it easily into your app's UI. You can control how each item behaves on click, and customize its appearance by passing in your own CSS classes.