export interface DashboardOptions {
  gridType: any;
  compactType: any;
  margin: number;
  outerMargin: boolean;
  outerMarginTop: null;
  outerMarginRight: null;
  outerMarginBottom: null;
  outerMarginLeft: null;
  mobileBreakpoint: number;
  minCols: number;
  maxCols: number;
  minRows: number;
  maxRows: number;
  maxItemCols: number;
  minItemCols: number;
  maxItemRows: number;
  minItemRows: number;
  maxItemArea: number;
  minItemArea: number;
  defaultItemCols: number;
  defaultItemRows: number;
  fixedColWidth: number;
  fixedRowHeight: number;
  keepFixedHeightInMobile: boolean;
  keepFixedWidthInMobile: boolean;
  scrollSensitivity: number;
  scrollSpeed: number;
  enableEmptyCellClick: boolean;
  enableEmptyCellContextMenu: boolean;
  enableEmptyCellDrop: boolean;
  enableEmptyCellDrag: boolean;
  emptyCellDragMaxCols: number;
  emptyCellDragMaxRows: number;
  ignoreMarginInRow: boolean;
  draggable: any;
  resizable: {
    enabled: boolean;
  };
  swap: boolean;
  pushItems: boolean;
  disablePushOnDrag: boolean;
  disablePushOnResize: boolean;
  pushDirections: { north: true; east: true; south: true; west: true };
  pushResizeItems: boolean;
  displayGrid: any;
  disableWindowResize: boolean;
  disableWarnings: boolean;
  scrollToNewItems: boolean;
  itemChangeCallback: any;
  itemResizeCallback: any;
}

export class Dashboard {
  widgets: Widget[];
  constructor() {
    this.widgets = [];
  }
}

export class WidgetShow {
  id: string;
  name: string;
  isHienThi: boolean;
}

export class Widget {
  id: string;
  name: string;
  componentName: string;
  componentType: Object;
  cols: number;
  rows: number;
  y: number;
  x: number;
}

export class WidgetModel {
  Id: number;
  Name: string;
  ComponentName: string;
  Cols: number;
  Rows: number;
  x: number;
  y: number;
  constructor(widget: Widget) {
    this.Id = +widget.id;
    this.Name = widget.name;
    this.ComponentName = widget.componentName;
    this.Cols = widget.cols;
    this.Rows = widget.rows;
    this.x = widget.x;
    this.y = widget.y;
  }
}
