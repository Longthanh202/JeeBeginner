import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Dashboard, Widget, WidgetModel } from './Model/page-girdters-dashboard.model';
import { MatDialog } from '@angular/material/dialog';
import { PageGirdtersDashboardService } from './Services/page-girdters-dashboard.service';
import { ResultModel } from '../_core/models/_base.model';
import { AddCloseWidgetDialogComponent } from './widgets/add-close-widget-dialog/add-close-widget-dialog.component';

@Component({
  selector: 'm-page-girdters-dashboard',
  templateUrl: './page-girdters-dashboard.component.html',
  styleUrls: ['page-girdters-dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageGidtersDashboardComponent implements OnInit {
  public listWidget: Widget[] = [];
  public options: GridsterConfig;
  public WidgetDashboard: Dashboard;
  public dashboard: Array<GridsterItem>;
  private resizeEvent: EventEmitter<any> = new EventEmitter<any>();
  private configureEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showConfig: boolean = false;

  public inputs = {
    widget: '',
    resizeEvent: this.resizeEvent,
    configureEvent: this.configureEvent,
  };

  public outputs = {
    onSomething: (type) => console.log(type),
  };

  showSetting: boolean[] = [];
  constructor(
    private changeDetect: ChangeDetectorRef,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private pageGirdtersDashboardService: PageGirdtersDashboardService
  ) {}

  ngOnInit() {
    this.listWidget = this.pageGirdtersDashboardService.getWidgets();
    this.WidgetDashboard = new Dashboard();
    this.options = this.pageGirdtersDashboardService.getDashBoardOptions();
    this.options.displayGrid = DisplayGrid.OnDragAndResize;
    this.options.itemChangeCallback = (item: Widget) => {
      const widget = new WidgetModel(item);
      this.pageGirdtersDashboardService.postUpdateWidget(widget).subscribe((res) => {
        if (res && res.status === 1) {
          this.resizeEvent.emit(item);
        }
      });
    };
    this.options.itemResizeCallback = (item: Widget) => {
      const widget = new WidgetModel(item);
      this.pageGirdtersDashboardService.postUpdateWidget(widget).subscribe((res) => {
        if (res && res.status === 1) {
          this.resizeEvent.emit(item);
        }
      });
    };

    this.pageGirdtersDashboardService.getDSWidget().subscribe((res: ResultModel<Widget>) => {
      if (res.data.length > 0) {
        this.WidgetDashboard.widgets = res.data;
        this.WidgetDashboard.widgets.forEach((widget: Widget) => {
          if (widget.componentName === this.listWidget[0].componentName) {
            widget.componentType = this.listWidget[0].componentType;
          }
          if (widget.componentName === this.listWidget[1].componentName) {
            widget.componentType = this.listWidget[1].componentType;
          }
          if (widget.componentName === this.listWidget[2].componentName) {
            widget.componentType = this.listWidget[2].componentType;
          }
        });
      } else {
        this.dashboard = [];
      }
      this.dashboard = this.WidgetDashboard.widgets;
      this.changeDetectorRefs.detectChanges();
    });
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  getInput(wiget: Widget): any {
    const inputs = {
      widget: wiget,
      resizeEvent: this.resizeEvent,
      configureEvent: this.configureEvent,
    };
    return inputs;
  }

  getShowSetting(id, mouseover: boolean) {
    if (mouseover) {
      this.showSetting = [];
      this.showSetting[id] = true;
    } else {
      this.showSetting = [];
    }
  }

  closeWidget(id: number) {
    this.pageGirdtersDashboardService.deleteWidget(id).subscribe((res) => {
      if (res && res.status === 1) {
        this.ngOnInit();
        this.changeDetect.detectChanges();
      }
    });
  }
  AddCloseWidget() {
    const dialogRef = this.dialog.open(AddCloseWidgetDialogComponent, {
      data: {},
      position: { top: '60px' },
      panelClass: 'no-padding',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
      this.changeDetect.detectChanges();
    });
  }
}
