import React, { useEffect, useMemo, useState } from 'react';
import { statusMap as defaultStatusMap } from './status-map';
import './metrics-data.component.css';
import './views/metrics-data.pipeline.css';

let uniqueCounter = 0;

function toLabel(key) {
  if (!key) return '';
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function CalendarIcon() {
  return (
    <svg fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16" width="16" height="16">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
  );
}

function SortIcon({ active, asc }) {
  if (active && asc) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
      </svg>
    );
  }

  if (active && !asc) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5" />
    </svg>
  );
}

function icon({ direction = 'right', rotated = false }) {
  const d = direction === 'left'
    ? 'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0'
    : 'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={rotated ? 'transition-icon rotate-90' : 'transition-icon'}>
      <path fillRule="evenodd" d={d} />
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return collapsed ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z" />
    </svg>
  );
}

export default function MetricsData(props) {
  const {
    data = [],
    columns: propColumns = [],
    autoGenerateColumns = true,
    excludeColumns = [],
    filterBy,
    filterStyle = [],
    Sorting = false,
    sorting: sortingProp,
    pageSize = 10,
    paginated = false,
    showActions = true,
    actionButtons = [],
    headerButtons = [],
    viewTypes = [],
    showViewTypes = false,
    collapsible = false,
    variant = '',
    metricsHeader = true,
    showFooter = false,
    icon,
    title = 'Metrics Data',
    sub,
    progressBy,
    mediaImage = '',
    idPrefix,
    statusMap = defaultStatusMap,
    valueLenthColumns = [],
    searchKey = 'name',
    headerComponent = null,
    footerComponent = null,
    onRowAction = () => {},
  } = props;

  const sorting = sortingProp || Sorting;
  const [internalIdPrefix] = useState(() => idPrefix || `smart-table-${uniqueCounter++}`);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePicker, setDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentViewType, setCurrentViewType] = useState('table');
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [dropdownShownIndex, setDropdownShownIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [imageLoadFailedMap, setImageLoadFailedMap] = useState({});

  const columns = useMemo(() => {
    let generated = Array.isArray(propColumns) ? propColumns : [];

    if ((generated.length === 0 || generated.every(c => !c)) && autoGenerateColumns && data.length > 0) {
      generated = Object.keys(data[0])
        .filter(key => !excludeColumns.includes(key))
        .map(key => ({ key, label: toLabel(key) }));
    }

    const actionColumnKey = generated.some(c => c.key === 'action') ? 'action' : 'actions';

    if (showActions && actionButtons.length > 0 && !generated.some(c => c.key === 'action' || c.key === 'actions')) {
      generated = [...generated, { key: actionColumnKey, label: 'Actions' }];
    }

    return generated;
  }, [propColumns, data, excludeColumns, autoGenerateColumns, showActions, actionButtons.length]);

  const searchOptions = useMemo(() => {
    if (!filterBy) return [];
    return Array.from(new Set(data.map(item => item?.[filterBy]).filter(Boolean))).sort();
  }, [data, filterBy]);

  const filteredData = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return data
      .filter(item => {
        const keywordMatch = !keyword || Object.values(item || {}).some(value => String(value || '').toLowerCase().includes(keyword));
        const optionMatch = !selectedOption || item?.[filterBy] === selectedOption;
        const dateMatch = !filterStyle.includes('date') || !datePicker || !item?.date || new Date(item.date).toDateString() === selectedDate.toDateString();
        return keywordMatch && optionMatch && dateMatch;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a?.[sortKey];
        const bVal = b?.[sortKey];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? -1 : 1);
      });
  }, [data, searchKeyword, selectedOption, filterBy, filterStyle, datePicker, selectedDate, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = paginated ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : filteredData;

  const viewButtons = useMemo(() => {
    const iconMap = {
      'table': 'bi bi-table',
      'grid': 'bi bi-grid-3x3-gap',
      'pipeline': 'bi bi-diagram-3',
      'list': 'bi bi-list',
    };

    let types = [];

    // Handle showViewTypes as array (custom view types with icon, tooltip, etc.)
    if (Array.isArray(showViewTypes) && showViewTypes.length > 0) {
      types = showViewTypes;
    }
    // Handle viewTypes prop
    else if (Array.isArray(viewTypes) && viewTypes.length > 0) {
      types = viewTypes;
    }
    // Handle showViewTypes as boolean (default view types)
    else if (showViewTypes === true) {
      types = ['table', 'grid', 'pipeline'];
    }

    return types.map(vt => {
      // If it's a string (default view type)
      if (typeof vt === 'string') {
        const action = vt.toLowerCase();
        return {
          label: toLabel(vt),
          action,
          targetId: `${internalIdPrefix}-view-${action}`,
          tooltip: `${toLabel(vt)} View`,
          className: `view-btn view-btn-${action}`,
          icon: iconMap[action] || `bi bi-${action}`,
        };
      }

      // If it's an object (custom configuration)
      const action = vt.view?.toLowerCase() || vt.action?.toLowerCase() || String(vt.label || '').toLowerCase();
      return {
        label: vt.label || toLabel(action),
        action,
        targetId: `${internalIdPrefix}-view-${action}`,
        tooltip: vt.tooltip || `${toLabel(action)} View`,
        className: vt.className || `view-btn view-btn-${action}`,
        icon: vt.icon || iconMap[action] || `bi bi-${action}`,
      };
    });
  }, [viewTypes, showViewTypes, internalIdPrefix]);

  const progressValue = useMemo(() => {
    if (!progressBy || !filterBy || !data.length) return 0;
    const statusToCheck = selectedOption || progressBy;
    const match = data.filter(item => item?.[filterBy] === statusToCheck).length;
    return Math.round((match / data.length) * 100);
  }, [data, selectedOption, progressBy, filterBy]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedOption, selectedDate]);

  const getStatusStyles = status => {
    const key = String(status || '').toLowerCase();
    const color = statusMap?.[key] || key || 'info';

    return {
      color,
      tagClass: `metrics-tag ${color}`,
      progressClass: `progress-bar ${color}`,
      statusClass: `status-${color}`,
    };
  };

  const getValue = (row, key) => {
    const value = row?.[key];
    return value !== undefined && value !== null && value !== '' ? String(value) : '-';
  };

  const shouldApplyValueLenth = key => Array.isArray(valueLenthColumns) && valueLenthColumns.includes(key);

  const getRowKey = row => row?.id || row?.[searchKey] || row?.name || JSON.stringify(row);

  const getRowProgress = row => {
    if (!row) return null;
    const value = row.progress ?? row.percentage ?? row.percent;
    const num = Number(value);
    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
  };

  const getTabCount = option => filteredData.filter(item => item?.[filterBy] === option).length;

  const getRowsByStatus = status => filteredData.filter(item => String(item?.status || '').toLowerCase() === String(status || '').toLowerCase());

  const handleSortBy = key => {
    if (!sorting) return;

    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleDropdown = (key, event) => {
    event?.stopPropagation?.();
    setDropdownShownIndex(prev => (prev === key ? null : key));
  };

  const toggleSelectRow = (row, checked) => {
    setSelectedRows(prev => {
      if (checked) return prev.includes(row) ? prev : [...prev, row];
      return prev.filter(item => item !== row);
    });
  };

  const toggleAllRows = checked => {
    setSelectedRows(checked ? [...pagedData] : []);
  };

  const isAllSelected = pagedData.length > 0 && pagedData.every(row => selectedRows.includes(row));

  const handleButtonClick = (btn, row) => {
    btn?.action?.(row);
    onRowAction({ action: btn?.label || btn?.action || '', row });
  };

  const handleBulkAction = btn => {
    btn?.action?.(selectedRows);
    onRowAction({ action: btn?.label || btn?.action || '', rows: selectedRows });
    setDropdownShownIndex(null);
  };

  const handleDropdownClick = (option, btn, row) => {
    if (btn?.dropdownAction) {
      btn.dropdownAction(option, row);
    } else if (btn?.action) {
      btn.action(row, option);
    }

    onRowAction({ action: option, row });
    setDropdownShownIndex(null);
  };

  const executeAction = button => {
    // Set current view type if action matches a view type
    const viewTypeMap = {
      'table': 'table',
      'list': 'table', // List view renders as table
      'grid': 'grid',
      'pipeline': 'pipeline',
    };

    if (viewTypeMap[button.action]) {
      setCurrentViewType(viewTypeMap[button.action]);
    }

    button?.actionHandler?.();
    button?.onClick?.();
  };

  const handleImageError = row => {
    setImageLoadFailedMap(prev => ({ ...prev, [getRowKey(row)]: true }));
  };

  const selectDate = date => {
    setSelectedDate(date);
  };

  const renderCheckbox = ({ id, checked, onChange, children }) => (
    <div className="checkbox-wrapper">
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        checked={checked}
        onClick={event => event.stopPropagation()}
        onChange={event => onChange(event.target.checked)}
      />
      <label className="cbx" htmlFor={id}>
        <div className="checkbox">
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </svg>
        </div>
        {children}
      </label>
    </div>
  );

  const renderMediaTile = (row, index, showMobileToggle = false) => {
    const rowKey = getRowKey(row);
    const imageFailed = imageLoadFailedMap[rowKey];
    const imageSrc = row.mediaTile || mediaImage;
    const statusClass = getStatusStyles(row.status).color;

    return (
      <div className="metrics-group">
        {renderCheckbox({
          id: `${internalIdPrefix}-cbx-${index}`,
          checked: selectedRows.includes(row),
          onChange: checked => toggleSelectRow(row, checked),
        })}

        <div className="media-tile">
          <div className={`media-img ${statusClass}`}>
            {imageSrc && !imageFailed ? (
              <img className="img-fluid" src={imageSrc} alt="Media Image" onError={() => handleImageError(row)} />
            ) : (
              <span className="letter-fallback">{String(row.name || '??').substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="media-details">
            <p className="name text-dark">{row.name || 'Unknown'}</p>
            <p className="text-muted">{row.source || 'No Information'}</p>
          </div>
        </div>

        {showMobileToggle && (
          <button className="metrics-btn mobile-btn" type="button" onClick={() => setActiveRowIndex(prev => (prev === index ? null : index))}>
            <icon rotated={activeRowIndex === index} />
          </button>
        )}
      </div>
    );
  };

  const renderActionButtons = (row, index) => (
    <div className="metrics-btn-group sm align-right">
      {actionButtons.map((btn, btnIndex) => {
        const dropdownKey = `${index}-${btnIndex}`;

        if (btn.isDropdown) {
          return (
            <div key={dropdownKey} className="metrics-dropdown metrics-btn">
              <button
                className={`metrics-btn no-bg metrics-btn-toggle ${btn.className || ''}`}
                type="button"
                title={btn.tooltip}
                onClick={event => toggleDropdown(dropdownKey, event)}
              >
                {btn.icon && <i className={btn.icon} />}
                {btn.label}
              </button>
              <ul className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? 'show' : ''}`}>
                {btn.options?.map(option => (
                  <li key={option}>
                    <button type="button" className="dropdown-item" onClick={() => handleDropdownClick(option, btn, row)}>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <button
            key={dropdownKey}
            className={`metrics-btn ${btn.className || ''}`}
            type="button"
            title={btn.tooltip}
            onClick={() => handleButtonClick(btn, row)}
          >
            {btn.icon && <i className={btn.icon} />}
            {btn.label}
          </button>
        );
      })}
    </div>
  );

  const renderTableCell = (row, column, rowIndex) => {
    switch (column.key) {
      case 'mediaTile':
        return renderMediaTile(row, rowIndex, true);

      case 'status':
        return <span className={getStatusStyles(row.status).tagClass}>{getValue(row, column.key)}</span>;

      case 'action':
      case 'actions':
        return renderActionButtons(row, rowIndex);

      default:
        return (
          <span
            className={`value ${shouldApplyValueLenth(column.key) ? 'value-lenth' : ''}`}
            title={shouldApplyValueLenth(column.key) ? getValue(row, column.key) : undefined}
          >
            {getValue(row, column.key)}
          </span>
        );
    }
  };

  const renderHeaderButton = (button, index, type) => {
    const dropdownKey = `${type}-${index}`;

    if (button.isDropdown) {
      return (
        <div key={button.targetId || dropdownKey} className="metrics-dropdown metrics-btn" id={button.targetId}>
          <button
            type="button"
            className={`metrics-btn no-bg metrics-btn-toggle ${button.className || ''}`}
            title={button.tooltip}
            onClick={event => toggleDropdown(dropdownKey, event)}
          >
            {button.icon && <i className={button.icon} />}
            {button.label}
          </button>
          <ul className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? 'show' : ''}`}>
            {button.options?.map(option => (
              <li key={option}>
                <button type="button" className="dropdown-item" onClick={() => handleDropdownClick(option, button, null)}>
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (type === 'view') {
      // View buttons only show icon, no label
      return (
        <button
          key={button.targetId || dropdownKey}
          type="button"
          className={`metrics-btn ${button.className || ''}`}
          id={button.targetId}
          title={button.tooltip}
          onClick={() => executeAction(button)}
        >
          {button.icon && <i className={button.icon} />}
        </button>
      );
    }

    // Header buttons show label
    return (
      <button
        key={button.targetId || dropdownKey}
        type="button"
        className={`metrics-btn ${button.className || ''}`}
        id={button.targetId}
        title={button.tooltip}
        onClick={() => button.action?.()}
      >
        {button.icon && <i className={button.icon} />}
        {button.label && <span>{button.label}</span>}
      </button>
    );
  };

  const renderDatePicker = () => {
    const value = selectedDate.toISOString().slice(0, 10);

    return (
      <div className="date-picker" style={{ minWidth: 350 }}>
        <div className="metrics-btn-group align-justify">
          <input className="metrics-select" type="date" value={value} onChange={event => selectDate(new Date(event.target.value))} />
        </div>
        <div className="metrics-btn-group footer align-right">
          <button className="metrics-btn" type="button" onClick={() => setDatePicker(false)}>Cancel</button>
          <button className="metrics-btn primary" type="button" onClick={() => setDatePicker(false)}>Confirm</button>
        </div>
      </div>
    );
  };

  const renderTableTemplate = () => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column, colIndex) => (
              <th
                key={column.key}
                onClick={() => sorting && handleSortBy(column.key)}
                className="text-nowrap text-start align-middle"
                style={{ cursor: sorting ? 'pointer' : 'default' }}
                scope="col"
              >
                <div className="sorting-group">
                  {colIndex === 0 && renderCheckbox({
                    id: `${internalIdPrefix}-cbx-header`,
                    checked: isAllSelected,
                    onChange: toggleAllRows,
                    children: selectedRows.length > 1 && (
                      <div className="metrics-dropdown">
                        <button className="metrics-btn no-bg" type="button" onClick={event => toggleDropdown('bulk', event)}>
                          <ThreeDotsIcon />
                        </button>
                        <ul className={`dropdown-menu ${dropdownShownIndex === 'bulk' ? 'show' : ''}`}>
                          {actionButtons.map(btn => (
                            <li key={btn.label}>
                              <button className="dropdown-item" type="button" onClick={() => handleBulkAction(btn)}>
                                {btn.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  })}

                  <span>{column.label}</span>
                  {sorting && <SortIcon active={sortKey === column.key} asc={sortAsc} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pagedData.length > 0 ? pagedData.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex} className={activeRowIndex === rowIndex || selectedRows.includes(row) ? 'dynamic-row' : ''}>
              {columns.map(column => (
                <td key={`${rowIndex}-${column.key}`}>{renderTableCell(row, column, rowIndex)}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-3">No records found.</td>
            </tr>
          )}
        </tbody>

        {paginated && (
          <tfoot>
            <tr>
              <td>{footerComponent}</td>
              <td colSpan={Math.max(columns.length - 1, 1)}>
                <div className="pagination metrics-btn-group align-right">
                  <button className="metrics-btn" type="button" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
                  </button>
                  <span className="metrics-btn">Page {currentPage} of {totalPages}</span>
                  <button className="metrics-btn" type="button" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  const renderCard = (row, index, footerClass = 'grid-card-footer') => {
    const progress = getRowProgress(row);
    const imageFailed = imageLoadFailedMap[getRowKey(row)];
    const imageSrc = row.mediaTile || mediaImage;
    const statusStyles = getStatusStyles(row.status);

    return (
      <div className={`metrics-card ${statusStyles.statusClass}`} key={row.id ?? index}>
        <div className="metrics-card-header">
          <div className="media-tile">
            <div className={`media-img ${statusStyles.color}`}>
              {imageSrc && !imageFailed ? (
                <img className="img-fluid" src={imageSrc} alt="Media Image" onError={() => handleImageError(row)} />
              ) : (
                <span className="letter-fallback">{String(row.name || '??').substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="media-details">
              <p className="name text-dark">{row.name || 'Unknown'}</p>
              <p className="text-muted">{row.source || 'No Information'}</p>
            </div>
          </div>
          <span className={statusStyles.tagClass}>{row.status || 'N/A'}</span>
        </div>

        <div className="card-body">
          <div className="metrics-card-meta">
            {progress !== null && (
              <div className="pipeline-progress">
                <div className="progress">
                  <div className={statusStyles.progressClass} role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                  <p className='metrics-tag'>{progress}%</p>
                  </div>
                </div>
              </div>
            )}
            {row.date && <div className="pipeline-date">{new Date(row.date).toLocaleDateString()}</div>}
          </div>
          {row.description && <p className="description">{row.description}</p>}
        </div>

        <div className={footerClass}>{renderActionButtons(row, index)}</div>
      </div>
    );
  };

  const renderGridTemplate = () => (
    <div className="grid-container">
      {filteredData.length > 0 ? filteredData.map((row, index) => renderCard(row, index)) : <div className="grid-empty">No records found.</div>}
    </div>
  );

  const renderPipelineTemplate = () => {
    const statuses = searchOptions.length > 0
      ? searchOptions
      : Array.from(new Set(filteredData.map(row => row.status).filter(Boolean)));

    return (
      <div className="pipeline-container">
        {statuses.map(status => {
          const columnData = getRowsByStatus(status);

          return (
            <div className="pipeline-column" key={status}>
              <div className={`metrics-headers ${String(status || '').toLowerCase()}`}>
                <h3>{toLabel(status)}</h3>
                <span className={`metrics-tag ${getStatusStyles(status).color}`}>{columnData.length}</span>
              </div>
              <div className="pipeline-body">
                {columnData.length > 0
                  ? columnData.map((row, index) => renderCard(row, index, 'metrics-card-footer'))
                  : <div className="pipeline-empty">No items</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCurrentTemplate = () => {
    if (currentViewType === 'grid') return renderGridTemplate();
    if (currentViewType === 'pipeline') return renderPipelineTemplate();
    return renderTableTemplate();
  };

  return (
    <div className={`metrics-data ${variant} ${isCollapsed ? 'collapsed' : ''}`.trim()}>
      {metricsHeader && (
        <div className="metrics-header">
          <div className="metrics-container">
            <div className="metrics-group gap">
              <h6 className="table-title">
                {icon && <i className={`title-icon ${icon}`} />}
                {title}
                {sub && <span className="text-muted">{sub}</span>}
              </h6>

              {filterStyle.includes('tabs') && currentViewType !== 'pipeline' && (
                <ul className="nav metrics-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${selectedOption === '' ? 'active' : ''}`} type="button" role="tab" onClick={() => setSelectedOption('')}>
                      All
                    </button>
                  </li>
                  {searchOptions.map(option => (
                    <li className="nav-item" role="presentation" key={option}>
                      <button className={`nav-link ${selectedOption === option ? 'active' : ''}`} type="button" role="tab" onClick={() => setSelectedOption(option)}>
                        <span className={`metrics-badge ${getStatusStyles(option).tagClass}`}>{getTabCount(option)}</span>
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="metrics-group gap">
              {headerComponent}

              <div className="metrics-group gap">
                <div className="metrics-btn-group">
                  {filterStyle.includes('dropdown') && filterBy && (
                    <select className="metrics-select" value={selectedOption} onChange={event => setSelectedOption(event.target.value)}>
                      <option value="">All</option>
                      {searchOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  )}

                  {filterStyle.includes('keyword') && (
                    <input
                      type="text"
                      className="metrics-input"
                      placeholder="Search..."
                      value={searchKeyword}
                      onChange={event => setSearchKeyword(event.target.value)}
                    />
                  )}

                  {filterStyle.includes('date') && (
                    <>
                      <button className="metrics-btn" type="button" onClick={() => setDatePicker(prev => !prev)} style={{ minWidth: 120 }}>
                        <CalendarIcon />
                        <span>{selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </button>

                      {datePicker && renderDatePicker()}
                    </>
                  )}
                </div>

                <div className="metrics-btn-group">
                  {viewButtons.map((button, index) => renderHeaderButton(button, index, 'view'))}
                </div>

                <div className="metrics-btn-group">
                  {headerButtons.map((button, index) => renderHeaderButton(button, index, 'header'))}
                </div>

                <div className="metrics-btn-group">
                  {collapsible && (
                    <button className="metrics-btn" type="button" onClick={() => setIsCollapsed(prev => !prev)}>
                      <CollapseIcon collapsed={isCollapsed} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {progressBy && (
            <div className="progress">
              <div
                className={getStatusStyles(selectedOption || progressBy).progressClass}
                role="progressbar"
                style={{ width: `${progressValue}%` }}
                aria-valuenow={progressValue}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <p className="metrics-tag">{progressValue}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`metrics-body view-${currentViewType}`}>
        {renderCurrentTemplate()}
      </div>

    
    </div>
  );
}
