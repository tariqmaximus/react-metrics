import type { ReactNode } from "react";

export interface MetricsDataActionButton {
  label?: string;
  icon?: string;
  tooltip?: string;
  className?: string;
  action?: string | ((row?: any, option?: any) => void);
  options?: string[];
  dropdownAction?: (option: any, row?: any) => void;
  isDropdown?: boolean;
  actionHandler?: () => void;
  onClick?: () => void;
  targetId?: string;
}

export interface MetricsDataCustomFilterField {
  key: string;
  label?: string;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
}

export interface MetricsDataCustomFilterButton {
  label?: string;
  icon?: string;
  tooltip?: string;
  className?: string;
}

export interface MetricsDataCustomFilter {
  title?: string;
  button?: MetricsDataCustomFilterButton;
  fields?: MetricsDataCustomFilterField[];
  initialValues?: Record<string, any>;
  onApply?: (filters: Record<string, any>) => void;
  onReset?: (filters: Record<string, any>) => void;
}

export interface MetricsDataTheme {
  background?: string;
  surface?: string;
  surfaceAlt?: string;
  text?: string;
  textMuted?: string;
  heading?: string;
  border?: string;
  borderLight?: string;
  primary?: string;
  success?: string;
  warning?: string;
  info?: string;
  danger?: string;
  cardBg?: string;
  headerBg?: string;
  tableHeaderBg?: string;
  gridBg?: string;
  pipelineBg?: string;
  radius?: string;
  cardRadius?: string;
  shadow?: string;
  cardShadow?: string;
  cardHoverShadow?: string;
  variables?: Record<string, string>;
}

export interface MetricsDataStatusMapValue {
  text?: string;
  background?: string;
  border?: string;
}

export type MetricsDataStatusMap = Record<string, string | MetricsDataStatusMapValue>;

export interface MetricsDataProps {
  data?: Array<Record<string, any>>;
  columns?: Array<{ key: string; label?: string }>;
  autoGenerateColumns?: boolean;
  excludeColumns?: string[];
  filterBy?: string;
  filterStyle?: string[] | string;
  Sorting?: boolean;
  sorting?: boolean;
  pageSize?: number;
  paginated?: boolean;
  showActions?: boolean;
  actionButtons?: MetricsDataActionButton[];
  headerButtons?: MetricsDataActionButton[];
  viewTypes?: Array<string | { view?: string; action?: string; label?: string; tooltip?: string; className?: string; icon?: string }>;
  showViewTypes?: boolean | string[];
  showViewSwitcher?: boolean;
  defaultView?: string;
  view?: string;
  collapsible?: boolean;
  variant?: string;
  metricsHeader?: boolean;
  showFooter?: boolean;
  icon?: string;
  title?: string;
  sub?: string;
  progressBy?: string;
  showKpis?: Array<{ card?: string; label?: string; value?: any; change?: any; subtitle?: string; icon?: string }>;
  mediaImage?: string;
  mediaDetailsRenderer?: (row: any) => ReactNode;
  mediaDetailsKeys?: string[];
  idPrefix?: string;
  theme?: MetricsDataTheme;
  statusMap?: MetricsDataStatusMap;
  valueLengthColumns?: string[];
  searchKey?: string;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  onRowAction?: (payload: { action?: string; row?: any; rows?: any[] }) => void;
  customFilter?: MetricsDataCustomFilter | null;
}

export default function MetricsData(props: MetricsDataProps): JSX.Element;
