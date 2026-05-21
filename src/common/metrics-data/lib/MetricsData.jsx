import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../styles/metrics-data.component.css";
import FilterComponent from "./FilterComponent";

// ─── Constants ───────────────────────────────────────────────────────────────

const KNOWN_VIEWS = ["table", "grid", "pipeline"];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

let uniqueCounter = 0;

// ─── Utilities ────────────────────────────────────────────────────────────────

function toLabel(key) {
  if (!key) return "";
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, (_, i) => ({ key: `blank-${i}`, day: null }));
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    key: `day-${i + 1}`,
    day: new Date(year, month, i + 1),
  }));
  return [...blanks, ...days];
}

// ─── Icon Components ──────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
    </svg>
  );
}

function ChevronIcon({ direction = "right" }) {
  const paths = {
    left: "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0",
    right: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708",
    up: "M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z",
    down: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z",
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path fillRule="evenodd" d={paths[direction]} />
    </svg>
  );
}

function SortIcon({ active, asc }) {
  const paths = {
    asc: "M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5",
    desc: "M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1",
    both: "M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5",
  };
  const path = !active ? paths.both : asc ? paths.asc : paths.desc;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path fillRule="evenodd" d={path} />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      {collapsed ? (
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10" />
      ) : (
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z" />
      )}
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
    </svg>
  );
}

// ─── DatePicker Sub-component ─────────────────────────────────────────────────
// Isolated as its own component so it manages its own pending state cleanly.

