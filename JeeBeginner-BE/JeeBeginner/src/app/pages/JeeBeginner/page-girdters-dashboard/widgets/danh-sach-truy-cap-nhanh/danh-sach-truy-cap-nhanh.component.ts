import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, OnDestroy } from '@angular/core';
// Material
// RXJS
import { Subscription } from 'rxjs';
// Services
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
// Models
import { QueryParamsModel } from '../../../_core/models/query-models/query-params.model';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { PageGirdtersDashboardService } from '../../Services/page-girdters-dashboard.service';
@Component({
  selector: 'm-danh-sach-truy-cap-nhanh-widget',
  templateUrl: './danh-sach-truy-cap-nhanh.component.html',
})
export class DanhSachTruyCapNhanhWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<any>;
  resizeSub: Subscription;

  listTruyCap: any[] = [];
  listXoa: any[] = [];
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private danhmuc: DanhMucChungService,
    private pageGirdtersDashboardService: PageGirdtersDashboardService
  ) {}

  ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {});

    this.loadDataTruyCap();
  }

  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }

  loadDataTruyCap() {
    const queryParams = new QueryParamsModel(this.filterConfiguration());
    this.pageGirdtersDashboardService.findDataTruyCap(queryParams).subscribe((res) => {
      if (res.status == 1) {
        this.listTruyCap = res.data;
      } else {
        this.listTruyCap = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  clickLuu(row: any) {
    this.danhmuc.Delete_TruyCapNhanh(row.ID, row.Type).subscribe((res) => {
      if (res && res.status === 1) {
        this.listXoa = [];
        this.loadDataTruyCap();
      } else {
        this.listXoa = [];
        this.loadDataTruyCap();
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 10000, true, false, 3000, 'top', 0);
      }
    });
  }
}
