import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../styles/metrics-data.component.css";
import FilterComponent from "./FilterComponent";

const KNOWN_VIEWS = ["table", "grid", "pipeline"];

let uniqueCounter = 0;

function toLabel(key) {
  if (!key) return "";

  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function CalendarIcon() {
  return (
    <svg
      fill="currentColor"
      className="bi bi-calendar"
      viewBox="0 0 16 16"
      width="16"
      height="16"
    >
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
    </svg>
  );
}

function SortIcon({ active, asc }) {
  if (active && asc) {
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
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
        />
      </svg>
    );
  }

  if (active && !asc) {
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
          d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
        />
      </svg>
    );
  }

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
        d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
      />
    </svg>
  );
}

function ArrowIcon({ direction = "right", rotated = false }) {
  const d =
    direction === "left"
      ? "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
      : "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={rotated ? "transition-icon rotate-90" : "transition-icon"}
    >
      <path fillRule="evenodd" d={d} />
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-three-dots-vertical"
      viewBox="0 0 16 16"
    >
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return collapsed ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z"
      />
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
    showViewSwitcher = true,
    defaultView = "table",
    view,
    collapsible = false,
    variant = "",
    metricsHeader = true,
    showFooter = false,
    icon,
    title = "Metrics Data",
    sub,
    progressBy,
    showKpis = [],
    mediaImage = "",
    mediaDetailsRenderer,
    mediaDetailsKeys = ["name", "source"],
    idPrefix,
    theme = {},
    statusMap = {},
    valueLengthColumns = [],
    searchKey = "name",
    headerComponent = null,
    footerComponent = null,
    onRowAction = () => {},
    customFilter = null,
  } = props;

  const sorting = sortingProp || Sorting;

  const normalizedKpis = useMemo(() => {
    if (!Array.isArray(showKpis) || showKpis.length === 0) return [];

    return showKpis.map((item, index) => {
      const cardKey = String(item.card || item.label || "")
        .toLowerCase()
        .trim();
      const label = item.label || toLabel(cardKey);
      const value =
        item.value !== undefined
          ? item.value
          : data.filter((row) =>
              Object.values(row || {}).some(
                (value) =>
                  String(value || "")
                    .toLowerCase()
                    .trim() === cardKey,
              ),
            ).length;
      const change = item.change;
      const changeClass =
        typeof change === "string" && change.trim().startsWith("-")
          ? "negative"
          : "positive";
      const subtitle = item.subtitle || "vs. last month";

      return {
        ...item,
        cardKey,
        label,
        value,
        change,
        changeClass,
        subtitle,
        index,
      };
    });
  }, [showKpis, data]);

  const resolveViewType = useCallback((value) => {
    if (value === undefined || value === null) return null;
    const normalized = String(value).toLowerCase();
    return KNOWN_VIEWS.includes(normalized) ? normalized : null;
  }, []);

  const viewSource = useMemo(() => {
    if (Array.isArray(showViewTypes) && showViewTypes.length > 0)
      return showViewTypes;
    if (Array.isArray(viewTypes) && viewTypes.length > 0) return viewTypes;
    if (showViewTypes === true) return KNOWN_VIEWS;
    return [defaultView];
  }, [showViewTypes, viewTypes, defaultView]);

  const normalizedViewTypes = useMemo(() => {
    const candidates = Array.isArray(viewSource) ? viewSource : [];
    const values = [];

    candidates.forEach((candidate) => {
      if (typeof candidate === "string") {
        const viewType = resolveViewType(candidate);
        if (viewType) values.push(viewType);
        return;
      }

      const viewType = resolveViewType(
        candidate.view || candidate.action || candidate.label,
      );
      if (viewType) values.push(viewType);
    });

    if (values.length === 0) {
      values.push(resolveViewType(defaultView) || "table");
    }

    return Array.from(new Set(values));
  }, [viewSource, defaultView, resolveViewType]);

  const resolvedView = resolveViewType(view);
  const resolvedDefaultView = resolveViewType(defaultView) || "table";

  const [currentViewType, setCurrentViewType] = useState(() => {
    if (resolvedView && normalizedViewTypes.includes(resolvedView))
      return resolvedView;
    if (!resolvedView && normalizedViewTypes.includes(resolvedDefaultView))
      return resolvedDefaultView;
    return normalizedViewTypes[0];
  });

  useEffect(() => {
    setCurrentViewType((prev) => {
      if (resolvedView) {
        return normalizedViewTypes.includes(resolvedView)
          ? resolvedView
          : normalizedViewTypes[0];
      }
      return normalizedViewTypes.includes(prev) ? prev : normalizedViewTypes[0];
    });
  }, [resolvedView, normalizedViewTypes]);

  const canShowViewButtons =
    showViewSwitcher !== false &&
    showViewTypes !== false &&
    normalizedViewTypes.length > 1;

  const [internalIdPrefix] = useState(
    () => idPrefix || `metrics-data-${uniqueCounter++}`,
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePicker, setDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [dropdownShownIndex, setDropdownShownIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [imageLoadFailedMap, setImageLoadFailedMap] = useState({});
  const [customFilterOpen, setCustomFilterOpen] = useState(false);
  const [customFilterValues, setCustomFilterValues] = useState(
    () => customFilter?.initialValues || {},
  );

  const columns = useMemo(() => {
    let generated = Array.isArray(propColumns) ? propColumns : [];

    if (
      (generated.length === 0 || generated.every((column) => !column)) &&
      autoGenerateColumns &&
      data.length > 0
    ) {
      generated = Object.keys(data[0])
        .filter((key) => !excludeColumns.includes(key))
        .map((key) => ({ key, label: toLabel(key) }));
    }

    const actionColumnKey = generated.some((column) => column.key === "action")
      ? "action"
      : "actions";

    if (
      showActions &&
      actionButtons.length > 0 &&
      !generated.some(
        (column) => column.key === "action" || column.key === "actions",
      )
    ) {
      generated = [...generated, { key: actionColumnKey, label: "Actions" }];
    }

    // If mediaTile column is present, exclude mediaDetailsKeys as they are shown in media tile
    if (generated.some((column) => column.key === "mediaTile")) {
      generated = generated.filter(
        (column) => !mediaDetailsKeys.includes(column.key),
      );
    }

    return generated;
  }, [
    propColumns,
    data,
    excludeColumns,
    autoGenerateColumns,
    showActions,
    actionButtons.length,
    mediaDetailsKeys,
  ]);

  const searchOptions = useMemo(() => {
    if (!filterBy) return [];

    return Array.from(
      new Set(data.map((item) => item?.[filterBy]).filter(Boolean)),
    ).sort();
  }, [data, filterBy]);

  const filteredData = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return data
      .filter((item) => {
        const keywordMatch =
          !keyword ||
          Object.values(item || {}).some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(keyword),
          );

        const optionMatch =
          !selectedOption || item?.[filterBy] === selectedOption;

        const dateMatch =
          !filterStyle.includes("date") ||
          !datePicker ||
          !item?.date ||
          new Date(item.date).toDateString() === selectedDate.toDateString();

        const customFilterMatch =
          !customFilter?.fields || !Array.isArray(customFilter.fields)
            ? true
            : customFilter.fields.every((field) => {
                const filterValue = customFilterValues?.[field.key];
                if (
                  filterValue === undefined ||
                  filterValue === null ||
                  filterValue === ""
                )
                  return true;

                const rowValue = item?.[field.key];
                if (field.type === "date") {
                  return (
                    rowValue &&
                    new Date(rowValue).toDateString() ===
                      new Date(filterValue).toDateString()
                  );
                }

                if (field.type === "number") {
                  return Number(rowValue) === Number(filterValue);
                }

                if (field.type === "select") {
                  return String(rowValue) === String(filterValue);
                }

                return String(rowValue || "")
                  .toLowerCase()
                  .includes(String(filterValue || "").toLowerCase());
              });

        return keywordMatch && optionMatch && dateMatch && customFilterMatch;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;

        const aVal = a?.[sortKey];
        const bVal = b?.[sortKey];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        return sortAsc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
  }, [
    data,
    searchKeyword,
    selectedOption,
    filterBy,
    filterStyle,
    datePicker,
    selectedDate,
    sortKey,
    sortAsc,
    customFilter,
    customFilterValues,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const pagedData = paginated
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData;

  const viewButtons = useMemo(() => {
    const iconMap = {
      table: "bi bi-table",
      grid: "bi bi-grid-3x3-gap",
      pipeline: "bi bi-diagram-3",
      list: "bi bi-list",
    };

    const types = Array.isArray(viewSource) ? viewSource : [];

    return types.map((viewType) => {
      if (typeof viewType === "string") {
        const action = viewType.toLowerCase();

        return {
          label: toLabel(viewType),
          action,
          targetId: `${internalIdPrefix}-view-${action}`,
          tooltip: `${toLabel(viewType)} View`,
          className: `view-btn view-btn-${action}`,
          icon: iconMap[action] || `bi bi-${action}`,
        };
      }

      const action =
        resolveViewType(viewType.view || viewType.action || viewType.label) ||
        String(viewType.label || "").toLowerCase();

      return {
        label: viewType.label || toLabel(action),
        action,
        targetId: `${internalIdPrefix}-view-${action}`,
        tooltip: viewType.tooltip || `${toLabel(action)} View`,
        className: viewType.className || `view-btn view-btn-${action}`,
        icon: viewType.icon || iconMap[action] || `bi bi-${action}`,
      };
    });
  }, [viewSource, internalIdPrefix, resolveViewType]);

  const progressValue = useMemo(() => {
    if (!progressBy || !filterBy || !data.length) return 0;

    const statusToCheck = selectedOption || progressBy;
    const match = data.filter(
      (item) => item?.[filterBy] === statusToCheck,
    ).length;

    return Math.round((match / data.length) * 100);
  }, [data, selectedOption, progressBy, filterBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedOption, selectedDate]);

  useEffect(() => {
    setCustomFilterValues(customFilter?.initialValues || {});
  }, [customFilter?.initialValues]);

  const getStatusTheme = (status) => {
    const key = String(status || "")
      .toLowerCase()
      .trim();
    const value = statusMap?.[key];

    if (typeof value === "object" && value !== null) {
      return {
        className: "metrics-status",
        style: {
          "--md-status-text": value.text,
          "--md-status-bg": value.background,
          "--md-status-border": value.border,
        },
      };
    }

    const color = value || key || "default";

    return {
      className: color,
      style: {},
    };
  };

  const getValue = (row, key) => {
    const value = row?.[key];

    return value !== undefined && value !== null && value !== ""
      ? String(value)
      : "-";
  };

  const shouldApplyValueLength = (key) =>
    Array.isArray(valueLengthColumns) && valueLengthColumns.includes(key);

  const getRowKey = (row) =>
    row?.id || row?.[searchKey] || row?.name || JSON.stringify(row);

  const getRowProgress = (row) => {
    if (!row) return null;

    const value = row.progress ?? row.percentage ?? row.percent;
    const num = Number(value);

    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
  };

  const getTabCount = (option) =>
    filteredData.filter((item) => item?.[filterBy] === option).length;

  const getRowsByStatus = (status) =>
    filteredData.filter(
      (item) =>
        String(item?.status || "").toLowerCase() ===
        String(status || "").toLowerCase(),
    );

  const handleSortBy = (key) => {
    if (!sorting) return;

    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleDropdown = (key, event) => {
    event?.stopPropagation?.();
    setDropdownShownIndex((prev) => (prev === key ? null : key));
  };

  const toggleSelectRow = (row, checked) => {
    setSelectedRows((prev) => {
      if (checked) return prev.includes(row) ? prev : [...prev, row];

      return prev.filter((item) => item !== row);
    });
  };

  const toggleAllRows = (checked) => {
    setSelectedRows(checked ? [...pagedData] : []);
  };

  const isAllSelected =
    pagedData.length > 0 &&
    pagedData.every((row) => selectedRows.includes(row));

  const handleButtonClick = (btn, row) => {
    btn?.action?.(row);
    onRowAction({ action: btn?.label || btn?.action || "", row });
  };

  const handleBulkAction = (btn) => {
    btn?.action?.(selectedRows);
    onRowAction({
      action: btn?.label || btn?.action || "",
      rows: selectedRows,
    });
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

  const executeAction = (button) => {
    const viewTypeMap = {
      table: "table",
      list: "table",
      grid: "grid",
      pipeline: "pipeline",
    };

    if (viewTypeMap[button.action]) {
      setCurrentViewType(viewTypeMap[button.action]);
    }

    button?.actionHandler?.();
    button?.onClick?.();
  };

  const handleImageError = (row) => {
    setImageLoadFailedMap((prev) => ({ ...prev, [getRowKey(row)]: true }));
  };

  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const renderCheckbox = ({ id, checked, onChange, children }) => (
    <div className="metrics-checkbox">
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        checked={checked}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.target.checked)}
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
    const statusTheme = getStatusTheme(row.status);

    return (
      <div className="metrics-group">
        {renderCheckbox({
          id: `${internalIdPrefix}-cbx-${index}`,
          checked: selectedRows.includes(row),
          onChange: (checked) => toggleSelectRow(row, checked),
        })}

        <div className="media-tile">
          <div
            className={`media-img ${statusTheme.className}`}
            style={statusTheme.style}
          >
            {imageSrc && !imageFailed ? (
              <img
                className="img-fluid"
                src={imageSrc}
                alt="Media"
                onError={() => handleImageError(row)}
              />
            ) : (
              <span className="letter-fallback">
                {String(row.name || "??")
                  .substring(0, 1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="media-details">
            {typeof row.mediaDetailsRenderer === "function" ? (
              row.mediaDetailsRenderer(row)
            ) : typeof mediaDetailsRenderer === "function" ? (
              mediaDetailsRenderer(row)
            ) : (
              <>
                {mediaDetailsKeys.map((key, idx) => (
                  <p
                    key={key}
                    className={idx === 0 ? "name text-dark" : "text-muted"}
                  >
                    {row[key] || `No ${toLabel(key)}`}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>

        {showMobileToggle && (
          <button
            className="metrics-btn mobile-btn"
            type="button"
            onClick={() =>
              setActiveRowIndex((prev) => (prev === index ? null : index))
            }
          >
            <ArrowIcon rotated={activeRowIndex === index} />
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
                className={`metrics-btn no-bg metrics-btn-toggle ${btn.className || ""}`}
                type="button"
                title={btn.tooltip}
                onClick={(event) => toggleDropdown(dropdownKey, event)}
              >
                {btn.icon && <i className={btn.icon} />}
                {btn.label}
              </button>

              <ul
                className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? "show" : ""}`}
              >
                {btn.options?.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleDropdownClick(option, btn, row)}
                    >
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
            className={`metrics-btn ${btn.className || ""}`}
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
      case "mediaTile":
        return renderMediaTile(row, rowIndex, true);

      case "status":
        const statusTheme = getStatusTheme(row.status);
        return (
          <span
            className={
              statusTheme.className === "metrics-status"
                ? `metrics-tag metrics-status`
                : `metrics-tag ${statusTheme.className}`
            }
            style={statusTheme.style}
          >
            {getValue(row, column.key)}
          </span>
        );

      case "priority":
        const priorityTheme = getStatusTheme(row.priority);
        // Provide sensible defaults when statusMap doesn't include priority keys
        const priorityKey = String(row.priority || "")
          .toLowerCase()
          .trim();
        const defaultPriorityStyles = {
          high: {
            "--md-status-text": "var(--md-danger)",
            "--md-status-bg": "#fee2e2",
            "--md-status-border": "var(--md-danger)",
          },
          medium: {
            "--md-status-text": "var(--md-warning)",
            "--md-status-bg": "#fff7ed",
            "--md-status-border": "var(--md-warning)",
          },
          low: {
            "--md-status-text": "var(--md-success)",
            "--md-status-bg": "#ecfdf5",
            "--md-status-border": "var(--md-success)",
          },
        };

        const appliedPriorityStyle =
          priorityTheme.style && Object.keys(priorityTheme.style).length
            ? priorityTheme.style
            : defaultPriorityStyles[priorityKey] || {};

        return (
          <span
            className={`metrics-tag metrics-status`}
            style={appliedPriorityStyle}
          >
            {getValue(row, "priority")}
          </span>
        );

      case "progress":
        const progress = getRowProgress(row);
        if (progress !== null) {
          const statusTheme = getStatusTheme(row.status);
          return (
            <div className="progress" style={{ minWidth: 150 }}>
              <div
                className={`progress-bar ${statusTheme.className}`}
                role="progressbar"
                style={{ width: `${progress}%`, ...statusTheme.style }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span className="progress-text">{progress}%</span>
              </div>
            </div>
          );
        }
        return <span className="value">-</span>;

      case "action":
      case "actions":
        return renderActionButtons(row, rowIndex);

      default:
        return (
          <span
            className={`value ${shouldApplyValueLength(column.key) ? "value-length" : ""}`}
            title={
              shouldApplyValueLength(column.key)
                ? getValue(row, column.key)
                : undefined
            }
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
        <div
          key={button.targetId || dropdownKey}
          className="metrics-dropdown metrics-btn"
          id={button.targetId}
        >
          <button
            type="button"
            className={`metrics-btn no-bg metrics-btn-toggle ${button.className || ""}`}
            title={button.tooltip}
            onClick={(event) => toggleDropdown(dropdownKey, event)}
          >
            {button.icon && <i className={button.icon} />}
            {button.label}
          </button>

          <ul
            className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? "show" : ""}`}
          >
            {button.options?.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleDropdownClick(option, button, null)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (type === "view") {
      return (
        <button
          key={button.targetId || dropdownKey}
          type="button"
          className={`metrics-btn ${button.className || ""}`}
          id={button.targetId}
          title={button.tooltip}
          onClick={() => executeAction(button)}
        >
          {button.icon && <i className={button.icon} />}
        </button>
      );
    }

    return (
      <button
        key={button.targetId || dropdownKey}
        type="button"
        className={`metrics-btn ${button.className || ""}`}
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
          <input
            className="metrics-select"
            type="date"
            value={value}
            onChange={(event) => selectDate(new Date(event.target.value))}
          />
        </div>

        <div className="metrics-btn-group footer align-right">
          <button
            className="metrics-btn"
            type="button"
            onClick={() => setDatePicker(false)}
          >
            Cancel
          </button>

          <button
            className="metrics-btn primary"
            type="button"
            onClick={() => setDatePicker(false)}
          >
            Confirm
          </button>
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
                style={{ cursor: sorting ? "pointer" : "default" }}
                scope="col"
              >
                <div className="sorting-group">
                  {colIndex === 0 &&
                    renderCheckbox({
                      id: `${internalIdPrefix}-cbx-header`,
                      checked: isAllSelected,
                      onChange: toggleAllRows,
                      children: selectedRows.length > 1 && (
                        <div className="metrics-dropdown">
                          <button
                            className="metrics-btn no-bg"
                            type="button"
                            onClick={(event) => toggleDropdown("bulk", event)}
                          >
                            <ThreeDotsIcon />
                          </button>

                          <ul
                            className={`dropdown-menu ${dropdownShownIndex === "bulk" ? "show" : ""}`}
                          >
                            {actionButtons.map((btn) => (
                              <li key={btn.label}>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={() => handleBulkAction(btn)}
                                >
                                  {btn.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    })}

                  <span>{column.label}</span>
                  {sorting && (
                    <SortIcon active={sortKey === column.key} asc={sortAsc} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pagedData.length > 0 ? (
            pagedData.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={
                  activeRowIndex === rowIndex || selectedRows.includes(row)
                    ? "dynamic-row"
                    : ""
                }
              >
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`}>
                    {renderTableCell(row, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1} className="text-center py-3">
                No records found.
              </td>
            </tr>
          )}
        </tbody>

        {paginated && (
          <tfoot>
            <tr>
              <td>
              <div class="metrics-btn-group">
                <select class="metrics-input" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                  <option value="">All</option>
                  <option value="">10</option>
                  <option value="">20</option>
                  <option value="">30</option>
                  </select>
                </div>
</td>
              <td colSpan={Math.max(columns.length - 1, 1)}>
                <div className="pagination metrics-btn-group align-right">
                  <button
                    className="metrics-btn"
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                      />
                    </svg>
                  </button>

                  <span className="metrics-btn">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="metrics-btn"
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                      />
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

  const renderCard = (row, index, footerClass = "grid-card-footer") => {
    const progress = getRowProgress(row);
    const imageFailed = imageLoadFailedMap[getRowKey(row)];
    const imageSrc = row.mediaTile || mediaImage;
    const statusTheme = getStatusTheme(row.status);

    return (
      <div
        className={`metrics-card ${statusTheme.className}`}
        key={row.id ?? index}
      >
        <div className="metrics-card-header">
          <div className="media-tile">
            <div
              className={`media-img ${statusTheme.className}`}
              style={statusTheme.style}
            >
              {imageSrc && !imageFailed ? (
                <img
                  className="img-fluid"
                  src={imageSrc}
                  alt="Media"
                  onError={() => handleImageError(row)}
                />
              ) : (
                <span className="letter-fallback">
                  {String(row.name || "??")
                    .substring(0, 1)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="media-details">
              {typeof row.mediaDetailsRenderer === "function" ? (
                row.mediaDetailsRenderer(row)
              ) : typeof mediaDetailsRenderer === "function" ? (
                mediaDetailsRenderer(row)
              ) : (
                <>
                  {mediaDetailsKeys.map((key, idx) => (
                    <p
                      key={key}
                      className={idx === 0 ? "name text-dark" : "text-muted"}
                    >
                      {row[key] || `No ${toLabel(key)}`}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>

          <span
            className={
              statusTheme.className === "metrics-status"
                ? "metrics-tag metrics-status"
                : `metrics-tag ${statusTheme.className}`
            }
            style={statusTheme.style}
          >
            {row.status || "N/A"}
          </span>
        </div>

        <div className="card-body">
          <div className="metrics-card-meta">
            {progress !== null && (
              <div className="pipeline-progress">
                <div className="progress">
                  <div
                    className={`progress-bar ${statusTheme.className}`}
                    role="progressbar"
                    style={{ width: `${progress}%`, ...statusTheme.style }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <p className="metrics-tag metrics-status">{progress}%</p>
                  </div>
                </div>
              </div>
            )}

            {row.date && (
              <div className="pipeline-date">
                {new Date(row.date).toLocaleDateString()}
              </div>
            )}
          </div>

          {row.description && <p className="description">{row.description}</p>}
        </div>

        <div className={footerClass}>{renderActionButtons(row, index)}</div>
      </div>
    );
  };

  const renderGridTemplate = () => (
    <div className="grid-container">
      {filteredData.length > 0 ? (
        filteredData.map((row, index) => renderCard(row, index))
      ) : (
        <div className="grid-empty">No records found.</div>
      )}
    </div>
  );

  const renderPipelineTemplate = () => {
    const statuses =
      searchOptions.length > 0
        ? searchOptions
        : Array.from(
            new Set(filteredData.map((row) => row.status).filter(Boolean)),
          );

    return (
      <div className="pipeline-container">
        {statuses.map((status) => {
          const columnData = getRowsByStatus(status);
          const statusTheme = getStatusTheme(status);

          return (
            <div className="pipeline-column" key={status}>
              <div
                className={`metrics-headers ${statusTheme.className}`}
                style={statusTheme.style}
              >
                <h3>{toLabel(status)}</h3>
                <span
                  className={`metrics-tag ${statusTheme.className}`}
                  style={statusTheme.style}
                >
                  {columnData.length}
                </span>
              </div>

              <div className="pipeline-body">
                {columnData.length > 0 ? (
                  columnData.map((row, index) =>
                    renderCard(row, index, "metrics-card-footer"),
                  )
                ) : (
                  <div className="pipeline-empty">No items</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCurrentTemplate = () => {
    if (currentViewType === "grid") return renderGridTemplate();
    if (currentViewType === "pipeline") return renderPipelineTemplate();

    return renderTableTemplate();
  };

  return (
    <>
      {normalizedKpis.length > 0 && (
        <div className="metrics-kpis">
          <div className="metrics-kpis-wrapper">
            {normalizedKpis.map((kpi) => {
              const statusTheme = getStatusTheme(kpi.cardKey);
              const cardClass =
                statusTheme.className === "metrics-status"
                  ? "metrics-kpi-card metrics-status"
                  : `metrics-kpi-card ${statusTheme.className}`;
              const changeValue =
                typeof kpi.change === "number"
                  ? `${kpi.change > 0 ? "+" : ""}${kpi.change}%`
                  : String(kpi.change).trim();
              const changeArrowPath =
                kpi.changeClass === "negative"
                  ? "M2.5 3.75 L5 6.25 L7.5 3.75"
                  : "M7.5 6.25 L5 3.75 L2.5 6.25";

              return (
                <div
                  key={`kpi-${kpi.cardKey}-${kpi.index}`}
                  className={cardClass}
                  style={statusTheme.style}
                >
                  <div className="metrics-kpi-top">
                    <div className="metrics-kpi-icon-wrapper">
                      {kpi.icon && (
                        <i className={`metrics-kpi-icon ${kpi.icon}`} />
                      )}
                    </div>
                    {kpi.change !== undefined && (
                      <span className={`metrics-kpi-change ${kpi.changeClass}`}>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={changeArrowPath}
                            stroke="currentColor"
                            strokeWidth="1.04"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {changeValue}
                      </span>
                    )}
                  </div>
                  <div className="metrics-kpi-footer">
                    <div className="metrics-kpi-content">
                      <p className="metrics-kpi-value">{kpi.value}</p>
                      <span className="metrics-kpi-label">{kpi.label}</span>
                      <span className="metrics-kpi-subtitle">
                        {kpi.subtitle}
                      </span>
                    </div>

                    <div className="metrics-kpi-chart">
                      <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient
                            id={`kpiGradient-${kpi.index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              stopColor="currentColor"
                              stopOpacity="0.12"
                            />
                            <stop
                              offset="100%"
                              stopColor="currentColor"
                              stopOpacity="0.24"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12 L100 50 L0 50 Z"
                          fill={`url(#kpiGradient-${kpi.index})`}
                        />
                        <path
                          d="M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div
        className={`metrics-data generic-font-size ${variant} ${isCollapsed ? "collapsed" : ""}`.trim()}
        style={{
          "--md-bg": theme.background || "#ffffff",
          "--md-surface": theme.surface || "#ffffff",
          "--md-surface-alt": theme.surfaceAlt || "#f5f5f5",

          "--md-text": theme.text || "#63634e",
          "--md-text-muted": theme.textMuted || "#888888",
          "--md-heading": theme.heading || "#212529",

          "--md-border": theme.border || "#e7e7e7",
          "--md-border-light": theme.borderLight || "#f0f0f0",

          "--md-primary": theme.primary || "#0173df",
          "--md-success": theme.success || "#28a745",
          "--md-warning": theme.warning || "#f1a10a",
          "--md-info": theme.info || "#17a2b8",
          "--md-danger": theme.danger || "#dc3545",

          "--md-card-bg": theme.cardBg || "#ffffff",
          "--md-header-bg": theme.headerBg || "#ffffff",
          "--md-table-header-bg": theme.tableHeaderBg || "#ffffff",
          "--md-grid-bg": theme.gridBg || "#f9f9f9",
          "--md-pipeline-bg": theme.pipelineBg || "#f5f7fa",

          "--md-radius": theme.radius || "5px",
          "--md-card-radius": theme.cardRadius || "10px",

          "--md-shadow": theme.shadow || "0 0px 16px rgba(0, 0, 0, 0.1)",
          "--md-card-shadow":
            theme.cardShadow || "0 2px 5px rgba(0, 0, 0, 0.04)",
          "--md-card-hover-shadow":
            theme.cardHoverShadow || "0 12px 32px rgba(0, 0, 0, 0.12)",

          ...theme.variables,
        }}
      >
        {metricsHeader && (
          <div className="metrics-header">
            <div className="metrics-container">
              <div className="metrics-group gap">
                <h6 className="table-title">
                  {icon && <i className={`title-icon ${icon}`} />}
                  {title}
                  {sub && <span className="text-muted">{sub}</span>}
                </h6>

                {filterStyle.includes("tabs") &&
                  currentViewType !== "pipeline" && (
                    <ul className="nav metrics-tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedOption === "" ? "active" : ""}`}
                          type="button"
                          role="tab"
                          onClick={() => setSelectedOption("")}
                        >
                          All
                        </button>
                      </li>

                      {searchOptions.map((option) => (
                        <li
                          className="nav-item"
                          role="presentation"
                          key={option}
                        >
                          <button
                            className={`nav-link  ${selectedOption === option ? "active" : ""}`}
                            type="button"
                            role="tab"
                            onClick={() => setSelectedOption(option)}
                          >
                            {option}
                            {(() => {
                              const optionTheme = getStatusTheme(option);
                              return (
                                <span
                                  className={
                                    optionTheme.className === "metrics-status"
                                      ? "metrics-badge metrics-status"
                                      : `metrics-badge ${optionTheme.className}`
                                  }
                                  style={optionTheme.style}
                                >
                                  {getTabCount(option)}
                                </span>
                              );
                            })()}
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
                    {filterStyle.includes("dropdown") && filterBy && (
                      <select
                        className="metrics-select"
                        value={selectedOption}
                        onChange={(event) =>
                          setSelectedOption(event.target.value)
                        }
                      >
                        <option value="">All</option>

                        {searchOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {filterStyle.includes("keyword") && (
                      <input
                        type="text"
                        className="metrics-input"
                        placeholder="Search..."
                        value={searchKeyword}
                        onChange={(event) =>
                          setSearchKeyword(event.target.value)
                        }
                      />
                    )}

                    {filterStyle.includes("date") && (
                      <>
                        <button
                          className="metrics-btn"
                          type="button"
                          onClick={() => setDatePicker((prev) => !prev)}
                          style={{ minWidth: 120 }}
                        >
                          <CalendarIcon />
                          <span>
                            {selectedDate.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </button>

                        {datePicker && renderDatePicker()}
                      </>
                    )}
                  </div>

                  {canShowViewButtons && (
                    <div className="metrics-btn-group">
                      {viewButtons.map((button, index) =>
                        renderHeaderButton(button, index, "view"),
                      )}
                    </div>
                  )}

                  {customFilter && (
                    <div className="metrics-btn-group">
                      <button
                        className={`metrics-btn ${customFilter.button?.className || ""}`.trim()}
                        type="button"
                        title={
                          customFilter.button?.tooltip || "Open custom filter"
                        }
                        onClick={() => setCustomFilterOpen(true)}
                      >
                        {customFilter.button?.icon ? (
                          <i className={customFilter.button.icon} />
                        ) : (
                          <FilterIcon />
                        )}
                        {customFilter.button?.label && (
                          <span>{customFilter.button.label}</span>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="metrics-btn-group">
                    {headerButtons.map((button, index) =>
                      renderHeaderButton(button, index, "header"),
                    )}
                  </div>

                  <div className="metrics-btn-group">
                    {collapsible && (
                      <button
                        className="metrics-btn"
                        type="button"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                      >
                        <CollapseIcon collapsed={isCollapsed} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {progressBy &&
              (() => {
                const progressStatusTheme = getStatusTheme(
                  selectedOption || progressBy,
                );
                return (
                  <div className="progress">
                    <div
                      className={`progress-bar ${progressStatusTheme.className}`}
                      role="progressbar"
                      style={{
                        width: `${progressValue}%`,
                        ...progressStatusTheme.style,
                      }}
                      aria-valuenow={progressValue}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <p className="metrics-tag metrics-status">
                        {progressValue}%
                      </p>
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        <div className={`metrics-body view-${currentViewType}`}>
          {renderCurrentTemplate()}
        </div>

        {showFooter && footerComponent && (
          <div className="metrics-footer">{footerComponent}</div>
        )}

        {customFilter && customFilterOpen && (
          <div
            className="filter-slide-backdrop"
            onClick={() => setCustomFilterOpen(false)}
          >
            <div
              className="filter-slide-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="metrics-header">
                <div className="metrics-container">
                  <h5>{customFilter.title || "Custom Filter"}</h5>
                  <button
                    className="metrics-btn"
                    type="button"
                    onClick={() => setCustomFilterOpen(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="filter-slide-body">
                <FilterComponent
                  data={data}
                  fields={customFilter?.fields}
                  onApply={(filters) => {
                    setCustomFilterValues(filters);
                    customFilter?.onApply?.(filters);
                    setCustomFilterOpen(false);
                  }}
                  onReset={(filters) => {
                    setCustomFilterValues(filters);
                    customFilter?.onReset?.(filters);
                  }}
                  initialFilters={customFilterValues}
                  theme={theme}
                  idPrefix={internalIdPrefix}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
