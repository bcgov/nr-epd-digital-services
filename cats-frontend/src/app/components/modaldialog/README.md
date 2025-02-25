# `ModalDialog` Component

A reusable and customizable modal dialog component for React applications. The `ModalDialog` component allows you to display a modal with various buttons and configurable actions, such as saving, cancelling, or discarding changes. It is built using TypeScript and styled with custom CSS.

## Features

- **Customizable Modal**: Modify the modal header, content, and footer actions.
- **TypeScript Support**: Fully typed with TypeScript for better development experience.
- **Customizable Buttons**: Configurable buttons for Save, Cancel, and Discard actions.
- **Responsive Design**: Modal adapts to different screen sizes.
- **Customizable Styling**: Pass custom CSS classes for the modal and its elements.

## Installation

To install `ModalDialog` in your project, run the following command:

```bash
npm install path-to-modal-dialog-component
```
## Basic Usage

Here’s an example of how to use the `ModalDialog` component in your React project:

```tsx
import React from 'react';
import ModalDialog from 'path-to-modal-dialog-component';

const handleClose = (action: any) => {
  if (action === true) {
    // Handle save logic
  } else if (action === 'discard') {
    // Handle discard logic
  } else {
    // Handle cancel logic
  }
};

const MyComponent = () => {
  return (
    <ModalDialog
      closeHandler={handleClose}
      label="Are you sure?"
      saveBtnLabel="Save Changes"
      cancelBtnLabel="Cancel"
      dicardBtnLabel="Discard"
      discardOption={true}
    >
      <p>Do you want to save changes to this item?</p>
    </ModalDialog>
  );
};

export default MyComponent;
```

### Props Overview

The `ModalDialog` component accepts the following props:

| **Prop Name**             | **Type**                           | **Description**                                                                                                    |
|---------------------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `closeHandler`            | `(save: any) => void`              | **Required**. Callback function that handles the modal closure. The function will be called with `true` (save), `false` (cancel), or `'discard'` (discard). |
| `children`                | `ReactNode`                        | **Optional**. Custom content (React elements) that will be rendered inside the modal body. |
| `label`                   | `string`                           | **Optional**. Text to display in the modal header. Defaults to `"Are you sure you want to commit changes?"`.         |
| `saveBtnLabel`            | `string`                           | **Optional**. Label for the Save button. Defaults to an empty string.                                                |
| `cancelBtnLabel`          | `string`                           | **Optional**. Label for the Cancel button. Defaults to an empty string.                                              |
| `dicardBtnLabel`          | `string`                           | **Optional**. Label for the Discard button. Defaults to an empty string.                                            |
| `discardOption`           | `boolean`                          | **Optional**. If `true`, adds a "Discard" button in addition to the Save and Cancel buttons. Defaults to `false`.     |

### Props Descriptions

### `closeHandler` **(function)**
- **Required**
- This is a callback function that gets called when the modal is closed. It can be triggered by any of the action buttons (Save, Cancel, Discard).
- The `closeHandler` function receives a single argument which can be:
  - `true`: The user clicked on "Save", indicating they want to save the changes.
  - `false`: The user clicked on "Cancel", indicating they do not want to save the changes.
  - `'discard'`: The user clicked on "Discard", indicating they want to discard the changes.

Example usage:
```tsx
const handleClose = (action: any) => {
  if (action === true) {
    // Save changes logic
  } else if (action === 'discard') {
    // Discard changes logic
  } else {
    // Cancel logic
  }
};
```

### `children` **(ReactNode)**
**Optional**
- This is the content you want to display inside the modal body. It can be any React element, such as text, forms, or custom components.
- If no content is passed, the modal will just display the label and action buttons.
Example usage:

```tsx
<ModalDialog closeHandler={handleClose} label="Are you sure?">
  <p>Do you really want to save the changes?</p>
</ModalDialog>
```

### `label` **(string)**
**Optional**
- This text will be displayed in the modal header. It typically acts as a prompt for the user (e.g., "Are you sure you want to commit  changes?").
- If not provided, the default value `"Are you sure you want to commit changes?"` will be used.

Example usage:

```tsx

<ModalDialog closeHandler={handleClose} label="Confirm Save">
  <p>Your changes will be saved permanently. Do you want to proceed?</p>
</ModalDialog>
```
### `saveBtnLabel` **(string)**
**Optional**
- The text label for the "Save" button. This allows you to customize the button text (e.g., "Confirm", "Apply", etc.).
- The default value is an empty string (`""`), which means no label will be shown unless explicitly set.
Example usage:

```tsx
<ModalDialog
  closeHandler={handleClose}
  label="Save Changes"
  saveBtnLabel="Save"
>
  <p>Do you want to save the changes?</p>
</ModalDialog>
```
### `cancelBtnLabel` **(string)**
**Optional**
- The text label for the "Cancel" button. You can customize the button text (e.g., "Close", "Dismiss").
- The default value is an empty string (`""`), so if not provided, no label will be shown unless explicitly set.
Example usage:

```tsx
<ModalDialog
  closeHandler={handleClose}
  label="Are you sure?"
  cancelBtnLabel="Cancel"
>
  <p>Are you sure you want to discard these changes?</p>
</ModalDialog>
```
### `dicardBtnLabel` **(string)**
**Optional**
- The text label for the "Discard" button. This is shown when discardOption is set to true. You can customize the button text.
- The default value is an empty string (`""`), so no label will be shown unless explicitly set.
Example usage:

```tsx
<ModalDialog
  closeHandler={handleClose}
  label="Confirm Discard"
  dicardBtnLabel="Discard Changes"
  discardOption={true}
>
  <p>Your changes will be lost. Do you want to discard them?</p>
</ModalDialog>
```
### `discardOption` **(boolean)**
**Optional**
- When set to `true`, the modal will display an additional "Discard" button along with the "Save" and "Cancel" buttons.
- If set to `false` (the default), only "Save" and "Cancel" buttons will be shown.
Example usage:

```tsx
Copy code
<ModalDialog
  closeHandler={handleClose}
  label="Discard Changes?"
  discardOption={true}
  saveBtnLabel="Save"
  cancelBtnLabel="Cancel"
  dicardBtnLabel="Discard"
>
  <p>Do you want to discard the unsaved changes?</p>
</ModalDialog>
```

### Example
Here’s a complete example of how to use the ModalDialog component with custom buttons and content:
```tsx
import React from 'react';
import ModalDialog from 'path-to-modal-dialog-component';

const handleClose = (action: any) => {
  if (action === true) {
    console.log('Changes saved!');
  } else if (action === 'discard') {
    console.log('Changes discarded!');
  } else {
    console.log('Modal closed without action.');
  }
};

const MyComponent = () => {
  return (
    <ModalDialog
      closeHandler={handleClose}
      label="Confirm Changes"
      saveBtnLabel="Save"
      cancelBtnLabel="Cancel"
      dicardBtnLabel="Discard"
      discardOption={true}
    >
      <p>Are you sure you want to save the changes made?</p>
    </ModalDialog>
  );
};

export default MyComponent;
```

### Conclusion
The `ModalDialog` component is a flexible and reusable solution for displaying modals in React applications. It supports customizable buttons, content, and styling, making it easy to integrate into your app’s UI. You can control the modal's behavior through the `closeHandler` prop and modify its appearance with custom CSS.