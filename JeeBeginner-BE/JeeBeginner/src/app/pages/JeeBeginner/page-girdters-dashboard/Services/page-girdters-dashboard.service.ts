import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpUtilsService } from '../../_core/utils/http-utils.service';
import { Injectable } from '@angular/core';
import { Dashboard, DashboardOptions, Widget, WidgetModel } from '../Model/page-girdters-dashboard.model';
import { GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { QueryParamsModel } from '../../_core/models/query-models/query-params.model';
import { QueryResultsModel } from '../../_core/models/query-models/query-results.model';
import { DanhSachTruyCapNhanhWidgetComponent } from '../widgets/danh-sach-truy-cap-nhanh/danh-sach-truy-cap-nhanh.component';

interface IDashboardService {
  saveUserDashBoard(): void;
  getDashBoardOptions(): DashboardOptions;
}
const API_PRODUCTS_URL = environment.ApiRoot + '/widgetdashboard';

@Injectable()
export class PageGirdtersDashboardService implements IDashboardService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  saveUserDashBoard(): void { }

  public getWidgets(): Widget[] {
    const listWidget: Widget[] = [
      {
        id: '1',
        name: 'Danh sách truy cập nhanh',
        componentName: 'm-danh-sach-truy-cap-nhanh-widget',
        componentType: DanhSachTruyCapNhanhWidgetComponent,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
      },
    ];
    return listWidget;
  }

  public getDashBoardOptions(): DashboardOptions {
    return {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 20,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      mobileBreakpoint: 734,
      //
      minCols: 24,
      //
      maxCols: 24,
      //
      minRows: 10,
      maxRows: 200,
      //
      maxItemCols: 24,
      //
      minItemCols: 6,
      maxItemRows: 100,
      //
      minItemRows: 4,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 68.75,
      fixedRowHeight: 75,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 100,
      emptyCellDragMaxRows: 100,
      ignoreMarginInRow: false,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'drag-handler',
        dropOverItems: false,
      },
      resizable: {
        enabled: true,
      },
      swap: true,
      pushResizeItems: true,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      displayGrid: function () { },
      //displayGrid: DisplayGrid.None,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      itemChangeCallback: function () { },
      itemResizeCallback: function () { },
    };
  }

  getDSWidget(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Get_DSWidget';
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  postUpdateWidget(wiget: WidgetModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Post_UpdateWidget';
    return this.http.post<any>(url, wiget, {
      headers: httpHeaders,
    });
  }

  deleteWidget(id: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Delete/WidgetId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  createWidget(wiget: WidgetModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Create_Widget';
    return this.http.post<any>(url, wiget, {
      headers: httpHeaders,
    });
  }

  //========Danh sách truy cập==========================================
  findDataTruyCap(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_PRODUCTS_URL + '/Get_DSTruyCapNhanh';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }
}
