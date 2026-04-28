import React, { useEffect, useMemo, useState } from 'react';
import { statusMap as defaultStatusMap } from './status-map';
import './metrics-data.component.css';
import './views/metrics-data.pipeline.css';

let uniqueCounter = 0;

function toLabel(key) {
  if (!key) return '';
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
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
    title,
    sub,
    progressBy,
    mediaImage = '',
    idPrefix,
    statusMap = defaultStatusMap,
    valueLenthColumns = [],
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
  const [imageLoadFailedMap, setImageLoadFailedMap] = useState({});

  const columns = useMemo(() => {
    let generated = Array.isArray(propColumns) ? propColumns : [];
    if ((generated.length === 0 || generated.every(c => !c)) && autoGenerateColumns && data.length > 0) {
      generated = Object.keys(data[0])
        .filter(key => !excludeColumns.includes(key))
        .map(key => ({ key, label: toLabel(key) }));
    }
    if (showActions && actionButtons.length > 0 && !generated.some(c => c.key === 'actions')) {
      generated = [...generated, { key: 'actions', label: 'Actions' }];
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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedOption, selectedDate]);

  const viewButtons = useMemo(() => {
    const types = Array.isArray(viewTypes) && viewTypes.length > 0 ? viewTypes : showViewTypes ? ['table', 'grid', 'pipeline'] : [];
    return types.map(vt => {
      if (typeof vt === 'string') {
        return {
          label: vt,
          action: vt.toLowerCase(),
          targetId: `${internalIdPrefix}-view-${vt.toLowerCase()}`,
          tooltip: `${vt} View`,
          className: `view-btn view-btn-${vt.toLowerCase()}`,
        };
      }
      return vt;
    });
  }, [viewTypes, showViewTypes, internalIdPrefix]);

  const handleSortBy = key => {
    if (!sorting) return;
    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleSelectRow = (row, checked) => {
    setSelectedRows(prev => {
      if (checked) {
        return [...prev, row];
      }
      return prev.filter(item => item !== row);
    });
  };

  const handleToggleAllRows = checked => {
    setSelectedRows(checked ? [...pagedData] : []);
  };

  const isAllSelected = pagedData.length > 0 && selectedRows.length === pagedData.length;

  const handleActionClick = (btn, row) => {
    btn?.action?.(row);
    onRowAction({ action: btn?.label || '', row });
  };

  const handleDropdownClick = (option, btn, row) => {
    if (btn?.dropdownAction) {
      btn.dropdownAction(option, row);
    }
    setDropdownShownIndex(null);
  };

  const getStatusClass = status => {
    const color = statusMap?.[String(status).toLowerCase()] || 'info';
    return `metrics-tag ${color}`;
  };

  const getProgressClass = status => {
    const color = statusMap?.[String(status).toLowerCase()] || 'info';
    return `progress-bar ${color}`;
  };

  const getValue = (row, key) => {
    const value = row?.[key];
    return value !== undefined && value !== null ? String(value) : '-';
  };

  const shouldApplyValueLength = key => Array.isArray(valueLenthColumns) && valueLenthColumns.includes(key);

  const getRowProgress = row => {
    if (!row) return null;
    const value = row.progress ?? row.percentage ?? row.percent;
    const num = Number(value);
    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
  };

  const progressValue = useMemo(() => {
    if (!progressBy || !filterBy || !data.length) return 0;
    const statusToCheck = selectedOption || progressBy;
    const total = data.length;
    const match = data.filter(item => item?.[filterBy] === statusToCheck).length;
    return total ? Math.round((match / total) * 100) : 0;
  }, [data, selectedOption, progressBy, filterBy]);

  const renderTableCell = (row, column, rowIndex) => {
    if (column.key === 'mediaTile') {
      const status = String(row.status || '').toLowerCase();
      const isChecked = selectedRows.includes(row);
      const imageFailed = imageLoadFailedMap[row?.id || row?.name] === true;
      return (
        <div className="metrics-group">
          <div className="checkbox-wrapper">
            <input
              className="inp-cbx"
              id={`${internalIdPrefix}-cbx-${rowIndex}`}
              type="checkbox"
              checked={isChecked}
              onChange={e => handleSelectRow(row, e.target.checked)}
            />
            <label className="cbx" htmlFor={`${internalIdPrefix}-cbx-${rowIndex}`}>
              <div className="checkbox">
                <svg width="12px" height="10px" viewBox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
              </div>
            </label>
          </div>
          <div className="media-tile">
            <div className={`media-img ${status}`}>
              {row.mediaTile && !imageFailed ? (
                <img
                  className="img-fluid"
                  src={row.mediaTile || mediaImage}
                  alt="Media"
                  onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))}
                />
              ) : mediaImage ? (
                <img
                  className="img-fluid"
                  src={mediaImage}
                  alt="Media fallback"
                  onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))}
                />
              ) : (
                <span className="letter-fallback">{String(row.name || '??').substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="media-details">
              <p className="name text-dark">{row.name || 'Unknown'}</p>
              <p className="text-muted">{row.source || 'No Information'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (column.key === 'status') {
      return <span className={getStatusClass(row.status)}>{getValue(row, column.key)}</span>;
    }

    if (column.key === 'actions') {
      return (
        <div className="metrics-btn-group sm align-right">
          {actionButtons.map((btn, buttonIndex) => (
            <React.Fragment key={buttonIndex}>
              {!btn.isDropdown && (
                <button
                  className={`metrics-btn ${btn.className || ''}`}
                  type="button"
                  title={btn.tooltip}
                  onClick={() => handleActionClick(btn, row)}
                >
                  {btn.icon && <i className={btn.icon} />}
                  {btn.label}
                </button>
              )}
              {btn.isDropdown && (
                <div className="metrics-dropdown metrics-btn">
                  <button
                    className={`metrics-btn no-bg metrics-btn-toggle ${btn.className || ''}`}
                    type="button"
                    title={btn.tooltip}
                    onClick={e => {
                      e.stopPropagation();
                      setDropdownShownIndex(prev => (prev === `${rowIndex}-${buttonIndex}` ? null : `${rowIndex}-${buttonIndex}`));
                    }}
                  >
                    {btn.label}
                  </button>
                  <ul className={`dropdown-menu ${dropdownShownIndex === `${rowIndex}-${buttonIndex}` ? 'show' : ''}`}>
                    {btn.options?.map(option => (
                      <li key={option}>
                        <button type="button" className="dropdown-item" onClick={() => handleDropdownClick(option, btn, row)}>
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <span className={`value ${shouldApplyValueLength(column.key) ? 'value-lenth' : ''}`} title={shouldApplyValueLength(column.key) ? getValue(row, column.key) : undefined}>
        {getValue(row, column.key)}
      </span>
    );
  };

  return (
    <div className={`metrics-data ${variant} ${isCollapsed ? 'collapsed' : ''}`.trim()}>
      {metricsHeader && (
        <div className="metrics-header">
          <div className="metrics-container">
            <div className="metrics-group gap">
              <h6 className="table-title">
                {icon && <i className={`title-icon ${icon}`} />}
                {title || 'Metrics Data'}
                {sub && <span className="text-muted">{sub}</span>}
              </h6>
              {filterStyle.includes('tabs') && (
                <ul className="nav metrics-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${selectedOption === '' ? 'active' : ''}`} type="button" onClick={() => setSelectedOption('')}>
                      All
                    </button>
                  </li>
                  {searchOptions.map(option => (
                    <li className="nav-item" role="presentation" key={option}>
                      <button className={`nav-link ${selectedOption === option ? 'active' : ''}`} type="button" onClick={() => setSelectedOption(option)}>
                        <span className="metrics-badge">{filteredData.filter(item => item?.[filterBy] === option).length}</span>
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="metrics-group gap">
              {filterStyle.includes('dropdown') && filterBy && (
                <select className="metrics-select" value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                  <option value="">All</option>
                  {searchOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {filterStyle.includes('keyword') && (
                <input className="metrics-input" type="text" placeholder="Search..." value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
              )}
              {filterStyle.includes('date') && (
                <button className="metrics-btn" type="button" onClick={() => setDatePicker(prev => !prev)}>
                  {selectedDate.toLocaleDateString()}
                </button>
              )}
              {datePicker && (
                <div className="date-picker">
                  <div className="metrics-btn-group align-justify">
                    <input className="metrics-select" type="date" value={selectedDate.toISOString().slice(0, 10)} onChange={e => setSelectedDate(new Date(e.target.value))} />
                  </div>
                  <div className="metrics-btn-group footer align-right">
                    <button className="metrics-btn" type="button" onClick={() => setDatePicker(false)}>Close</button>
                  </div>
                </div>
              )}
              {viewButtons.length > 0 && (
                <div className="metrics-btn-group">
                  {viewButtons.map(button => (
                    <button key={button.targetId} className={`metrics-btn ${button.className}`} type="button" title={button.tooltip} onClick={() => setCurrentViewType(button.action)}>
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
              {headerButtons.length > 0 && (
                <div className="metrics-btn-group">
                  {headerButtons.map((button, index) => (
                    <button key={index} className={`metrics-btn ${button.className || ''}`} type="button" title={button.tooltip} onClick={() => button.action?.()}>
                      {button.icon && <i className={button.icon} />}
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
              {collapsible && (
                <button className="metrics-btn" type="button" onClick={() => setIsCollapsed(prev => !prev)}>
                  {isCollapsed ? 'Expand' : 'Collapse'}
                </button>
              )}
            </div>
          </div>
          {progressBy && (
            <div className="progress">
              <div className={getProgressClass(progressBy)} role="progressbar" style={{ width: `${progressValue}%` }} aria-valuenow={progressValue} aria-valuemin="0" aria-valuemax="100">
                <p className="metrics-tag">{progressValue}%</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`metrics-body view-${currentViewType}`}>
        {currentViewType === 'table' && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.key} onClick={() => handleSortBy(column.key)} style={{ cursor: sorting ? 'pointer' : 'default' }}>
                      <div className="sorting-group">
                        {column.key === columns[0]?.key && actionButtons.length > 0 && (
                          <div className="checkbox-wrapper">
                            <input className="inp-cbx" id={`${internalIdPrefix}-cbx-header`} type="checkbox" checked={isAllSelected} onChange={e => handleToggleAllRows(e.target.checked)} />
                            <label className="cbx" htmlFor={`${internalIdPrefix}-cbx-header`}>
                              <div className="checkbox">
                                <svg width="12px" height="10px" viewBox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg>
                              </div>
                            </label>
                          </div>
                        )}
                        <span>{column.label}</span>
                        {sorting && sortKey === column.key && <span>{sortAsc ? ' ↑' : ' ↓'}</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedData.length > 0 ? pagedData.map((row, rowIndex) => (
                  <tr key={row.id ?? rowIndex} className={selectedRows.includes(row) ? 'dynamic-row' : ''}>
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
            </table>
          </div>
        )}
        {currentViewType === 'grid' && (
          <div className="grid-container">
            {filteredData.length > 0 ? filteredData.map((row, index) => {
              const progress = getRowProgress(row);
              const status = String(row.status || '').toLowerCase();
              const imageFailed = imageLoadFailedMap[row?.id || row?.name] === true;
              return (
                <div className="metrics-card" key={row.id ?? index}>
                  <div className="metrics-card-header">
                    <div className="media-tile">
                      <div className={`media-img ${status}`}>
                        {row.mediaTile && !imageFailed ? (
                          <img className="img-fluid" src={row.mediaTile || mediaImage} alt="Media" onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))} />
                        ) : mediaImage ? (
                          <img className="img-fluid" src={mediaImage} alt="Media fallback" onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))} />
                        ) : (
                          <span className="letter-fallback">{String(row.name || '??').substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="media-details">
                        <p className="name text-dark">{row.name || 'Unknown'}</p>
                        <p className="text-muted">{row.source || 'No Information'}</p>
                      </div>
                    </div>
                    <span className={getStatusClass(row.status)}>{row.status || 'N/A'}</span>
                  </div>
                  <div className="card-body">
                    {progress != null && (
                      <div className="pipeline-progress">
                        <div className="progress">
                          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                            {progress}%
                          </div>
                        </div>
                      </div>
                    )}
                    {row.date && <div className="pipeline-date">{new Date(row.date).toLocaleDateString()}</div>}
                    {row.description && <p className="description">{row.description}</p>}
                  </div>
                  <div className="grid-card-footer">
                    <div className="metrics-btn-group sm align-right">
                      {actionButtons.map((btn, buttonIndex) => (
                        <button key={buttonIndex} className={`metrics-btn ${btn.className || ''}`} type="button" title={btn.tooltip} onClick={() => handleActionClick(btn, row)}>
                          {btn.icon && <i className={btn.icon} />}
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p style={{ padding: 16 }}>No records found.</p>
            )}
          </div>
        )}
        {currentViewType === 'pipeline' && (
          <div className="view-pipeline">
            <div className="pipeline-container">
              {Object.entries(
                filteredData.reduce((groups, row) => {
                  const status = String(row.status || 'default').toLowerCase();
                  if (!groups[status]) groups[status] = [];
                  groups[status].push(row);
                  return groups;
                }, {})
              ).map(([status, rows]) => (
                <div className="pipeline-column" key={status}>
                  <div className={`metrics-headers ${status}`}>
                    <h3>{toLabel(status)} ({rows.length})</h3>
                  </div>
                  <div className="pipeline-body">
                    {rows.map((row, index) => {
                      const progress = getRowProgress(row);
                      const imageFailed = imageLoadFailedMap[row?.id || row?.name] === true;
                      return (
                        <div className="metrics-card" key={row.id ?? index}>
                          <div className="metrics-card-header">
                            <div className="media-tile">
                              <div className={`media-img ${status}`}>
                                {row.mediaTile && !imageFailed ? (
                                  <img
                                    className="img-fluid"
                                    src={row.mediaTile || mediaImage}
                                    alt="Media"
                                    onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))}
                                  />
                                ) : mediaImage ? (
                                  <img
                                    className="img-fluid"
                                    src={mediaImage}
                                    alt="Media fallback"
                                    onError={() => setImageLoadFailedMap(prev => ({ ...prev, [row?.id || row?.name]: true }))}
                                  />
                                ) : (
                                  <span className="letter-fallback">{String(row.name || '??').substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div className="media-details">
                                <p className="name text-dark">{row.name || 'Unknown'}</p>
                                <p className="text-muted">{row.source || 'No Information'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            {progress != null && (
                              <div className="pipeline-progress">
                                <div className="progress">
                                  <div className={getProgressClass(row.status)} role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                                    {progress}%
                                  </div>
                                </div>
                              </div>
                            )}
                            {row.date && <div className="pipeline-date">{new Date(row.date).toLocaleDateString()}</div>}
                            {row.description && <p className="description">{row.description}</p>}
                          </div>
                          <div className="grid-card-footer">
                            <div className="metrics-btn-group sm align-right">
                              {actionButtons.map((btn, buttonIndex) => (
                                <button key={buttonIndex} className={`metrics-btn ${btn.className || ''}`} type="button" title={btn.tooltip} onClick={() => handleActionClick(btn, row)}>
                                  {btn.icon && <i className={btn.icon} />}
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showFooter && paginated && (
        <div className="metrics-footer metrics-btn-group align-center" style={{ marginTop: 12 }}>
          <button className="metrics-btn" type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
            Previous
          </button>
          <span style={{ padding: '0 12px', alignSelf: 'center' }}>Page {currentPage} / {totalPages}</span>
          <button className="metrics-btn" type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
