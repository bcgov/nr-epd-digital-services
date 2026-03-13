# ColumnSelect Component

A reusable React component for managing table column visibility and user preferences.

## Overview

The `ColumnSelect` component provides a user interface for:
- Toggling column visibility in tables
- Saving user column preferences to the backend
- Resetting columns to default configuration
- Managing column selection order

## Usage

```tsx
import ColumnSelect from '@cats/components/column-select';

<ColumnSelect
  columns={columns}
  handleColumnChange={handleColumnChange}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  onResetColumns={handleResetColumns}
  onSaveDefault={handleSaveDefault}
  page="applications"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `TableColumn[]` | Yes | Array of table column configurations |
| `handleColumnChange` | `(updatedColumns: TableColumn[]) => void` | Yes | Callback when column selection changes |
| `onSubmit` | `() => void` | No | Callback when Submit button is clicked |
| `onCancel` | `() => void` | No | Callback when Cancel button is clicked |
| `onResetColumns` | `() => void` | No | Callback when Reset Columns button is clicked |
| `onSaveDefault` | `() => void` | No | Callback when Save Default button is clicked |
| `page` | `string` | Yes | Page identifier for saving preferences (e.g., "applications", "people") |

## TableColumn Interface

```typescript
interface TableColumn {
  id: number;
  displayName: string;
  active: boolean;
  sortOrder?: number;
  selectionOrder?: number;
  // ... other properties
}
```

## Features

### Column Toggle
- Click checkboxes to show/hide columns
- Active columns are checked, inactive columns are unchecked
- Selection order is automatically managed

### Reset Columns
- Restores columns to their default configuration
- Calls the `onResetColumns` callback

### Save Default
- Saves current column configuration to user preferences
- Persists settings across sessions
- Uses GraphQL mutation `saveUserColumnPreferences`
- Shows "Saving..." state while processing

### Submit & Cancel
- Submit: Applies current column selection
- Cancel: Discards changes and closes the selector

## GraphQL Integration

The component uses two GraphQL operations:

### Query: `getUserColumnPreferences`
```graphql
query getUserColumnPreferences($page: String!) {
  getUserColumnPreferences(page: $page) {
    page
    columns {
      id
      displayName
      active
      sortOrder
      selectionOrder
    }
  }
}
```

### Mutation: `saveUserColumnPreferences`
```graphql
mutation saveUserColumnPreferences($columnPreferences: ColumnPreferencesInput!) {
  saveUserColumnPreferences(columnPreferences: $columnPreferences) {
    success
    message
  }
}
```

## Example Implementation

```tsx
const [columns, setColumns] = useState<TableColumn[]>(defaultColumns);
const [showColumnSelect, setShowColumnSelect] = useState(false);

const handleColumnChange = (updatedColumns: TableColumn[]) => {
  setColumns(updatedColumns);
};

const handleSubmit = () => {
  setShowColumnSelect(false);
};

const handleCancel = () => {
  setColumns(defaultColumns);
  setShowColumnSelect(false);
};

const handleResetColumns = () => {
  setColumns(defaultColumns);
};

return (
  <>
    <button onClick={() => setShowColumnSelect(true)}>
      Manage Columns
    </button>
    
    {showColumnSelect && (
      <ColumnSelect
        columns={columns}
        handleColumnChange={handleColumnChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onResetColumns={handleResetColumns}
        page="applications"
      />
    )}
  </>
);
```

## Styling

The component uses CSS classes defined in `ColumnSelect.css`:

- `.column-select-container` - Main container
- `.column-select-grid` - Grid layout for column items
- `.column-item` - Individual column checkbox item
- `.column-select-actions` - Action buttons container
- `.btn-reset` - Reset button
- `.btn-save-default` - Save Default button
- `.btn-submit` - Submit button
- `.btn-cancel` - Cancel button

## Accessibility

- Checkboxes include `aria-label` with column display name
- Checkboxes include `aria-checked` attribute
- Grid container has `data-testid` for testing

## Error Handling

- Save errors are logged to console
- GraphQL errors are captured and logged
- Loading states are displayed during save operations

## Notes

- Column preferences are user-specific and page-specific
- The `page` prop must match the page identifier used in the backend
- Selection order is automatically incremented when columns are activated
- Inactive columns have `undefined` selection order
