import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { statusMap as defaultStatusMap } from './status-map';

interface CardButton {
  label?: string;
  icon?: string;
  targetId: string;
  action?: () => void;
  tooltip?: string;
  className?: string;
  isDropdown?: boolean;
  options?: string[];
  dropdownAction?: (selected: string) => void;
}

interface ActionButton {
  label?: string;
  tooltip: string;
  icon?: string;
  className?: string;
  isDropdown?: boolean;
  options?: string[];
  action?: (row: any) => void;
  dropdownAction?: (selected: string, row: any) => void;
}

let uniqueCounter = 0;

@Component({
  selector: 'metrics-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metrics-data.component.html',
  styleUrls: [
    './metrics-data.component.css',
    './views/metrics-data.table.css',
    './views/metrics-data.grid.css',
    './views/metrics-data.pipeline.css'
  ]
})
export class MetricsDataComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string }[] = [];
  @Input() autoGenerateColumns = true;
  @Input() excludeColumns: string[] = [];
  @Input() filterBy?: string;
  @Input() filterStyle: ('tabs' | 'dropdown' | 'date' | 'keyword' | 'none')[] = [];
  @Input() searchButton = true;
  @Input() Sorting = false;
  @Input() pageSize = 10;
  @Input() paginated = false;
  @Input() showActions = true;
  @Input() actionButtons: ActionButton[] = [];
  @Input() headerButtons: CardButton[] = [];
  private _viewTypes: CardButton[] = [];
  @Input() set viewTypes(value: (string | CardButton)[]) {
    // Auto-enable viewTypes display when provided
    if (value && value.length > 0) {
      this.showViewTypes = true;
    }
    this._viewTypes = value.map(vt => {
      if (typeof vt === 'string') {
        const label = vt;
        const icon = this.getIconForViewType(label);
        const action = this.getActionForViewType(label);
        return {
          label,
          icon,
          targetId: `${this.internalIdPrefix}-view-${label.toLowerCase()}`,
          action,
          tooltip: `${label} View`,
          className: `view-btn view-btn-${label.toLowerCase()}`
        };
      } else {
        return vt;
      }
    });
  }
  get viewTypes(): CardButton[] {
    return this._viewTypes;
  }
  @Input() showViewTypes = false;
  @Input() collapsible = false;
  @Input() variant = '';
  @Input() metricsHeader = true;
  @Input() showFooter = false;
  @Input() icon?: string;
  @Input() title?: string;
  @Input() sub?: string;
  @Input() mediaImage = '';
  @Input() nameLetters = '';
  @Input() mediaStatus = '';
  @Input() idPrefix?: string;
  @Input() valueLenthColumns: string[] = [];
  @Input() progressBy?: string;
  @Input() statusMap: Record<string, string> = defaultStatusMap;
  @Output() rowAction = new EventEmitter<{ action: string; row: any }>();
  internalIdPrefix!: string;
  isCollapsed = false;
  activeRowIndex: number | null = null;
  selectedRows: any[] = [];
  filteredData: any[] = [];
  searchKeyword = '';
  selectedOption = '';
  currentPage = 1;
  sortKey: string | null = null;
  sortAsc: boolean = true;
  dropdownShownIndex: number | null = null;
  imageLoadFailedMap: Record<string, boolean> = {};
  currentViewType: 'table' | 'grid' | 'pipeline' = 'table';

  // Calendar
  selectedDate: Date = new Date();
  selectedMonth = this.selectedDate.getMonth();
  selectedYear = this.selectedDate.getFullYear();
  datePicker = false;
  calendarDays: (Date | null)[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = Array.from({ length: 100 }, (_, i) => 1980 + i);
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.internalIdPrefix = this.idPrefix || `smart-table-${uniqueCounter++}`;
    this.normalizeActionButtons();
    this.setColumns();
    this.filteredData = [...this.data];
    this.initializeViewTypes();
    this.applyFilters();
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(item => {
      const keywordMatch = !this.searchKeyword || Object.values(item).some(val => String(val).toLowerCase().includes(this.searchKeyword.toLowerCase()));
      const optionMatch = !this.selectedOption || item[this.searchKey] === this.selectedOption;
      const itemDate = item.date ? new Date(item.date) : null;
      const dateMatch = !this.filterStyle.includes('date') || !this.datePicker || !itemDate || (itemDate.toDateString() === this.selectedDate.toDateString());
      return keywordMatch && optionMatch && dateMatch;
    });

    if (this.sortKey) {
      this.filteredData.sort((a, b) => {
        const aVal = a[this.sortKey!];
        const bVal = b[this.sortKey!];
        return this.sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }

    this.currentPage = 1;
  }

  setColumns(): void {
    if ((!this.columns || this.columns.length === 0) && this.autoGenerateColumns && this.data.length > 0) {
      const keys = Object.keys(this.data[0]).filter(k => !this.excludeColumns.includes(k));
      this.columns = keys.map(key => ({ key, label: this.toLabel(key) }));
    }

    if (this.showActions && this.actionButtons.length > 0 && !this.columns.some(c => c.key === 'action')) {
      this.columns.push({ key: 'action', label: 'Actions' });
    }
  }

  sortByColumn(key: string): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  getTabCount(option: string): number {
    return this.filteredData.filter(item => item[this.searchKey] === option).length;
  }

  get prefix(): string { return this.internalIdPrefix; }
  get searchKey(): string { return this.filterBy || ''; }
  get searchOptions(): string[] {
    return [...new Set(this.data.map(item => item[this.searchKey]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }
  get pagedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.paginated ? this.filteredData.slice(start, start + this.pageSize) : this.filteredData;
  }
  get totalPages(): number { return Math.ceil(this.filteredData.length / this.pageSize); }

  get progressValue(): number {
    if (!this.progressBy || !this.searchKey || !this.data.length) return 0;
    const statusToCheck = this.selectedOption || this.progressBy;
    const total = this.data.length;
    const match = this.data.filter(item => item[this.searchKey] === statusToCheck).length;
    return Math.round((match / total) * 100);
  }

  toggleCalendar(): void {
    this.datePicker = !this.datePicker;
    if (this.datePicker) this.generateCalendar();
  }

  onMonthOrYearChange(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
    const totalDays = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    const startDay = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(new Date(this.selectedYear, this.selectedMonth, d));
    this.calendarDays = days;
  }

  isSelected(date: Date | null): boolean {
    return !!date && date.getDate() === this.selectedDate.getDate() && date.getMonth() === this.selectedDate.getMonth() && date.getFullYear() === this.selectedDate.getFullYear();
  }

  selectDate(date: Date | null): void {
    if (date && !isNaN(date.getTime())) this.selectedDate = new Date(date);
  }

  confirm(): void {
    this.applyFilters();
    this.datePicker = false;
  }

  cancel(): void {
    this.datePicker = false;
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownShownIndex = this.dropdownShownIndex === index ? null : index;
  }

@HostListener('document:click', ['$event'])
onOutsideClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  // Check if clicked element is inside the date-picker or the toggle button
  const clickedInsideDatePicker = target.closest('.date-picker');
  const clickedCalendarButton = target.closest('.metrics-btn');

  if (!clickedInsideDatePicker && !clickedCalendarButton) {
    this.datePicker = false;
    this.dropdownShownIndex = null; // also close dropdowns
  }
}


  selectTabOption(option: string): void {
    this.selectedOption = option;
    this.applyFilters();
  }

  normalizeActionButtons(): void {
    this.actionButtons = this.actionButtons.map(btn => typeof btn === 'string' ? { label: btn, tooltip: btn, className: 'btn' } : btn);
  }

  handleImageError(event: Event, row: any): void {
    const key = row?.id || row?.[this.searchKey] || row?.name || JSON.stringify(row);
    this.imageLoadFailedMap[key] = true;
    (event.target as HTMLImageElement).src = '';
  }

  handleButtonClick(btn: ActionButton, row: any): void {
    btn.action?.(row);
    this.rowAction.emit({ action: btn.label || '', row });
  }

  handleDropdownClick(option: string, btn: ActionButton | CardButton, row: any): void {
    if ('dropdownAction' in btn) {
      const action = btn.dropdownAction as ((option: string, row?: any) => void);
      action(option, row);
    }
  }

  toggleRowClass(i: number): void {
    this.activeRowIndex = this.activeRowIndex === i ? null : i;
  }

  toggleCard(): void {
    if (this.collapsible) this.isCollapsed = !this.isCollapsed;
  }

  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }

  toggleSelectRow(row: any, e: Event): void {
    const cb = e.target as HTMLInputElement;
    cb.checked ? this.selectedRows.push(row) : this.selectedRows = this.selectedRows.filter(r => r !== row);
  }

  toggleAllRows(e: Event): void {
    const cb = e.target as HTMLInputElement;
    this.selectedRows = cb.checked ? [...this.pagedData] : [];
  }

  isAllSelected(): boolean {
    return this.pagedData.length > 0 && this.selectedRows.length === this.pagedData.length;
  }

  handleBulkAction(btn: ActionButton): void {
    if (!this.selectedRows.length) return alert('Please select at least one row.');
    btn.action?.(this.selectedRows);

    if (btn.dropdownAction && btn.options?.length) {
      const userChoice = prompt(`Choose an option: ${btn.options.join(', ')}`) || btn.options[0];
      this.selectedRows.forEach(row => btn.dropdownAction!(userChoice, row));
    }
  }

  onSearchKeywordChange(value: string): void {
    this.searchKeyword = value;
    this.applyFilters();
  }

  executeAction(button: CardButton): void {
    button.action?.();
  }

  initializeViewTypes(): void {
    // If viewTypes are already provided, they are already normalized
    if (this.viewTypes && this.viewTypes.length > 0) {
      return;
    }

    // If showViewTypes is false, don't initialize defaults
    if (!this.showViewTypes) {
      this.viewTypes = [];
      return;
    }

    // Initialize default view type buttons
    this.viewTypes = [
      {
        label: 'table',
        icon: 'bi bi-list-ul',
        targetId: `${this.internalIdPrefix}-view-table`,
        action: () => this.switchTotableView(),
        tooltip: 'table View',
        className: 'view-btn view-btn-table'
      },
      {
        label: 'Grid',
        icon: 'bi bi-grid-3x3-gap',
        targetId: `${this.internalIdPrefix}-view-grid`,
        action: () => this.switchToGridView(),
        tooltip: 'Grid View',
        className: 'view-btn view-btn-grid'
      },
      {
        label: 'Pipeline',
        icon: 'bi bi-kanban',
        targetId: `${this.internalIdPrefix}-view-pipeline`,
        action: () => this.switchToPipelineView(),
        tooltip: 'Pipeline View',
        className: 'view-btn view-btn-pipeline'
      }
    ];
  }

  switchTotableView(): void {
    this.currentViewType = 'table';
  }

  switchToGridView(): void {
    this.currentViewType = 'grid';
  }

  switchToPipelineView(): void {
    this.currentViewType = 'pipeline';
  }

  getIconForViewType(viewType: string): string {
    switch (viewType.toLowerCase()) {
      case 'table': return 'bi bi-list-ul';
      case 'grid': return 'bi bi-grid-3x3-gap';
      case 'pipeline': return 'bi bi-kanban';
      default: return 'bi bi-view-list';
    }
  }

  getActionForViewType(viewType: string): () => void {
    switch (viewType.toLowerCase()) {
      case 'table': return () => this.switchTotableView();
      case 'grid': return () => this.switchToGridView();
      case 'pipeline': return () => this.switchToPipelineView();
      default: return () => this.switchTotableView();
    }
  }

  getRowsByStatus(status: string): any[] {
    return this.filteredData.filter(row => row.status === status);
  }

  toLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  trackByIndex(index: number): number {
    return index;
  }

  shouldApplyValueLenth(key: string): boolean {
    return this.valueLenthColumns.includes(key);
  }

  get categoryBreakdown(): { name: string; count: number; percent: number }[] {
    if (!this.searchKey) return [];
    const total = this.filteredData.length;
    const counts: Record<string, number> = {};
    for (const item of this.filteredData) {
      const key = item[this.searchKey];
      if (key) counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count, percent: total ? Math.round((count / total) * 100) : 0 }));
  }
    getStatusStyles(status: string): { tagClass: string; progressClass: string } {
    const color = this.statusMap?.[status?.toLowerCase()] || 'info';
    return {
      tagClass: `metrics-tag ${color}`,
      progressClass: `progress-bar ${color}`
    };
  }

  getValue(row: any, key: string): string {
    const val = row?.[key];
    return val !== undefined && val !== null ? String(val) : '-';
  }

  getShortValue(row: any, key: string, maxLength = 40): string {
    const value = this.getValue(row, key);
    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
  }

  getRowProgress(row: any): number | null {
    if (!row) return null;
    const value = row.progress ?? row.percentage ?? row.percent;
    const num = Number(value);
    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
  }

  getDataKeys(row: any): string[] {
    if (!row || typeof row !== 'object') return [];
    const exclude = ['status', 'mediaTile', 'description'];
    return Object.keys(row).filter(key => !exclude.includes(key));
  }
}
