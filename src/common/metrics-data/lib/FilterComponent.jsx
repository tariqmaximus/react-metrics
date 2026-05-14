import React, { useState, useMemo } from 'react';


function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.207 2.354 10.854a.5.5 0 0 1-.708-.708l6-6z"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  );
}

export default function FilterComponent({
  data = [],
  onApply,
  onReset,
  initialFilters = {},
  theme = {},
  idPrefix = 'filter',
}) {
  const [filters, setFilters] = useState({
    search: '',
    checkboxes: {},
    radios: {},
    dropdowns: {},
    dateRange: { from: '', to: '' },
    ...initialFilters,
  });

  const [expandedSections, setExpandedSections] = useState({
    search: true,
    checkboxes: true,
    radios: true,
    dropdowns: true,
    dateRange: true,
  });

  // Generate options for filters based on data
  const filterOptions = useMemo(() => {
    const options = {
      checkboxes: {},
      radios: {},
      dropdowns: {},
    };

    // Example: Assume data has status, category, priority, location, date
    // In real usage, this could be passed as props
    const fields = ['status', 'category', 'priority', 'location'];

    fields.forEach(field => {
      const uniqueValues = [...new Set(data.map(item => item[field]).filter(Boolean))].sort();
      options.checkboxes[field] = uniqueValues;
      options.radios[field] = uniqueValues;
      options.dropdowns[field] = uniqueValues;
    });

    return options;
  }, [data]);

  const updateFilter = (type, key, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: type === 'checkboxes' || type === 'radios' || type === 'dropdowns'
        ? { ...prev[type], [key]: value }
        : value,
    }));
  };

  const toggleCheckbox = (field, value) => {
    const current = filters.checkboxes[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('checkboxes', field, updated);
  };

  const selectRadio = (field, value) => {
    updateFilter('radios', field, value);
  };

  const selectDropdown = (field, value) => {
    updateFilter('dropdowns', field, value);
  };

  const updateDateRange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [key]: value },
    }));
  };

  const applyFilters = () => {
    const activeFilters = { ...filters };
    onApply?.(activeFilters);
  };

  const resetFilters = () => {
    const resetState = {
      search: '',
      checkboxes: {},
      radios: {},
      dropdowns: {},
      dateRange: { from: '', to: '' },
    };
    setFilters(resetState);
    onReset?.(resetState);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    Object.values(filters.checkboxes).forEach(arr => count += arr.length);
    Object.values(filters.radios).forEach(val => val && count++);
    Object.values(filters.dropdowns).forEach(val => val && count++);
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  const renderSearchSection = () => (
    <div className="filter-section">
      <button
        className="metrics-accodian"
        onClick={() => toggleSection('search')}
        aria-expanded={expandedSections.search}
        aria-controls={`${idPrefix}-search-panel`}
      >
        <span>Search</span>
        {expandedSections.search ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.search && (
        <div id={`${idPrefix}-search-panel`} className="metrics-container">
          <div className="metrics-group">
            <label htmlFor={`${idPrefix}-search`}>Keyword Search</label>
            <input
              id={`${idPrefix}-search`}
              type="text"
              className="metrics-input"
              placeholder="Search across all columns..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              aria-describedby={`${idPrefix}-search-help`}
            />
            <small id={`${idPrefix}-search-help`} className="text-muted">
              Case-insensitive search in all fields
            </small>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckboxSection = () => (
    <div className="filter-section">
      <button
        className="metrics-accodian"
        onClick={() => toggleSection('checkboxes')}
        aria-expanded={expandedSections.checkboxes}
        aria-controls={`${idPrefix}-checkboxes-panel`}
      >
        <span>Multiple Selection Filters</span>
        {expandedSections.checkboxes ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.checkboxes && (
        <div id={`${idPrefix}-checkboxes-panel`} className="metrics-container">
          {Object.entries(filterOptions.checkboxes).map(([field, options]) => (
            <div key={field} className="metrics-group">
              <label className="metrics-group-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <div className="checkbox-group" role="group" aria-labelledby={`${idPrefix}-checkbox-${field}`}>
                {options.map(option => (
                  <div key={option} className="metrics-checkbox">
                    <input
                      className="inp-cbx"
                      id={`${idPrefix}-checkbox-${field}-${option}`}
                      type="checkbox"
                      checked={(filters.checkboxes[field] || []).includes(option)}
                      onChange={() => toggleCheckbox(field, option)}
                      aria-describedby={`${idPrefix}-checkbox-${field}-${option}-label`}
                    />
                    <label className="cbx" htmlFor={`${idPrefix}-checkbox-${field}-${option}`}>
                      <div className="checkbox">
                        <svg width="12px" height="10px" viewBox="0 0 12 10">
                          <polyline points="1.5 6 4.5 9 10.5 1" />
                        </svg>
                      </div>
                      <span id={`${idPrefix}-checkbox-${field}-${option}-label`}>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRadioSection = () => (
    <div className="filter-section">
      <button
        className="metrics-accodian"
        onClick={() => toggleSection('radios')}
        aria-expanded={expandedSections.radios}
        aria-controls={`${idPrefix}-radios-panel`}
      >
        <span>Single Selection Filters</span>
        {expandedSections.radios ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.radios && (
        <div id={`${idPrefix}-radios-panel`} className="metrics-container">
          {Object.entries(filterOptions.radios).map(([field, options]) => (
            <div key={field} className="metrics-group">
              <label className="metrics-group-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <div className="radio-group" role="radiogroup" aria-labelledby={`${idPrefix}-radio-${field}`}>
                {options.map(option => (
                  <label key={option} className="radio-item">
                    <input
                      type="radio"
                      name={`${idPrefix}-radio-${field}`}
                      value={option}
                      checked={filters.radios[field] === option}
                      onChange={() => selectRadio(field, option)}
                      aria-describedby={`${idPrefix}-radio-${field}-${option}`}
                    />
                    <span className="radio-checkmark"></span>
                    <span id={`${idPrefix}-radio-${field}-${option}`}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDropdownSection = () => (
    <div className="filter-section">
      <button
        className="metrics-accodian"
        onClick={() => toggleSection('dropdowns')}
        aria-expanded={expandedSections.dropdowns}
        aria-controls={`${idPrefix}-dropdowns-panel`}
      >
        <span>Dropdown Filters</span>
        {expandedSections.dropdowns ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.dropdowns && (
        <div id={`${idPrefix}-dropdowns-panel`} className="metrics-container">
          {Object.entries(filterOptions.dropdowns).map(([field, options]) => (
            <div key={field} className="metrics-group">
              <label htmlFor={`${idPrefix}-dropdown-${field}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <select
                id={`${idPrefix}-dropdown-${field}`}
                className="metrics-select"
                value={filters.dropdowns[field] || ''}
                onChange={(e) => selectDropdown(field, e.target.value)}
              >
                <option value="">All</option>
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateRangeSection = () => (
    <div className="filter-section">
      <button
        className="metrics-accodian"
        onClick={() => toggleSection('dateRange')}
        aria-expanded={expandedSections.dateRange}
        aria-controls={`${idPrefix}-daterange-panel`}
      >
        <span>Date Range</span>
        {expandedSections.dateRange ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.dateRange && (
        <div id={`${idPrefix}-daterange-panel`} className="metrics-container">
          <div className="metrics-group">
            <label htmlFor={`${idPrefix}-date-from`}>From Date</label>
            <input
              id={`${idPrefix}-date-from`}
              type="date"
              className="metrics-input"
              value={filters.dateRange.from}
              onChange={(e) => updateDateRange('from', e.target.value)}
            />
          </div>
          <div className="metrics-group">
            <label htmlFor={`${idPrefix}-date-to`}>To Date</label>
            <input
              id={`${idPrefix}-date-to`}
              type="date"
              className="metrics-input"
              value={filters.dateRange.to}
              onChange={(e) => updateDateRange('to', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveFilters = () => {
    const activeCount = getActiveFilterCount();
    if (activeCount === 0) return null;

    return (
      <div className="active-filters" aria-live="polite">
        <span className="active-filters-label">
          Active Filters ({activeCount}):
        </span>
        <div className="metrics-group wrap">
          {filters.search && (
            <span className="metrics-tag">
              Search: "{filters.search}"
              <button
                className="metrics-btn"
                onClick={() => updateFilter('search', '')}
                aria-label={`Remove search filter: ${filters.search}`}
              >
                <CloseIcon />
              </button>
            </span>
          )}
          {Object.entries(filters.checkboxes).map(([field, values]) =>
            values.map(value => (
              <span key={`${field}-${value}`} className="metrics-tag">
                {field}: {value}
                <button
                  className="metrics-btn"
                  onClick={() => toggleCheckbox(field, value)}
                  aria-label={`Remove ${field} filter: ${value}`}
                >
                  <CloseIcon />
                </button>
              </span>
            ))
          )}
          {Object.entries(filters.radios).map(([field, value]) =>
            value && (
              <span key={`${field}-${value}`} className="metrics-tag">
                {field}: {value}
                <button
                  className="metrics-btn"
                  onClick={() => selectRadio(field, '')}
                  aria-label={`Remove ${field} filter: ${value}`}
                >
                  <CloseIcon />
                </button>
              </span>
            )
          )}
          {Object.entries(filters.dropdowns).map(([field, value]) =>
            value && (
              <span key={`${field}-${value}`} className="metrics-tag">
                {field}: {value}
                <button
                  className="metrics-btn"
                  onClick={() => selectDropdown(field, '')}
                  aria-label={`Remove ${field} filter: ${value}`}
                >
                  <CloseIcon />
                </button>
              </span>
            )
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <span className="metrics-tag">
              Date: {filters.dateRange.from || 'Any'} to {filters.dateRange.to || 'Any'}
              <button
                className="metrics-btn"
                onClick={() => updateDateRange('from', '') || updateDateRange('to', '')}
                aria-label="Remove date range filter"
              >
                <CloseIcon />
              </button>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="filter-component" style={{
      '--md-bg': theme.background || '#ffffff',
      '--md-surface': theme.surface || '#ffffff',
      '--md-text': theme.text || '#63634e',
      '--md-text-muted': theme.textMuted || '#888888',
      '--md-border': theme.border || '#e7e7e7',
      '--md-primary': theme.primary || '#0173df',
    }}>
      {renderActiveFilters()}
      <div className="filter-sections">
        {renderSearchSection()}
        {renderCheckboxSection()}
        {renderRadioSection()}
        {renderDropdownSection()}
        {renderDateRangeSection()}
      </div>
      <div className="metrics-btn-group">
        <button className="metrics-btn" onClick={resetFilters}>
          Reset Filters
        </button>
        <button className="metrics-btn primary" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};