# Widget Component

A flexible and customizable React component designed to display a table with various configurable options such as pagination, sorting, and accessibility features. This widget can be easily integrated into any React application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [CSS Variables](#css-variables)
- [Example](#example)
- [License](#license)

## Installation

To install the Widget component and its dependencies, run:

```bash
npm install @your-org/widget
```

## Usage
You can use the `Widget` component in your React project by importing and passing the required props. Here's a simple example:
```tsx
import React, { useState } from 'react';
import Widget from '@your-org/widget'; // Adjust path as needed
import { RequestStatus } from '@your-org/inputControl/RequestStatus';

const MyComponent = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(RequestStatus.idle);

  // Example of fetching data and updating the state
  const fetchData = async () => {
    setIsLoading(RequestStatus.loading);
    const data = await fetch('/api/data').then(res => res.json());
    setTableData(data);
    setIsLoading(RequestStatus.success);
  };

  return (
    <Widget
      title="My Custom Widget"
      tableColumns={[{ header: 'Name', field: 'name' }, { header: 'Age', field: 'age' }]}
      tableIsLoading={isLoading}
      tableData={tableData}
      allowRowsSelect={true}
      hideTable={false}
      sortHandler={(row, ascSort) => console.log(row, ascSort)}
      showPageOptions={true}
      customLabelCss="my-custom-label-class"
      currentPage={1}
      changeHandler={(event) => console.log(event)}
    />
  );
};
```
## Props
The Widget component accepts the following props:
| Prop                          | Type                                    | Description                                                                                     | Default Value                 |
| ----------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------- |
| `title`                       | `string`                                | Title to be displayed at the top of the widget (optional).                                       | `undefined`                   |
| `tableColumns`                | `Array<any>`                            | Array of column definitions for the table (optional).                                            | `[]`                          |
| `tableIsLoading`              | `RequestStatus`                         | Status of table loading (optional).                                                             | `RequestStatus.idle`          |
| `tableData`                   | `Array<any>`                            | Data to populate the table (optional).                                                           | `[]`                          |
| `children`                    | `React.ReactNode`                       | Child components to be rendered inside the widget (optional).                                    | `undefined`                   |
| `customLabelCss`              | `string`                                | Custom CSS class for the widget title (optional).                                                | `undefined`                   |
| `allowRowsSelect`             | `boolean`                               | Whether rows in the table can be selected (optional).                                            | `false`                       |
| `hideTable`                   | `boolean`                               | Flag to hide the table (optional).                                                               | `false`                       |
| `hideTitle`                   | `boolean`                               | Flag to hide the title (optional).                                                               | `false`                       |
| `editMode`                    | `boolean`                               | Flag to enable edit mode in the widget (optional).                                               | `false`                       |
| `srMode`                      | `boolean`                               | Flag to enable screen reader mode (optional).                                                    | `false`                       |
| `primaryKeycolumnName`        | `string`                                | Name of the primary key column in the table (optional).                                          | `''`                          |
| `currentPage`                 | `number`                                | Current page number for pagination (optional).                                                   | `1`                           |
| `changeHandler`               | `(event: any) => void`                  | Handler for change events (optional).                                                            | `() => {}`                    |
| `handleCheckBoxChange`        | `(event: any) => void`                  | Handler for checkbox change events (optional).                                                   | `() => {}`                    |
| `sortHandler`                 | `(row: any, ascSort: boolean) => void`   | Handler for sorting rows (optional).                                                             | `() => {}`                    |
| `showPageOptions`             | `boolean`                               | Whether to display pagination options (optional).                                                | `false`                       |
| `customWidgetContainerCss`    | `string`                                | Custom CSS class for the widget container (optional).                                            | `undefined`                   |
| `customWidgetTableContainerCss`| `string`                               | Custom CSS class for the table container (optional).                                             | `undefined`                   |

### Example of Sorting Handler
You can implement custom sorting logic by passing a sortHandler function. Here's an example:
```tsx
const sortHandler = (row: any, ascSort: boolean) => {
  const sortedData = [...widgetData].sort((a, b) => {
    if (ascSort) {
      return a[row] > b[row] ? 1 : -1;
    } else {
      return a[row] < b[row] ? 1 : -1;
    }
  });
  setWidgetData(sortedData);
};
```

## CSS Variables
The widget uses a set of CSS variables for customization, which can be overridden in your global CSS or within the widget's container.


| CSS Variable                     | Default Value   | Description                                                     |
| --------------------------------- | --------------- | --------------------------------------------------------------- |
| `--max-height`                   | `700px`         | Maximum height of the table container.                          |
| `--overflow`                     | `auto`          | Defines the overflow behavior for scrolling content.            |
| `--font-size`                    | `16px`          | Default font size for text in the widget.                       |
| `--font-weight`                  | `700`           | Default font weight for text (bold).                            |
| `--line-height`                  | `18px`          | Line height for text content.                                   |
| `--layout-padding-small`         | `8px`           | Small padding used for inner elements (adjustable globally).    |
| `--layout-margin-small`          | `10px`          | Small margin used for spacing between elements.                 |
| `--surface-border-light`         | `#d8d8d8`       | Border color for elements, used for borders and dividers.       |
| `--typography-color-primary`     | `#333`          | Primary text color for labels and headers.                      |


You can override these variables in your CSS to modify the widget's appearance as needed.

### Example
Here is a basic example demonstrating the Widget component usage:
```tsx
import React, { useState, useEffect } from 'react';
import Widget from '@your-org/widget';  // Adjust import path as needed

const Example = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result);
    setIsLoading(false);
  };

  return (
    <Widget
      title="Data Table"
      tableColumns={[{ header: 'Name', field: 'name' }, { header: 'Age', field: 'age' }]}
      tableIsLoading={isLoading}
      tableData={data}
      allowRowsSelect={true}
      hideTable={false}
      showPageOptions={true}
    />
  );
};

export default Example;
```

