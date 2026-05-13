# Advanced Filter and Custom Filter Implementation Guide

## Overview

The MetricsData component now includes built-in support for **Advanced Filter** and **Custom Filter** features. These features allow users to filter data dynamically through props, without adding any new CSS or modifying the existing design system.

## Key Features

### ✨ Advanced Filter
- Pre-configured filter fields
- Multiple field types: text, select, date, checkbox, radio, textarea, number
- Clean dropdown/panel interface
- Apply and Reset buttons
- Auto-labels for fields

### ✨ Custom Filter  
- Rule-based filtering system
- Multiple operators: equals, notEquals, contains, startsWith, endsWith, greaterThan, lessThan
- AND/OR conditions between rules
- Add/Remove rules dynamically
- Apply and Reset buttons

## Implementation Details

### No New CSS or Classes
- ✅ Uses only existing MetricsData CSS classes
- ✅ Uses only existing design variables
- ✅ No inline styles for layout (only minimal positioning for panels)
- ✅ Fully integrated with existing theme system
- ✅ Reuses: `metrics-btn`, `metrics-input`, `metrics-select`, `metrics-group`, `metrics-btn-group`, checkbox structure, etc.

### Data Handling
- ✅ No mutation of original data
- ✅ Filtering done via `useMemo` for performance
- ✅ Advanced filters applied first, then custom filters
- ✅ Existing sorting, pagination, and actions continue working
- ✅ All other props unaffected

### Conditional Rendering
- ✅ If `filters` prop not provided: no filter UI shown
- ✅ If `filters.advanced.enabled` is false: no Advanced Filter button
- ✅ If `filters.custom.enabled` is false: no Custom Filter button
- ✅ Filter buttons appear in existing header action area
- ✅ Empty filter panels never rendered

## API Reference

### Props

```javascript
filters={{
  advanced: {
    enabled: boolean,      // Enable Advanced Filter
    fields: Array<{        // Array of filter field configurations
      key: string,         // Field key (maps to data property)
      label: string,       // Display label
      type: string,        // Field type: 'text' | 'select' | 'date' | 'checkbox' | 'radio' | 'textarea' | 'number'
      options?: Array,     // For select, checkbox, radio: array of options
      placeholder?: string // Placeholder text
      rows?: number        // For textarea: number of rows
      min?: number         // For number: minimum value
      max?: number         // For number: maximum value
      step?: number        // For number: step value
    }>
  },
  custom: {
    enabled: boolean,                    // Enable Custom Filter
    fields: Array<string>,              // Array of field names available for filtering
    operators: Array<string>            // Array of operators (defaults to basic operators)
  }
}}
```

### Supported Field Types

#### text
Single-line text input with case-insensitive matching

```javascript
{
  key: 'name',
  label: 'Name',
  type: 'text',
  placeholder: 'Enter name...'
}
```

#### select
Dropdown with predefined options

```javascript
{
  key: 'status',
  label: 'Status',
  type: 'select',
  options: ['active', 'inactive', 'pending']
}
```

#### date
Date picker input

```javascript
{
  key: 'date',
  label: 'Date',
  type: 'date'
}
```

#### checkbox
Multiple selections with checkboxes

```javascript
{
  key: 'category',
  label: 'Categories',
  type: 'checkbox',
  options: ['A', 'B', 'C']
}
```

#### radio
Single selection with radio buttons

```javascript
{
  key: 'priority',
  label: 'Priority',
  type: 'radio',
  options: ['low', 'medium', 'high']
}
```

#### textarea
Multi-line text input

```javascript
{
  key: 'comments',
  label: 'Search Comments',
  type: 'textarea',
  rows: 3,
  placeholder: 'Enter keywords...'
}
```

#### number
Numeric input with validation

```javascript
{
  key: 'amount',
  label: 'Amount',
  type: 'number',
  min: 0,
  max: 1000,
  step: 10
}
```

### Custom Filter Operators

- **equals**: Exact match (case-insensitive)
- **notEquals**: Not equal to value
- **contains**: Contains substring (case-insensitive)
- **startsWith**: String starts with value (case-insensitive)
- **endsWith**: String ends with value (case-insensitive)
- **greaterThan**: Numeric comparison (>)
- **lessThan**: Numeric comparison (<)

