import React, { useMemo, useState } from "react";

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M7.646 4.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.207 2.354 10.854a.5.5 0 0 1-.708-.708l6-6z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
}

export default function FilterComponent({
  data = [],
  fields = [],
  onApply,
  onReset,
  initialFilters = {},
  theme = {},
  idPrefix = "filter",
}) {
  const customFieldList = useMemo(() => {
    if (!Array.isArray(fields) || fields.length === 0) return [];
    return fields.map((field) => ({
      type: field.type || "text",
      options: Array.isArray(field.options) ? field.options : [],
      ...field,
    }));
  }, [fields]);

  const [filters, setFilters] = useState(() => ({
    search: "",
    checkboxes: {},
    radios: {},
    dropdowns: {},
    dateRange: { from: "", to: "" },
    ...initialFilters,
  }));

  const [expandedSections, setExpandedSections] = useState({
    search: true,
    checkboxes: true,
    radios: true,
    dropdowns: true,
    dateRange: true,
    customFields: true,
  });

  const hasCustomFields = customFieldList.length > 0;

  const getUniqueValues = (fieldKey) =>
    Array.from(
      new Set(data.map((item) => item?.[fieldKey]).filter(Boolean)),
    ).sort();

  const filterOptions = useMemo(() => {
    const options = {
      checkboxes: {},
      radios: {},
      dropdowns: {},
    };

    if (hasCustomFields) {
      customFieldList.forEach((field) => {
        const values =
          field.options && field.options.length > 0
            ? field.options
            : getUniqueValues(field.key);

        if (field.type === "checkbox") {
          options.checkboxes[field.key] = values;
        }

        if (field.type === "radio") {
          options.radios[field.key] = values;
        }

        if (field.type === "select") {
          options.dropdowns[field.key] = values;
        }
      });

      return options;
    }

    const defaultFields = ["status", "category", "priority", "location"];
    defaultFields.forEach((field) => {
      const uniqueValues = [
        ...new Set(data.map((item) => item?.[field]).filter(Boolean)),
      ].sort();
      options.checkboxes[field] = uniqueValues;
      options.radios[field] = uniqueValues;
      options.dropdowns[field] = uniqueValues;
    });

    return options;
  }, [customFieldList, data, getUniqueValues, hasCustomFields]);

  const updateFilter = (type, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]:
        type === "checkboxes" || type === "radios" || type === "dropdowns"
          ? { ...prev[type], [key]: value }
          : value,
    }));
  };

  const updateField = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCheckbox = (field, value) => {
    const current = filters[field] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const selectRadio = (field, value) => {
    updateField(field, value);
  };

  const selectDropdown = (field, value) => {
    updateField(field, value);
  };

  const updateDateRange = (key, value) => {
    setFilters((prev) => ({
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
      search: "",
      checkboxes: {},
      radios: {},
      dropdowns: {},
      dateRange: { from: "", to: "" },
      ...initialFilters,
    };
    setFilters(resetState);
    onReset?.(resetState);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    Object.values(filters.checkboxes).forEach((arr) => (count += arr.length));
    Object.values(filters.radios).forEach((val) => val && count++);
    Object.values(filters.dropdowns).forEach((val) => val && count++);
    if (filters.dateRange.from || filters.dateRange.to) count++;

    if (hasCustomFields) {
      customFieldList.forEach((field) => {
        const value = filters[field.key];
        if (Array.isArray(value)) {
          count += value.length;
        } else if (value !== undefined && value !== null && value !== "") {
          count++;
        }
      });
    }

    return count;
  };

  const renderFieldControl = (field) => {
    const value = filters[field.key] ?? "";
    const values =
      field.options && field.options.length > 0
        ? field.options
        : getUniqueValues(field.key);

    switch (field.type) {
      case "select":
        return (
          <select
            id={`${idPrefix}-field-${field.key}`}
            className="metrics-select"
            value={value}
            onChange={(e) => selectDropdown(field.key, e.target.value)}
          >
            <option value="">All</option>
            {values.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="radio-group" role="radiogroup">
            {values.map((option) => (
              <div key={option} className="metrics-radio">
                <input
                  className="inp-radio"
                  id={`${idPrefix}-radio-${field.key}-${option}`}
                  type="radio"
                  name={`${idPrefix}-radio-${field.key}`}
                  value={option}
                  checked={value === option}
                  onChange={() => selectRadio(field.key, option)}
                />
                <label
                  className="radio-label"
                  htmlFor={`${idPrefix}-radio-${field.key}-${option}`}
                >
                  <div className="radio">
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                  </div>
                  <span>{option}</span>
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="checkbox-group" role="group">
            {values.map((option) => (
              <div key={option} className="metrics-checkbox">
                <input
                  className="inp-cbx"
                  id={`${idPrefix}-checkbox-${field.key}-${option}`}
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={() => toggleCheckbox(field.key, option)}
                />
                <label
                  className="cbx"
                  htmlFor={`${idPrefix}-checkbox-${field.key}-${option}`}
                >
                  <div className="checkbox">
                    <svg width="12px" height="10px" viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                  </div>
                  <span>{option}</span>
                </label>
              </div>
            ))}
          </div>
        );
      case "date":
        return (
          <input
            id={`${idPrefix}-field-${field.key}`}
            type="date"
            className="metrics-input"
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        );
      case "number":
        return (
          <input
            id={`${idPrefix}-field-${field.key}`}
            type="number"
            className="metrics-input"
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        );
      default:
        return (
          <input
            id={`${idPrefix}-field-${field.key}`}
            type="text"
            className="metrics-input"
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        );
    }
  };

  const renderCustomFieldsSection = () => (
    <div className="metrics-accordion-section">
      <button
        className="metrics-accordion-btn"
        onClick={() => toggleSection("customFields")}
        aria-expanded={expandedSections.customFields}
        aria-controls={`${idPrefix}-customfields-panel`}
      >
        <span>Advanced Filters</span>
        {expandedSections.customFields ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {expandedSections.customFields && (
        <div id={`${idPrefix}-customfields-panel`} className="accordion-body">
          {customFieldList.map((field) => (
            <div key={field.key} className="metrics-fieldset gap-sm">
              <label htmlFor={`${idPrefix}-field-${field.key}`}>
                {field.label || field.key}
              </label>
              {renderFieldControl(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActiveFilters = () => {
    const activeCount = getActiveFilterCount();
    if (activeCount === 0) return null;

    return (
      <div className="metrics-accordion-section" aria-live="polite">
        <div className="metrics-accordion-btn">
          <span>Active Filters ({activeCount}):</span>
        </div>
        <div className="accordion-body">
          <div className="metrics-group wrap">
            {filters.search && (
              <span className="metrics-tag primary">
                Search: "{filters.search}"
                <button
                  className="metrics-btn"
                  onClick={() => updateField("search", "")}
                  aria-label={`Remove search filter: ${filters.search}`}
                >
                  <CloseIcon />
                </button>
              </span>
            )}

            {Object.entries(filters.checkboxes).map(([field, values]) =>
              values.map((value) => (
                <span key={`${field}-${value}`} className="metrics-tag primary">
                  {field}: {value}
                  <button
                    className="metrics-btn"
                    onClick={() => toggleCheckbox(field, value)}
                    aria-label={`Remove ${field} filter: ${value}`}
                  >
                    <CloseIcon />
                  </button>
                </span>
              )),
            )}
          </div>
          {Object.entries(filters.radios).map(
            ([field, value]) =>
              value && (
                <span key={`${field}-${value}`} className="metrics-tag">
                  {field}: {value}
                  <button
                    className="metrics-btn"
                    onClick={() => selectRadio(field, "")}
                    aria-label={`Remove ${field} filter: ${value}`}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ),
          )}
          {Object.entries(filters.dropdowns).map(
            ([field, value]) =>
              value && (
                <span key={`${field}-${value}`} className="metrics-tag">
                  {field}: {value}
                  <button
                    className="metrics-btn"
                    onClick={() => selectDropdown(field, "")}
                    aria-label={`Remove ${field} filter: ${value}`}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ),
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <span className="metrics-tag">
              Date: {filters.dateRange.from || "Any"} to {filters.dateRange.to || "Any"}
              <button
                className="metrics-btn"
                onClick={() =>
                  updateDateRange("from", "") || updateDateRange("to", "")
                }
                aria-label="Remove date range filter"
              >
                <CloseIcon />
              </button>
            </span>
          )}
          {hasCustomFields &&
            customFieldList.map((field) => {
              const value = filters[field.key];
              if (Array.isArray(value) ? value.length === 0 : !value) {
                return null;
              }
              const display = Array.isArray(value) ? value.join(", ") : value;
              return (
                <span key={`custom-${field.key}`} className="metrics-tag">
                  {field.label || field.key}: {display}
                  <button
                    className="metrics-btn"
                    onClick={() =>
                      updateField(field.key, field.type === "checkbox" ? [] : "")
                    }
                    aria-label={`Remove ${field.label || field.key} filter: ${display}`}
                  >
                    <CloseIcon />
                  </button>
                </span>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="filter-component"
      style={{
        "--md-bg": theme.background || "#ffffff",
        "--md-surface": theme.surface || "#ffffff",
        "--md-text": theme.text || "#63634e",
        "--md-text-muted": theme.textMuted || "#888888",
        "--md-border": theme.border || "#e7e7e7",
        "--md-primary": theme.primary || "#0173df",
      }}
    >
      {renderActiveFilters()}
      {hasCustomFields ? (
        renderCustomFieldsSection()
      ) : (
        <>
          <div className="metrics-accordion-section">
            <button
              className="metrics-accordion-btn"
              onClick={() => toggleSection("search")}
              aria-expanded={expandedSections.search}
              aria-controls={`${idPrefix}-search-panel`}
            >
              <span>Search</span>
              {expandedSections.search ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedSections.search && (
              <div id={`${idPrefix}-search-panel`} className="accordion-body">
                <label htmlFor={`${idPrefix}-search`}>Keyword Search</label>
                <input
                  id={`${idPrefix}-search`}
                  type="text"
                  className="metrics-input"
                  placeholder="Search across all columns..."
                  value={filters.search}
                  onChange={(e) => updateField("search", e.target.value)}
                  aria-describedby={`${idPrefix}-search-help`}
                />
                <small id={`${idPrefix}-search-help`} className="text-muted">
                  Case-insensitive search in all fields
                </small>
              </div>
            )}
          </div>
          <div className="metrics-accordion-section">
            <button
              className="metrics-accordion-btn"
              onClick={() => toggleSection("checkboxes")}
              aria-expanded={expandedSections.checkboxes}
              aria-controls={`${idPrefix}-checkboxes-panel`}
            >
              <span>Multiple Selection Filters</span>
              {expandedSections.checkboxes ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedSections.checkboxes && (
              <div id={`${idPrefix}-checkboxes-panel`} className="accordion-body">
                {Object.entries(filterOptions.checkboxes).map(([field, options]) => (
                  <div key={field}>
                    <label className="metrics-fieldset gap-sm-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div
                      className="checkbox-group"
                      role="group"
                      aria-labelledby={`${idPrefix}-checkbox-${field}`}
                    >
                      {options.map((option) => (
                        <div key={option} className="metrics-checkbox">
                          <input
                            className="inp-cbx"
                            id={`${idPrefix}-checkbox-${field}-${option}`}
                            type="checkbox"
                            checked={(filters.checkboxes[field] || []).includes(option)}
                            onChange={() => toggleCheckbox(field, option)}
                            aria-describedby={`${idPrefix}-checkbox-${field}-${option}-label`}
                          />
                          <label
                            className="cbx"
                            htmlFor={`${idPrefix}-checkbox-${field}-${option}`}
                          >
                            <div className="checkbox">
                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                <polyline points="1.5 6 4.5 9 10.5 1" />
                              </svg>
                            </div>
                            <span id={`${idPrefix}-checkbox-${field}-${option}-label`}>
                              {option}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="metrics-accordion-section">
            <button
              className="metrics-accordion-btn"
              onClick={() => toggleSection("radios")}
              aria-expanded={expandedSections.radios}
              aria-controls={`${idPrefix}-radios-panel`}
            >
              <span>Single Selection Filters</span>
              {expandedSections.radios ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedSections.radios && (
              <div id={`${idPrefix}-radios-panel`} className="accordion-body">
                {Object.entries(filterOptions.radios).map(([field, options]) => (
                  <div key={field}>
                    <label className="metrics-fieldset gap-sm-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div
                      className="radio-group"
                      role="radiogroup"
                      aria-labelledby={`${idPrefix}-radio-${field}`}
                    >
                      {options.map((option) => (
                        <div key={option} className="metrics-radio">
                          <input
                            className="inp-radio"
                            id={`${idPrefix}-radio-${field}-${option}`}
                            type="radio"
                            name={`${idPrefix}-radio-${field}`}
                            value={option}
                            checked={filters.radios[field] === option}
                            onChange={() => selectRadio(field, option)}
                            aria-describedby={`${idPrefix}-radio-${field}-${option}-label`}
                          />
                          <label
                            className="radio-label"
                            htmlFor={`${idPrefix}-radio-${field}-${option}`}
                          >
                            <div className="radio">
                              <svg width="8" height="8" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="4" />
                              </svg>
                            </div>
                            <span id={`${idPrefix}-radio-${field}-${option}-label`}>
                              {option}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="metrics-accordion-section">
            <button
              className="metrics-accordion-btn"
              onClick={() => toggleSection("dropdowns")}
              aria-expanded={expandedSections.dropdowns}
              aria-controls={`${idPrefix}-dropdowns-panel`}
            >
              <span>Dropdown Filters</span>
              {expandedSections.dropdowns ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedSections.dropdowns && (
              <div id={`${idPrefix}-dropdowns-panel`} className="accordion-body">
                {Object.entries(filterOptions.dropdowns).map(([field, options]) => (
                  <div key={field} className="metrics-fieldset gap-sm">
                    <label htmlFor={`${idPrefix}-dropdown-${field}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <select
                      id={`${idPrefix}-dropdown-${field}`}
                      className="metrics-select"
                      value={filters.dropdowns[field] || ""}
                      onChange={(e) => selectDropdown(field, e.target.value)}
                    >
                      <option value="">All</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="metrics-accordion-section">
            <button
              className="metrics-accordion-btn"
              onClick={() => toggleSection("dateRange")}
              aria-expanded={expandedSections.dateRange}
              aria-controls={`${idPrefix}-daterange-panel`}
            >
              <span>Date Range</span>
              {expandedSections.dateRange ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {expandedSections.dateRange && (
              <div id={`${idPrefix}-daterange-panel`} className="accordion-body">
                <div className="metrics-fieldset gap-sm">
                  <label htmlFor={`${idPrefix}-date-from`}>From Date</label>
                  <input
                    id={`${idPrefix}-date-from`}
                    type="date"
                    className="metrics-input"
                    value={filters.dateRange.from}
                    onChange={(e) => updateDateRange("from", e.target.value)}
                  />
                </div>
                <div className="metrics-fieldset gap-sm">
                  <label htmlFor={`${idPrefix}-date-to`}>To Date</label>
                  <input
                    id={`${idPrefix}-date-to`}
                    type="date"
                    className="metrics-input"
                    value={filters.dateRange.to}
                    onChange={(e) => updateDateRange("to", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="metrics-filter-footer">
        <div className="metrics-btn-group">
          <button className="metrics-btn" type="button" onClick={resetFilters}>
            Reset Filters
          </button>
          <button className="metrics-btn primary" type="button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
