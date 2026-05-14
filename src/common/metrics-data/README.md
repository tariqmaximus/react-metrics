# metrics-data-table

A reusable React metrics data library built for table, grid, and pipeline reporting scenarios. The package is designed for healthcare, revenue cycle management (RCM), claim operations, and EHR dashboards.

## Package name

`metrics-data-table`

## Consumer import

```js
import { MetricsData } from 'metrics-data-table';
```

## Local development path

`src/common/metrics-data`

## Folder structure

```
src/common/metrics-data
├── examples
│   └── MetricsDataExample.jsx
├── lib
│   ├── MetricsData.jsx
│   └── package.json
├── mock
│   └── metricsData.mock.js
├── styles
│   ├── metrics-data.css
│   ├── metrics-data.table.css
│   ├── metrics-data.grid.css
│   ├── metrics-data.pipeline.css
│   ├── metrics-data.filter.css
│   └── metrics-form.controls.css
└── README.md
```

## Installation

```bash
npm install metrics-data-table
npm install bootstrap-icons
```

## Usage example

```jsx
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MetricsData } from 'metrics-data-table';

export default function App() {
  return (
    <MetricsData
      data={data}
      columns={columns}
      filterBy="status"
      filterStyle={['tabs', 'dropdown', 'keyword', 'date']}
      sorting
      paginated
      pageSize={10}
      showActions
      actionButtons={actionButtons}
      headerButtons={headerButtons}
      showViewTypes
      viewTypes={['table', 'grid', 'pipeline']}
      statusMap={statusMap}
      headerComponent={<div className="metrics-tag">Live Dashboard</div>}
      footerComponent={<div className="metrics-tag">Footer content</div>}
      customFilter={customFilter}
      theme={theme}
      onRowAction={({ action, row }) => console.log(action, row)}
    />
  );
}
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `data` | `Array<Object>` | Array of row records. |
| `columns` | `Array<Object>` | Column definitions with `key` and `label`. |
| `filterBy` | `string` | Field name used for status or dropdown filtering. |
| `filterStyle` | `Array<string>` | Filter UI modes (tabs, dropdown, keyword, date). |
| `Sorting` / `sorting` | `boolean` | Enable column sorting. |
| `pageSize` | `number` | Number of rows per page. |
| `paginated` | `boolean` | Enable pagination. |
| `showActions` | `boolean` | Show action buttons per row. |
| `actionButtons` | `Array<Object>` | Row action button definitions. |
| `headerButtons` | `Array<Object>` | Header action button definitions. |
| `viewTypes` | `Array<string>` | Available view options: `table`, `grid`, `pipeline`. |
| `showViewTypes` | `boolean|Array<string>` | Enable or configure view buttons. |
| `statusMap` | `Object` | Status theme map for custom badge styles. |
| `headerComponent` | `ReactNode` | Custom header node. |
| `footerComponent` | `ReactNode` | Custom footer node. |
| `customFilter` | `Object` | Custom filter configuration object. |
| `theme` | `Object` | Visual theme variables. |
| `onRowAction` | `function` | Callback invoked when a row action is clicked. |

## StatusMap example

```js
const statusMap = {
  pending: {
    text: '#856404',
    background: '#fff3cd',
    border: '#ffeeba',
  },
  completed: {
    text: '#155724',
    background: '#d4edda',
    border: '#c3e6cb',
  },
  failed: {
    text: '#721c24',
    background: '#f8d7da',
    border: '#f5c6cb',
  },
  active: {
    text: '#0c5460',
    background: '#d1ecf1',
    border: '#bee5eb',
  },
  inactive: {
    text: '#383d41',
    background: '#e2e3e5',
    border: '#d6d8db',
  },
  archived: {
    text: '#495057',
    background: '#e9ecef',
    border: '#dee2e6',
  },
};
```

## Mock/demo usage

The repository includes a demo mock data file and example component:

- `src/common/metrics-data/mock/metricsData.mock.js`
- `src/common/metrics-data/examples/MetricsDataExample.jsx`

Import demo values for local development:

```js
import {
  metricsDataMock,
  metricsColumns,
  metricsStatusMap,
  metricsActionButtons,
  metricsHeaderButtons,
  metricsTheme,
  metricsCustomFilter,
  emptyMetricsData,
} from './mock/metricsData.mock';
```

## Build

```bash
npm run build
```

## Publish

```bash
npm publish --access restricted
```

## Notes

- `react` and `react-dom` are required peer dependencies.
- `bootstrap-icons` is required for icon support.
- CSS is split into separate files for component layout and view modes:
  - `metrics-data.css`
  - `metrics-data.table.css`
  - `metrics-data.grid.css`
  - `metrics-data.pipeline.css`
  - `metrics-data.filter.css`
  - `metrics-form.controls.css`
- Verify table, grid, and pipeline views before publishing.

## Export

The package entry maintains the existing export shape:

```js
export { default as MetricsData } from './lib/MetricsData';
```
