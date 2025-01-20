# Button & Custom Button Components

This repository provides reusable and customizable button components for your React application. It includes several variants like `primary`, `secondary`, and `tertiary`, along with custom buttons like `SaveButton`, `CancelButton`, `DiscardButton`, and `CustomPillButton`.

The `Button` component is designed to be flexible and easy to integrate into any project with minimal configuration. You can customize the button's size, variant, label, and icons.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [Button](#button)
  - [SaveButton](#savebutton)
  - [CancelButton](#cancelbutton)
  - [DiscardButton](#discardbutton)
  - [CustomPillButton](#custompillbutton)
- [Custom Button CSS](#custom-button-css)
- [Example Usage](#example-usage)
- [Exports](#exports)

## Installation

To install the button components in your project, run the following command:

```bash
npm install path-to-your-button-component
```

## Components
### `Button`
A reusable button component that supports multiple sizes and variants. The Button component uses a button HTML element with several customization options.

**Props**

| **Prop Name**   | **Type**                          | **Description**                                                                                          | **Required?** |
|-----------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `size`          | `'small' | 'medium'`                | The size of the button. The options are `small` and `medium`. Default is `medium`.                        | No            |
| `variant`       | `'primary' | 'secondary' | 'tertiary'` | The variant of the button. The options are `primary`, `secondary`, and `tertiary`. Default is `primary`. | No            |
| `className`     | `string`                          | Optional custom CSS class to apply to the button.                                                          | No            |
| `onClick`       | `(event: React.MouseEvent<HTMLButtonElement>) => void` | The event handler for the button's click event.                                                            | Yes           |

**Example Usage**
```tsx
<Button size="small" variant="primary" onClick={handleClick}>
  Primary Button
</Button>

<Button size="medium" variant="secondary" onClick={handleClick}>
  Secondary Button
</Button>

<Button size="medium" variant="tertiary" onClick={handleClick}>
  Tertiary Button
</Button>
```
---

### `SaveButton` 
A specialized button that displays a save icon and a label. The SaveButton uses the Button component with a primary variant and shows a disk icon by default.

**Props**

| **Prop Name**   | **Type**                          | **Description**                                                                                          | **Required?** |
|-----------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `clickHandler`  | `(event: React.MouseEvent<HTMLButtonElement>) => void` | The event handler for the button's click event.                                                            | Yes           |
| `label`         | `string`                          | The label to display on the button. If not provided, the default label is "Save".                          | No            |
| `showIcon`      | `boolean`                         | Whether or not to show the save icon. Default is `true`.                                                   | No            |

**Example Usage**
```tsx
<SaveButton clickHandler={handleSave} label="Save Changes" />
```
---

### `CancelButton` 
A button that displays a cancel icon and a label. The CancelButton uses the Button component with a tertiary variant and shows a close icon by default.

**Props**

| **Prop Name**   | **Type**                          | **Description**                                                                                          | **Required?** |
|-----------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `clickHandler`  | `(event: React.MouseEvent<HTMLButtonElement>) => void` | The event handler for the button's click event.                                                            | Yes           |
| `label`         | `string`                          | The label to display on the button. If not provided, the default label is "Cancel".                        | No            |
| `showIcon`      | `boolean`                         | Whether or not to show the cancel icon. Default is `true`.                                                 | No            |

**Example Usage**
```tsx
<CancelButton clickHandler={handleCancel} label="Cancel Changes" />
```
---

### `DiscardButton` 

A button that displays a discard icon and a label. The DiscardButton uses the Button component with a secondary variant and shows a close icon by default.

**Props**

| **Prop Name**   | **Type**                          | **Description**                                                                                          | **Required?** |
|-----------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `clickHandler`  | `(event: React.MouseEvent<HTMLButtonElement>) => void` | The event handler for the button's click event.                                                            | Yes           |
| `label`         | `string`                          | The label to display on the button. If not provided, the default label is "Discard Changes".              | No            |
| `showIcon`      | `boolean`                         | Whether or not to show the discard icon. Default is `true`.                                                | No            |

**Example Usage**
```tsx
<DiscardButton clickHandler={handleDiscard} label="Discard Changes" />
```

---

### `CustomPillButton` 

**Props**
A custom pill-shaped button that displays a label and an optional close button (X) for dismissing.

| **Prop Name**   | **Type**                          | **Description**                                                                                          | **Required?** |
|-----------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|---------------|
| `clickHandler`  | `(event: any) => void`            | The event handler for the button's click event.                                                            | Yes           |
| `label`         | `string | number`                 | The label to display on the pill button.                                                                   | Yes           |

**Example Usage**
```tsx
<CustomPillButton clickHandler={handlePillClick} label="Pill Label" />
```

---



**Example Usage**
```tsx
<Button size="small" variant="primary" onClick={handleClick}>
  Primary Button
</Button>

<Button size="medium" variant="secondary" onClick={handleClick}>
  Secondary Button
</Button>

<Button size="medium" variant="tertiary" onClick={handleClick}>
  Tertiary Button
</Button>
```

## Example Usage
Here is how you can use the components in your application:
```tsx
import { Button, SaveButton, CancelButton, DiscardButton, CustomPillButton } from 'path-to-your-button-component';

const App = () => {
  const handleSave = () => console.log('Save clicked');
  const handleCancel = () => console.log('Cancel clicked');
  const handleDiscard = () => console.log('Discard clicked');
  const handlePillClick = () => console.log('Pill button clicked');

  return (
    <div>
      <Button variant="primary" onClick={handleSave}>
        Save Button
      </Button>

      <SaveButton clickHandler={handleSave} label="Save Changes" />

      <CancelButton clickHandler={handleCancel} label="Cancel" />

      <DiscardButton clickHandler={handleDiscard} label="Discard Changes" />

      <CustomPillButton clickHandler={handlePillClick} label="Custom Pill" />
    </div>
  );
};
```