## Usage Examples

### Basic Usage with Advanced Filter

```javascript
import MetricsData from '@/common/metrics-data';

function App() {
  const data = [
    { id: 1, name: 'Item 1', status: 'active', date: '2024-01-15' },
    { id: 2, name: 'Item 2', status: 'pending', date: '2024-01-20' },
  ];

  return (
    <MetricsData
      data={data}
      filters={{
        advanced: {
          enabled: true,
          fields: [
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: ['active', 'inactive', 'pending']
            },
            {
              key: 'name',
              label: 'Name',
              type: 'text',
              placeholder: 'Search...'
            }
          ]
        }
      }}
    />
  );
}
```

### Using Both Advanced and Custom Filters

```javascript
<MetricsData
  data={data}
  filters={{
    advanced: {
      enabled: true,
      fields: [
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: ['active', 'inactive', 'pending', 'completed']
        },
        {
          key: 'date',
          label: 'Date',
          type: 'date'
        },
        {
          key: 'priority',
          label: 'Priority',
          type: 'radio',
          options: ['low', 'medium', 'high']
        }
      ]
    },
    custom: {
      enabled: true,
      fields: ['name', 'status', 'priority', 'date'],
      operators: ['equals', 'contains', 'startsWith', 'greaterThan', 'lessThan']
    }
  }}
/>
```

### Only Custom Filter

```javascript
<MetricsData
  data={data}
  filters={{
    custom: {
      enabled: true,
      fields: ['name', 'email', 'status'],
      operators: ['equals', 'notEquals', 'contains']
    }
  }}
/>
```

### No Filters (Default Behavior)

```javascript
// When filters prop is not provided or is null,
// no filter UI is shown - component works as before
<MetricsData
  data={data}
/>
```

## Filtering Logic

### Advanced Filter
- Each field is evaluated independently
- All field criteria must be met (AND logic)
- Empty values are ignored
- Case-insensitive for text fields
- Handles null/undefined values safely

### Custom Filter
- Rules are evaluated sequentially
- Each rule can use AND/OR condition
- First rule has no condition
- Empty rules are ignored
- Supports complex rule chains

### Filter Order
1. Apply keyword search (existing functionality)
2. Apply option filter (existing functionality)  
3. Apply date filter (existing functionality)
4. Apply Advanced Filters
5. Apply Custom Filters
6. Apply sorting
7. Apply pagination

## Existing Functionality Preserved

All existing MetricsData features continue to work:
- ✅ Column generation and customization
- ✅ Sorting and multi-column display
- ✅ Pagination
- ✅ Table, Grid, and Pipeline views
- ✅ Action buttons and bulk actions
- ✅ Status mapping and progress bars
- ✅ Media tiles and custom renders
- ✅ Header and footer components
- ✅ Theme customization
- ✅ All existing `filterStyle` options

## Performance Considerations

- Filters are computed with `useMemo` to avoid unnecessary recalculations
- Filter functions are memoized to prevent function recreation
- Dependency arrays are optimized for performance
- Handles large datasets efficiently

## Browser Compatibility

- Modern browsers (ES6 support required)
- Works with React 16.8+ (hooks support)
- No external filter libraries required

## Troubleshooting

### Filters not appearing
- Check that `filters.advanced.enabled` or `filters.custom.enabled` is `true`
- Verify the `filters` prop is properly structured

### Filtering not working
- Ensure field `key` values match data property names
- Check that operator names are valid
- Verify data types match operator expectations

### Performance issues
- Consider limiting number of rules in Custom Filter
- Break large datasets into smaller chunks
- Use pagination with filters

## Notes

- Filters do not persist between page reloads (manage state externally if needed)
- Filter panels use fixed positioning (may overlap with scrollable content in some cases)
- All filtering is case-insensitive for string comparisons
- Numeric comparisons convert values to numbers before comparing

---

**Version**: 1.0.0  
**Last Updated**: May 2024  
**Component**: MetricsData  
**Status**: Production Ready
