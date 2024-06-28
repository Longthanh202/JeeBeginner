import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Widget, WidgetModel, WidgetShow } from '../../Model/page-girdters-dashboard.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageGirdtersDashboardService } from '../../Services/page-girdters-dashboard.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { LayoutUtilsService } from '../../../_core/utils/layout-utils.service';
import { X } from '@angular/cdk/keycodes';
// Services

// Models

@Component({
  selector: 'm-add-close-widget-dialog',
  templateUrl: './add-close-widget-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCloseWidgetDialogComponent implements OnInit {
  public listWidget: Widget[] = [];
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  showWidgets: WidgetShow[] = [];
  dataSource = new MatTableDataSource(this.showWidgets);
  displayedColumns = [];
  availableColumns = [
    {
      stt: 1,
      name: 'Title',
      alwaysChecked: false,
    },
    {
      stt: 99,
      name: 'IsHienThi',
      alwaysChecked: false,
    },
  ];
  selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  selection = new SelectionModel<WidgetShow>(true, []);

  constructor(
    public dialogRef: MatDialogRef<AddCloseWidgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public pageGirdtersDashboardService: PageGirdtersDashboardService,
    private danhMucService: DanhMucChungService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService
  ) {}
  /** LOAD DATA */
  ngOnInit() {
    this.createListWidget();

    // If the user changes the sort order, reset back to the first page.
    // Read from URL itemId, for restore previous state
    this.applySelectedColumns();

    this.LoadDataList();
  }

  createListWidget() {
    this.listWidget = this.pageGirdtersDashboardService.getWidgets();
  }

  LoadDataList() {
    this.showWidgets = [];
    this.pageGirdtersDashboardService.getDSWidget().subscribe((res) => {
      if (res && res.status === 1) {
        this.showListWidget(res.data);
      } else {
        this.showListWidget();
      }
      this.refreshDataSource();
    });
  }

  applySelectedColumns() {
    const _selectedColumns: string[] = [];
    this.selectedColumns.selected
      .sort((a, b) => {
        return a.stt > b.stt ? 1 : 0;
      })
      .forEach((col) => {
        _selectedColumns.push(col.name);
      });
    this.displayedColumns = _selectedColumns;
  }

  showListWidget(data?: Widget[]) {
    this.listWidget.forEach((widget) => {
      const wid = new WidgetShow();
      wid.id = widget.id;
      wid.name = widget.name;
      wid.isHienThi = false;
      if (data) {
        if (data.find((item) => item.id == widget.id)) {
          wid.isHienThi = true;
        }
        this.showWidgets.push(wid);
      } else {
        this.showWidgets.push(wid);
      }
    });
  }
  refreshDataSource() {
    this.dataSource = new MatTableDataSource(this.showWidgets);
    this.selection.clear();
    for (var i = 0; i < this.dataSource.data.length; i++) {
      this.selection.select(this.dataSource.data[i]);
    }
    this.changeDetectorRefs.detectChanges();
  }

  ChangInfo(val: any, row: WidgetShow) {
    this.loadingSubject.next(true);
    if (val.checked === false) {
      this.pageGirdtersDashboardService.deleteWidget(+row.id).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
        }
        this.loadingSubject.next(true);
      });
    } else {
      let wid = this.listWidget.find((x) => x.id == row.id);
      let widget = new WidgetModel(wid);
      this.pageGirdtersDashboardService.createWidget(widget).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
        }
        this.loadingSubject.next(true);
      });
    }
  }

  //==========================================================
  goBack() {
    this.dialogRef.close();
  }
}