function DatePicker({ selectedDate, onConfirm, onCancel }) {
  // pendingDate: the visually highlighted date before confirming
  const [pendingDate, setPendingDate] = useState(selectedDate);
  // calendarMonth: which month/year the calendar is currently showing
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const prevMonth = () => setCalendarMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(year, month + 1, 1));

  // Stop all clicks inside the picker from bubbling to the document
  // (prevents the outside-click handler from closing the picker)
  const handleContainerClick = (e) => e.stopPropagation();

  const handleConfirm = () => {
    onConfirm(pendingDate);
  };

  const handleCancel = () => {
    // Reset pending selection back to the last confirmed date
    setPendingDate(selectedDate);
    onCancel();
  };

  return (
    <div
      className="date-picker"
      role="dialog"
      aria-modal="true"
      aria-label="Date picker"
      onClick={handleContainerClick}
    >
      {/* ── Month navigation ── */}
      <div className="metrics-group align-justify align-center date-picker-nav">
        <button type="button" className="metrics-btn" onClick={prevMonth} aria-label="Previous month">
          <ChevronIcon direction="left" />
        </button>
        <strong className="date-picker-title">
          {MONTHS[month]} {year}
        </strong>
        <button type="button" className="metrics-btn" onClick={nextMonth} aria-label="Next month">
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* ── Weekday headers ── */}
      <div className="d-grid">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center fw-bold generic-font-size" aria-hidden="true">
            {d}
          </div>
        ))}

        {/* ── Day cells ── */}
        {calendarDays.map(({ key, day }) =>
          day ? (
            <button
              key={key}
              type="button"
              className={`day-btn${isSameDay(day, pendingDate) ? " active" : ""}`}
              onClick={() => setPendingDate(day)}
              aria-pressed={isSameDay(day, pendingDate)}
              aria-label={day.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            >
              {day.getDate()}
            </button>
          ) : (
            <div key={key} aria-hidden="true" />
          )
        )}
      </div>

      {/* ── Footer actions ── */}
      <div className="metrics-btn-group footer align-right">
        <button className="metrics-btn" type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="metrics-btn primary" type="button" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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

  const sorting = sortingProp ?? Sorting;

  // ── ID prefix ──────────────────────────────────────────────────────────────
  const [internalIdPrefix] = useState(
    () => idPrefix || `metrics-data-${uniqueCounter++}`
  );

  // ── View type resolution ───────────────────────────────────────────────────
  const resolveViewType = useCallback((value) => {
    if (value == null) return null;
    const n = String(value).toLowerCase();
    return KNOWN_VIEWS.includes(n) ? n : null;
  }, []);

  const viewSource = useMemo(() => {
    if (Array.isArray(showViewTypes) && showViewTypes.length > 0) return showViewTypes;
    if (Array.isArray(viewTypes) && viewTypes.length > 0) return viewTypes;
    if (showViewTypes === true) return KNOWN_VIEWS;
    return [defaultView];
  }, [showViewTypes, viewTypes, defaultView]);

  const normalizedViewTypes = useMemo(() => {
    const candidates = Array.isArray(viewSource) ? viewSource : [];
    const values = [];
    candidates.forEach((c) => {
      const vt = resolveViewType(typeof c === "string" ? c : c.view || c.action || c.label);
      if (vt) values.push(vt);
    });
    if (values.length === 0) values.push(resolveViewType(defaultView) || "table");
    return [...new Set(values)];
  }, [viewSource, defaultView, resolveViewType]);

  const resolvedView = resolveViewType(view);
  const resolvedDefaultView = resolveViewType(defaultView) || "table";

  const [currentViewType, setCurrentViewType] = useState(() => {
    if (resolvedView && normalizedViewTypes.includes(resolvedView)) return resolvedView;
    if (normalizedViewTypes.includes(resolvedDefaultView)) return resolvedDefaultView;
    return normalizedViewTypes[0];
  });

  useEffect(() => {
    setCurrentViewType((prev) => {
      if (resolvedView) {
        return normalizedViewTypes.includes(resolvedView) ? resolvedView : normalizedViewTypes[0];
      }
      return normalizedViewTypes.includes(prev) ? prev : normalizedViewTypes[0];
    });
  }, [resolvedView, normalizedViewTypes]);

  const canShowViewButtons =
    showViewSwitcher !== false &&
    showViewTypes !== false &&
    normalizedViewTypes.length > 1;

  // ── Core UI state ──────────────────────────────────────────────────────────
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [dropdownShownIndex, setDropdownShownIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [imageLoadFailedMap, setImageLoadFailedMap] = useState({});
  const [customFilterOpen, setCustomFilterOpen] = useState(false);
  const [customFilterValues, setCustomFilterValues] = useState(
    () => customFilter?.initialValues || {}
  );

  // ── Date picker state ──────────────────────────────────────────────────────
  // FIX: Separate "date picker open" from "date filter active".
  // After confirming a date, datePicker closes but dateFilterActive stays true
  // so the filter keeps working on the data.
  const [datePicker, setDatePicker] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState(null); // null = no date filter
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const datePickerRef = useRef(null);
  const dateToggleBtnRef = useRef(null);

  // ── Sync pageSize prop ─────────────────────────────────────────────────────
  useEffect(() => { setCurrentPageSize(pageSize); }, [pageSize]);

  // ── Sync customFilter initialValues ───────────────────────────────────────
  useEffect(() => {
    setCustomFilterValues(customFilter?.initialValues || {});
  }, [customFilter?.initialValues]);

  // ── Outside-click: close dropdown & date picker ───────────────────────────
  // FIX: Use a ref-based approach so clicks inside the picker don't close it.
  useEffect(() => {
    const handler = (e) => {
      // Close dropdown
      setDropdownShownIndex(null);

      // Close date picker only if click is outside both the picker and the toggle button
      if (
        datePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target) &&
        dateToggleBtnRef.current &&
        !dateToggleBtnRef.current.contains(e.target)
      ) {
        setDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [datePicker]);

  // ── KPI normalization ──────────────────────────────────────────────────────
  const normalizedKpis = useMemo(() => {
    if (!Array.isArray(showKpis) || showKpis.length === 0) return [];
    return showKpis.map((item, index) => {
      const cardKey = String(item.card || item.label || "").toLowerCase().trim();
      const label = item.label || toLabel(cardKey);
      const value =
        item.value !== undefined
          ? item.value
          : data.filter((row) =>
              Object.values(row || {}).some(
                (v) => String(v || "").toLowerCase().trim() === cardKey
              )
            ).length;
      const change = item.change;
      const changeClass =
        typeof change === "string" && change.trim().startsWith("-")
          ? "negative"
          : "positive";
      return { ...item, cardKey, label, value, change, changeClass, subtitle: item.subtitle || "vs. last month", index };
    });
  }, [showKpis, data]);

  // ── Column resolution ──────────────────────────────────────────────────────
  const columns = useMemo(() => {
    let generated = Array.isArray(propColumns) ? propColumns : [];

    if (
      (generated.length === 0 || generated.every((c) => !c)) &&
      autoGenerateColumns &&
      data.length > 0
    ) {
      generated = Object.keys(data[0])
        .filter((key) => !excludeColumns.includes(key))
        .map((key) => ({ key, label: toLabel(key) }));
    }

    const actionKey = generated.some((c) => c.key === "action") ? "action" : "actions";
    if (
      showActions &&
      actionButtons.length > 0 &&
      !generated.some((c) => c.key === "action" || c.key === "actions")
    ) {
      generated = [...generated, { key: actionKey, label: "Actions" }];
    }

    if (generated.some((c) => c.key === "mediaTile")) {
      generated = generated.filter((c) => !mediaDetailsKeys.includes(c.key));
    }

    return generated;
  }, [propColumns, data, excludeColumns, autoGenerateColumns, showActions, actionButtons.length, mediaDetailsKeys]);

  // ── Filter options ─────────────────────────────────────────────────────────
  const searchOptions = useMemo(() => {
    if (!filterBy) return [];
    return [...new Set(data.map((item) => item?.[filterBy]).filter(Boolean))].sort();
  }, [data, filterBy]);

  // ── Filtered + sorted data ─────────────────────────────────────────────────
  // FIX: Use `dateFilterActive` and `confirmedDate` (not `datePicker`) so the
  // filter persists after the picker is closed.
  const filteredData = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return data
      .filter((item) => {
        const keywordMatch =
          !keyword ||
          Object.values(item || {}).some((v) =>
            String(v || "").toLowerCase().includes(keyword)
          );

        const optionMatch = !selectedOption || item?.[filterBy] === selectedOption;

        // Date filter: only active when user has confirmed a date selection
        const dateMatch =
          !filterStyle.includes("date") ||
          !dateFilterActive ||
          !confirmedDate ||
          !item?.date ||
          isSameDay(new Date(item.date), confirmedDate);

        const customFilterMatch =
          !customFilter?.fields || !Array.isArray(customFilter.fields)
            ? true
            : customFilter.fields.every((field) => {
                const filterValue = customFilterValues?.[field.key];
                if (filterValue === undefined || filterValue === null || filterValue === "") return true;
                const rowValue = item?.[field.key];
                if (field.type === "date") {
                  return rowValue && isSameDay(new Date(rowValue), new Date(filterValue));
                }
                if (field.type === "number") return Number(rowValue) === Number(filterValue);
                if (field.type === "select") return String(rowValue) === String(filterValue);
                return String(rowValue || "").toLowerCase().includes(String(filterValue || "").toLowerCase());
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
    data, searchKeyword, selectedOption, filterBy, filterStyle,
    dateFilterActive, confirmedDate, sortKey, sortAsc,
    customFilter, customFilterValues,
  ]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredData.length / currentPageSize));

  const pagedData = paginated
    ? filteredData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : filteredData;

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [searchKeyword, selectedOption, confirmedDate, dateFilterActive]);

  // Guard against currentPage exceeding totalPages
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // ── Progress value ─────────────────────────────────────────────────────────
  const progressValue = useMemo(() => {
    if (!progressBy || !filterBy || !data.length) return 0;
    const statusToCheck = selectedOption || progressBy;
    const match = data.filter((item) => item?.[filterBy] === statusToCheck).length;
    return Math.round((match / data.length) * 100);
  }, [data, selectedOption, progressBy, filterBy]);

  // ── Status/theme resolution ────────────────────────────────────────────────
  const getStatusTheme = useCallback(
    (status) => {
      const key = String(status || "").toLowerCase().trim();
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

      return { className: value || key || "default", style: {} };
    },
    [statusMap]
  );

  // ── Value helpers ──────────────────────────────────────────────────────────
  const getValue = (row, key) => {
    const val = row?.[key];
    return val !== undefined && val !== null && val !== "" ? String(val) : "-";
  };

  const shouldApplyValueLength = (key) =>
    Array.isArray(valueLengthColumns) && valueLengthColumns.includes(key);

  const getRowKey = (row) =>
    row?.id ?? row?.[searchKey] ?? row?.name ?? JSON.stringify(row);

  const getRowProgress = (row) => {
    if (!row) return null;
    const val = row.progress ?? row.percentage ?? row.percent;
    const num = Number(val);
    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
  };

  const getTabCount = (option) =>
    filteredData.filter((item) => item?.[filterBy] === option).length;

  const getRowsByStatus = (status) =>
    filteredData.filter(
      (item) =>
        String(item?.[filterBy] || item?.status || "").toLowerCase() ===
        String(status || "").toLowerCase()
    );

  // ── Interaction handlers ───────────────────────────────────────────────────
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
    setSelectedRows((prev) =>
      checked ? (prev.includes(row) ? prev : [...prev, row]) : prev.filter((r) => r !== row)
    );
  };

  const toggleAllRows = (checked) => setSelectedRows(checked ? [...pagedData] : []);

  const isAllSelected =
    pagedData.length > 0 && pagedData.every((row) => selectedRows.includes(row));

  const handleButtonClick = (btn, row) => {
    btn?.action?.(row);
    onRowAction({ action: btn?.label || btn?.action || "", row });
  };

  const handleBulkAction = (btn) => {
    btn?.action?.(selectedRows);
    onRowAction({ action: btn?.label || btn?.action || "", rows: selectedRows });
    setDropdownShownIndex(null);
  };

  const handleDropdownClick = (option, btn, row) => {
    if (btn?.dropdownAction) btn.dropdownAction(option, row);
    else if (btn?.action) btn.action(row, option);
    onRowAction({ action: option, row });
    setDropdownShownIndex(null);
  };

  const handleImageError = (row) => {
    setImageLoadFailedMap((prev) => ({ ...prev, [getRowKey(row)]: true }));
  };

  const executeAction = (button) => {
    const viewTypeMap = { table: "table", list: "table", grid: "grid", pipeline: "pipeline" };
    if (viewTypeMap[button.action]) setCurrentViewType(viewTypeMap[button.action]);
    button?.actionHandler?.();
    button?.onClick?.();
  };

  // ── Date picker handlers ───────────────────────────────────────────────────
  // FIX: Toggle button uses stopPropagation so the document mousedown handler
  // doesn't immediately close the picker that was just opened.
  const handleDateToggle = (e) => {
    e.stopPropagation();
    setDatePicker((prev) => !prev);
  };

  // FIX: On confirm, store the date, activate the filter, close the picker.
  const handleDateConfirm = (date) => {
    setConfirmedDate(date);
    setDateFilterActive(true);
    setDatePicker(false);
  };

  // FIX: On cancel, close the picker without changing the confirmed date or filter state.
  const handleDateCancel = () => {
    setDatePicker(false);
  };

  const handleClearDateFilter = (e) => {
    e.stopPropagation();
    setConfirmedDate(null);
    setDateFilterActive(false);
    setDatePicker(false);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderCheckbox = ({ id, checked, onChange, children }) => (
    <div className="metrics-checkbox" key={id}>
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={id}
      />
      <label className="cbx" htmlFor={id}>
        <div className="checkbox">
          <svg width="12px" height="10px" viewBox="0 0 12 10" aria-hidden="true">
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </svg>
        </div>
        {children}
      </label>
    </div>
  );

  const renderMediaTile = (row, index, showMobileToggle = false, showCheckbox = true) => {
    const rowKey = getRowKey(row);
    const imageFailed = imageLoadFailedMap[rowKey];
    const imageSrc = row.mediaTile || mediaImage;
    const statusTheme = getStatusTheme(row.status);

    return (
      <div className="metrics-group" key={rowKey}>
        {showCheckbox &&
          renderCheckbox({
            id: `${internalIdPrefix}-cbx-${index}`,
            checked: selectedRows.includes(row),
            onChange: (checked) => toggleSelectRow(row, checked),
          })}

        <div className="media-tile">
          <div className={`media-img ${statusTheme.className}`} style={statusTheme.style}>
            {imageSrc && !imageFailed ? (
              <img
                className="img-fluid"
                src={imageSrc}
                alt={row.name || "Media"}
                onError={() => handleImageError(row)}
              />
            ) : (
              <span className="letter-fallback" aria-hidden="true">
                {String(row.name || "??").substring(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="media-details">
            {typeof row.mediaDetailsRenderer === "function" ? (
              row.mediaDetailsRenderer(row)
            ) : typeof mediaDetailsRenderer === "function" ? (
              mediaDetailsRenderer(row)
            ) : (
              mediaDetailsKeys.map((key, idx) => (
                <p key={key} className={idx === 0 ? "name text-dark" : "text-muted"}>
                  {row[key] || `No ${toLabel(key)}`}
                </p>
              ))
            )}
          </div>
        </div>

        {showMobileToggle && (
          <button
            className="metrics-btn mobile-btn"
            type="button"
            aria-label={activeRowIndex === index ? "Collapse row" : "Expand row"}
            aria-expanded={activeRowIndex === index}
            onClick={() => setActiveRowIndex((prev) => (prev === index ? null : index))}
          >
            <ChevronIcon direction={activeRowIndex === index ? "up" : "right"} />
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
                aria-haspopup="true"
                aria-expanded={dropdownShownIndex === dropdownKey}
                onClick={(e) => toggleDropdown(dropdownKey, e)}
              >
                {btn.icon && <i className={btn.icon} aria-hidden="true" />}
                {btn.label}
              </button>
              <ul
                role="menu"
                className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? "show" : ""}`}
              >
                {btn.options?.map((option) => (
                  <li key={option} role="none">
                    <button
                      role="menuitem"
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
            aria-label={btn.tooltip || btn.label}
            onClick={() => handleButtonClick(btn, row)}
          >
            {btn.icon && <i className={btn.icon} aria-hidden="true" />}
            {btn.label}
          </button>
        );
      })}
    </div>
  );

  // FIX: Wrap each switch case body in a block `{}` to avoid lexical declaration errors
  const renderTableCell = (row, column, rowIndex) => {
    switch (column.key) {
      case "mediaTile":
        return renderMediaTile(row, rowIndex, true, currentViewType !== "table");

      case "status": {
        const statusTheme = getStatusTheme(row.status);
        return (
          <span
            className={
              statusTheme.className === "metrics-status"
                ? "metrics-tag metrics-status"
                : `metrics-tag ${statusTheme.className}`
            }
            style={statusTheme.style}
          >
            {getValue(row, column.key)}
          </span>
        );
      }

      case "priority": {
        const priorityTheme = getStatusTheme(row.priority);
        const priorityKey = String(row.priority || "").toLowerCase().trim();
        const defaultPriorityStyles = {
          high: { "--md-status-text": "var(--md-danger)", "--md-status-bg": "#fee2e2", "--md-status-border": "var(--md-danger)" },
          medium: { "--md-status-text": "var(--md-warning)", "--md-status-bg": "#fff7ed", "--md-status-border": "var(--md-warning)" },
          low: { "--md-status-text": "var(--md-success)", "--md-status-bg": "#ecfdf5", "--md-status-border": "var(--md-success)" },
        };
        const appliedStyle =
          priorityTheme.style && Object.keys(priorityTheme.style).length
            ? priorityTheme.style
            : defaultPriorityStyles[priorityKey] || {};
        return (
          <span className="metrics-tag metrics-status" style={appliedStyle}>
            {getValue(row, "priority")}
          </span>
        );
      }

      case "progress": {
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
      }

      case "action":
      case "actions":
        return renderActionButtons(row, rowIndex);

      default:
        return (
          <span
            className={`value ${shouldApplyValueLength(column.key) ? "value-length" : ""}`}
            title={shouldApplyValueLength(column.key) ? getValue(row, column.key) : undefined}
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
            className={`metrics-btn no-bg metrics-btn-toggle ${button.className || ""}`}
            title={button.tooltip}
            aria-haspopup="true"
            aria-expanded={dropdownShownIndex === dropdownKey}
            onClick={(e) => toggleDropdown(dropdownKey, e)}
          >
            {button.icon && <i className={button.icon} aria-hidden="true" />}
            {button.label}
          </button>
          <ul role="menu" className={`dropdown-menu ${dropdownShownIndex === dropdownKey ? "show" : ""}`}>
            {button.options?.map((option) => (
              <li key={option} role="none">
                <button role="menuitem" type="button" className="dropdown-item" onClick={() => handleDropdownClick(option, button, null)}>
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (type === "view") {
      const isActive = currentViewType === button.action;
      return (
        <button
          key={button.targetId || dropdownKey}
          type="button"
          className={`metrics-btn ${button.className || ""} ${isActive ? "active" : ""}`}
          id={button.targetId}
          title={button.tooltip}
          aria-pressed={isActive}
          onClick={() => executeAction(button)}
        >
          {button.icon && <i className={button.icon} aria-hidden="true" />}
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
        aria-label={button.tooltip || button.label}
        onClick={() => button.action?.()}
      >
        {button.icon && <i className={button.icon} aria-hidden="true" />}
        {button.label && <span>{button.label}</span>}
      </button>
    );
  };

  // ── Table template ─────────────────────────────────────────────────────────
  const renderTableTemplate = () => {
    const idColumn = columns.find((c) => c.key === "id");
    const tableColumns = columns.filter((c) => c.key !== "id");
    const idColumnDef = idColumn || { key: "id", label: "ID" };
    const totalCols = tableColumns.length + 2;

    return (
      <div className="table-wrapper">
        <table role="grid">
          <thead>
            <tr>
              {/* Select-all checkbox */}
              <th scope="col">
                <div className="metrics-group justify-center">
                  {renderCheckbox({
                    id: `${internalIdPrefix}-cbx-header`,
                    checked: isAllSelected,
                    onChange: toggleAllRows,
                    children:
                      selectedRows.length > 1 ? (
                        <div className="metrics-dropdown">
                          <button
                            className="metrics-btn no-bg"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={dropdownShownIndex === "bulk"}
                            aria-label="Bulk actions"
                            onClick={(e) => toggleDropdown("bulk", e)}
                          >
                            <ThreeDotsIcon />
                          </button>
                          <ul role="menu" className={`dropdown-menu ${dropdownShownIndex === "bulk" ? "show" : ""}`}>
                            {actionButtons.map((btn) => (
                              <li key={btn.label} role="none">
                                <button role="menuitem" className="dropdown-item" type="button" onClick={() => handleBulkAction(btn)}>
                                  {btn.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null,
                  })}
                </div>
              </th>

              {/* ID column */}
              <th
                scope="col"
                onClick={() => sorting && handleSortBy(idColumnDef.key)}
                style={{ cursor: sorting ? "pointer" : "default" }}
                aria-sort={sortKey === idColumnDef.key ? (sortAsc ? "ascending" : "descending") : "none"}
              >
                <div className="sorting-group">
                  <span>{idColumnDef.label}</span>
                  {sorting && <SortIcon active={sortKey === idColumnDef.key} asc={sortAsc} />}
                </div>
              </th>

              {/* Data columns */}
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  onClick={() => sorting && handleSortBy(column.key)}
                  style={{ cursor: sorting ? "pointer" : "default" }}
                  aria-sort={sortKey === column.key ? (sortAsc ? "ascending" : "descending") : "none"}
                >
                  <div className="sorting-group">
                    <span>{column.label}</span>
                    {sorting && <SortIcon active={sortKey === column.key} asc={sortAsc} />}
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
                    activeRowIndex === rowIndex || selectedRows.includes(row) ? "dynamic-row" : ""
                  }
                  role="row"
                >
                  <td role="gridcell">
                    {renderCheckbox({
                      id: `${internalIdPrefix}-cbx-${rowIndex}`,
                      checked: selectedRows.includes(row),
                      onChange: (checked) => toggleSelectRow(row, checked),
                    })}
                  </td>
                  <td role="gridcell" className="id-col">
                    {renderTableCell(row, idColumnDef, rowIndex)}
                  </td>
                  {tableColumns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} role="gridcell">
                      {renderTableCell(row, column, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalCols} className="text-center py-3">
                  <div className="metrics-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-5m16 0H4m8-7v7" />
                    </svg>
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ── Pagination ── */}
        {paginated && (
          <div className="metrics-footer">
            <div className="metrics-footer-slot">{footerComponent}</div>

            <div className="pagination metrics-btn-group align-right">
              {/* Items per page */}
              <div className="metrics-dropdown metrics-btn">
                <button
                  className="metrics-btn no-bg metrics-btn-toggle"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={dropdownShownIndex === "pagination"}
                  title={`Items per page: ${currentPageSize}`}
                  onClick={(e) => toggleDropdown("pagination", e)}
                >
                  {currentPageSize} / page
                </button>
                <ul role="menu" className={`dropdown-menu ${dropdownShownIndex === "pagination" ? "show" : ""}`}>
                  {[...new Set([pageSize, 10, 20, 50, 100])].sort((a, b) => a - b).map((size) => (
                    <li key={size} role="none">
                      <button
                        role="menuitem"
                        type="button"
                        className={`dropdown-item ${currentPageSize === size ? "active" : ""}`}
                        onClick={() => {
                          setCurrentPageSize(size);
                          setCurrentPage(1);
                          setDropdownShownIndex(null);
                        }}
                      >
                        {size} per page
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prev */}
              <button
                className="metrics-btn"
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronIcon direction="left" />
              </button>

              {/* Page indicator */}
              <span className="metrics-btn" aria-live="polite" aria-atomic="true">
                {currentPage} / {totalPages}
              </span>

              {/* Next */}
              <button
                className="metrics-btn"
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Card renderer ──────────────────────────────────────────────────────────
  const renderCard = (row, index, footerClass = "grid-card-footer") => {
    const progress = getRowProgress(row);
    const imageFailed = imageLoadFailedMap[getRowKey(row)];
    const imageSrc = row.mediaTile || mediaImage;
    const statusTheme = getStatusTheme(row.status);

    return (
      <div className={`metrics-card ${statusTheme.className}`} key={row.id ?? index} style={statusTheme.style}>
        <div className="metrics-card-header">
          <div className="media-tile">
            <div className={`media-img ${statusTheme.className}`} style={statusTheme.style}>
              {imageSrc && !imageFailed ? (
                <img className="img-fluid" src={imageSrc} alt={row.name || "Media"} onError={() => handleImageError(row)} />
              ) : (
                <span className="letter-fallback" aria-hidden="true">
                  {String(row.name || "??").substring(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="media-details">
              {typeof row.mediaDetailsRenderer === "function"
                ? row.mediaDetailsRenderer(row)
                : typeof mediaDetailsRenderer === "function"
                ? mediaDetailsRenderer(row)
                : mediaDetailsKeys.map((key, idx) => (
                    <p key={key} className={idx === 0 ? "name text-dark" : "text-muted"}>
                      {row[key] || `No ${toLabel(key)}`}
                    </p>
                  ))}
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
          {row.date && <div className="pipeline-date">{new Date(row.date).toLocaleDateString()}</div>}
          {row.description && <p className="description">{row.description}</p>}
        </div>

        <div className={footerClass}>{renderActionButtons(row, index)}</div>
      </div>
    );
  };

  // ── Grid template ──────────────────────────────────────────────────────────
  const renderGridTemplate = () => (
    <div className="grid-container">
      {filteredData.length > 0 ? (
        filteredData.map((row, index) => renderCard(row, index))
      ) : (
        <div className="grid-empty">No records found.</div>
      )}
    </div>
  );

  // ── Pipeline template ──────────────────────────────────────────────────────
  const renderPipelineTemplate = () => {
    const statuses =
      searchOptions.length > 0
        ? searchOptions
        : [...new Set(filteredData.map((row) => row?.[filterBy] || row?.status).filter(Boolean))];

    return (
      <div className="pipeline-container">
        {statuses.map((status) => {
          const colData = getRowsByStatus(status);
          const statusTheme = getStatusTheme(status);
          return (
            <div className="pipeline-column" key={status}>
              <div className={`metrics-headers ${statusTheme.className}`} style={statusTheme.style}>
                <h3>{toLabel(status)}</h3>
                <span className={`metrics-tag ${statusTheme.className}`} style={statusTheme.style}>
                  {colData.length}
                </span>
              </div>
              <div className="pipeline-body">
                {colData.length > 0 ? (
                  colData.map((row, index) => renderCard(row, index, "metrics-card-footer"))
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

  // ── View buttons ───────────────────────────────────────────────────────────
  const viewButtons = useMemo(() => {
    const iconMap = { table: "bi bi-table", grid: "bi bi-grid-3x3-gap", pipeline: "bi bi-diagram-3", list: "bi bi-list" };
    return (Array.isArray(viewSource) ? viewSource : []).map((vt, i) => {
      if (typeof vt === "string") {
        const action = vt.toLowerCase();
        return { label: toLabel(vt), action, targetId: `${internalIdPrefix}-view-${action}`, tooltip: `${toLabel(vt)} View`, className: `view-btn view-btn-${action}`, icon: iconMap[action] || `bi bi-${action}` };
      }
      const action = resolveViewType(vt.view || vt.action || vt.label) || String(vt.label || "").toLowerCase();
      return { label: vt.label || toLabel(action), action, targetId: `${internalIdPrefix}-view-${action}`, tooltip: vt.tooltip || `${toLabel(action)} View`, className: vt.className || `view-btn view-btn-${action}`, icon: vt.icon || iconMap[action] || `bi bi-${action}` };
    });
  }, [viewSource, internalIdPrefix, resolveViewType]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── KPI Cards ── */}
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
                  : String(kpi.change ?? "").trim();
              const changeArrowPath =
                kpi.changeClass === "negative"
                  ? "M2.5 3.75 L5 6.25 L7.5 3.75"
                  : "M7.5 6.25 L5 3.75 L2.5 6.25";

              return (
                <div key={`kpi-${kpi.cardKey}-${kpi.index}`} className={cardClass} style={statusTheme.style}>
                  <div className="metrics-kpi-top">
                    <div className="metrics-kpi-icon-wrapper">
                      {kpi.icon && <i className={`metrics-kpi-icon ${kpi.icon}`} aria-hidden="true" />}
                    </div>
                    {kpi.change !== undefined && (
                      <span className={`metrics-kpi-change ${kpi.changeClass}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d={changeArrowPath} stroke="currentColor" strokeWidth="1.04" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {changeValue}
                      </span>
                    )}
                  </div>
                  <div className="metrics-kpi-footer">
                    <div className="metrics-kpi-content">
                      <p className="metrics-kpi-value">{kpi.value}</p>
                      <span className="metrics-kpi-label">{kpi.label}</span>
                      <span className="metrics-kpi-subtitle">{kpi.subtitle}</span>
                    </div>
                    <div className="metrics-kpi-chart">
                      <svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id={`kpiGradient-${kpi.index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.24" />
                          </linearGradient>
                        </defs>
                        <path d="M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12 L100 50 L0 50 Z" fill={`url(#kpiGradient-${kpi.index})`} />
                        <path d="M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main component ── */}
      <div
        className={`metrics-data responsive generic-font-size ${variant} ${isCollapsed ? "collapsed" : ""}`.trim()}
        style={{
          // FIX: Deduplicated CSS variables (shadow and cardShadow were both
          // mapping to "--md-shadow", so cardShadow always won)
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
          // FIX: Separate CSS vars for shadow and card-shadow
          "--md-shadow": theme.shadow || "0 0px 16px rgba(0, 0, 0, 0.1)",
          "--md-card-shadow": theme.cardShadow || "0 0 10px rgba(0, 0, 0, 0.3)",
          "--md-card-hover-shadow": theme.cardHoverShadow || "0 12px 32px rgba(0, 0, 0, 0.12)",
          ...theme.variables,
        }}
      >
        {/* ── Header ── */}
        {metricsHeader && (
          <div className="metrics-header">
            <div className="metrics-container">
              {/* Left: title + tabs */}
              <div className="metrics-group gap">
                <h6 className="table-title">
                  {icon && <i className={`title-icon ${icon}`} aria-hidden="true" />}
                  {title}
                  {sub && <span className="text-muted">{sub}</span>}
                </h6>

                {filterStyle.includes("tabs") && currentViewType !== "pipeline" && (
                  <ul className="nav metrics-tabs" role="tablist" aria-label="Filter by status">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${selectedOption === "" ? "active" : ""}`}
                        type="button"
                        role="tab"
                        aria-selected={selectedOption === ""}
                        onClick={() => setSelectedOption("")}
                      >
                        All
                      </button>
                    </li>
                    {searchOptions.map((option) => {
                      const optionTheme = getStatusTheme(option);
                      return (
                        <li className="nav-item" role="presentation" key={option}>
                          <button
                            className={`nav-link ${selectedOption === option ? "active" : ""}`}
                            type="button"
                            role="tab"
                            aria-selected={selectedOption === option}
                            onClick={() => setSelectedOption(option)}
                          >
                            {option}
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
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Right: controls */}
              <div className="metrics-group gap">
                {headerComponent}

                <div className="metrics-group gap">
                  {/* Filters */}
                  <div className="metrics-btn-group">
                    {filterStyle.includes("dropdown") && filterBy && (
                      <select
                        className="metrics-select"
                        value={selectedOption}
                        aria-label="Filter by status"
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <option value="">All</option>
                        {searchOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {filterStyle.includes("keyword") && (
                      <input
                        type="search"
                        className="metrics-input"
                        placeholder="Search…"
                        value={searchKeyword}
                        aria-label="Search records"
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    )}

                    {/* ── Date filter ── */}
                    {filterStyle.includes("date") && (
                      <div className="metrics-date-wrap" style={{ position: "relative" }}>
                        {/* Toggle button */}
                        <button
                          ref={dateToggleBtnRef}
                          className={`metrics-btn${dateFilterActive ? " active" : ""}`}
                          type="button"
                          aria-haspopup="true"
                          aria-expanded={datePicker}
                          aria-label="Toggle date filter"
                          onClick={handleDateToggle}
                          style={{ minWidth: 160, gap: 6 }}
                        >
                          <CalendarIcon />
                          <span>
                            {dateFilterActive && confirmedDate
                              ? formatDate(confirmedDate)
                              : "Filter by date"}
                          </span>
                          {/* Clear button (shown when filter is active) */}
                          {dateFilterActive && (
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label="Clear date filter"
                              style={{
                                marginLeft: 4,
                                fontSize: 16,
                                lineHeight: 1,
                                opacity: 0.6,
                                cursor: "pointer",
                              }}
                              onClick={handleClearDateFilter}
                              onKeyDown={(e) => e.key === "Enter" && handleClearDateFilter(e)}
                            >
                              ×
                            </span>
                          )}
                        </button>

                        {/* FIX: DatePicker is a separate component, manages its own
                            pending selection, and stops click propagation internally */}
                        {datePicker && (
                          <div ref={datePickerRef}>
                            <DatePicker
                              selectedDate={confirmedDate || new Date()}
                              onConfirm={handleDateConfirm}
                              onCancel={handleDateCancel}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* View switcher */}
                  {canShowViewButtons && (
                    <div className="metrics-btn-group">
                      {viewButtons.map((button, index) =>
                        renderHeaderButton(button, index, "view")
                      )}
                    </div>
                  )}

                  {/* Custom filter */}
                  {customFilter && (
                    <div className="metrics-btn-group">
                      <button
                        className={`metrics-btn ${customFilter.button?.className || ""}`.trim()}
                        type="button"
                        aria-label={customFilter.button?.tooltip || "Open custom filter"}
                        onClick={() => setCustomFilterOpen(true)}
                      >
                        {customFilter.button?.icon
                          ? <i className={customFilter.button.icon} aria-hidden="true" />
                          : <FilterIcon />}
                        {customFilter.button?.label && <span>{customFilter.button.label}</span>}
                      </button>
                    </div>
                  )}

                  {/* Header action buttons */}
                  {headerButtons.length > 0 && (
                    <div className="metrics-btn-group">
                      {headerButtons.map((button, index) =>
                        renderHeaderButton(button, index, "header")
                      )}
                    </div>
                  )}

                  {/* Collapse */}
                  {collapsible && (
                    <div className="metrics-btn-group">
                      <button
                        className="metrics-btn"
                        type="button"
                        aria-label={isCollapsed ? "Expand" : "Collapse"}
                        aria-expanded={!isCollapsed}
                        onClick={() => setIsCollapsed((prev) => !prev)}
                      >
                        <CollapseIcon collapsed={isCollapsed} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {progressBy && (() => {
              const progressTheme = getStatusTheme(selectedOption || progressBy);
              return (
                <div
                  className="progress"
                  role="progressbar"
                  aria-valuenow={progressValue}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`Progress: ${progressValue}%`}
                >
                  <div
                    className={`progress-bar ${progressTheme.className}`}
                    style={{ width: `${progressValue}%`, ...progressTheme.style }}
                  >
                    <p className="metrics-tag metrics-status">{progressValue}%</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Body ── */}
        <div className={`metrics-body view-${currentViewType}`}>
          {renderCurrentTemplate()}
        </div>

        {/* ── Custom filter panel ── */}
        {customFilter && customFilterOpen && (
          <div
            className="filter-slide-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={customFilter.title || "Custom Filter"}
            onClick={() => setCustomFilterOpen(false)}
          >
            <div
              className="filter-slide-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="metrics-header">
                <div className="metrics-container">
                  <h5>{customFilter.title || "Custom Filter"}</h5>
                  <button
                    className="metrics-btn"
                    type="button"
                    aria-label="Close filter panel"
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
