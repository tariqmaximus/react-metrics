import React, { useMemo, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MetricsData } from "../lib";
import {
  metricsDataMock,
  metricsColumns,
  metricsStatusMap,
  metricsActionButtons,
  metricsHeaderButtons,
  metricsTheme,
  metricsCustomFilter,
  emptyMetricsData,
} from "../mock/metricsData.mock";

export default function MetricsDataExample() {
  const [lastAction, setLastAction] = useState("No action yet");

  const headerComponent = useMemo(
    () => <div className="metrics-tag">Demo Mode</div>,
    [],
  );

  const footerComponent = useMemo(
    () => <div className="metrics-tag">Example footer content</div>,
    [],
  );

  const handleRowAction = ({ action, row, rows }) => {
    const label = action || "unknown";
    const target =
      row?.name ||
      (Array.isArray(rows) ? `${rows.length} rows selected` : "no row");
    setLastAction(`${label} • ${target}`);
  };

  const sharedProps = {
    columns: metricsColumns,
    filterBy: "status",
    filterStyle: ["tabs", "dropdown", "keyword", "date"],
    sorting: true,
    paginated: true,
    pageSize: 5,
    actionButtons: metricsActionButtons,
    headerButtons: metricsHeaderButtons,
    showViewTypes: ["table", "grid", "pipeline"],
    viewTypes: ["table", "grid", "pipeline"],
    statusMap: metricsStatusMap,
    headerComponent,
    footerComponent,
    customFilter: metricsCustomFilter,
    theme: metricsTheme,
    onRowAction: handleRowAction,
  };

  return (
    <div className="metrics-data-example" style={{ padding: 16 }}>
      <h1>MetricsData Example</h1>
      <p style={{ marginBottom: 24 }}>
        Last clicked action: <strong>{lastAction}</strong>
      </p>

      <section style={{ marginBottom: 48 }}>
        <h2>Table view demo</h2>
        <MetricsData data={metricsDataMock} {...sharedProps} />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Grid view demo</h2>
        <p style={{ marginBottom: 12 }}>
          Use the view buttons in the header to switch to Grid view.
        </p>
        <MetricsData data={metricsDataMock} {...sharedProps} />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Pipeline view demo</h2>
        <p style={{ marginBottom: 12 }}>
          Use the view buttons in the header to switch to Pipeline view.
        </p>
        <MetricsData data={metricsDataMock} {...sharedProps} />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Empty state demo</h2>
        <MetricsData data={emptyMetricsData} {...sharedProps} />
      </section>
    </div>
  );
}
