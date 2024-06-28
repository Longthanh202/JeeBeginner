import { ResultObjModel } from './../../../_core/models/_base.model';
import { map } from 'rxjs/operators';
import { CustomerModel, CustomerModelDTO } from './../Model/customer-management.model';
import { CustomerThongTinService } from './../Services/customer-thong-tin.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { CustomerManagementEditDialogComponent } from '../customer-management-edit-dialog/customer-management-edit-dialog.component';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth';
import { DatePipe } from '@angular/common';
import { CustomerStatusDialogComponent } from '../customer-status-dialog/customer-status-dialog.component';

const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';

@Component({
  selector: 'app-customer-thong-tin-list',
  templateUrl: './customer-thong-tin-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerThongTinListComponent implements OnInit, OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  displayedColumns = ['stt', 'tenungdung', 'ngayhethan', 'tinhtrang', 'ghichu'];
  idParam: string;
  customerModel: CustomerModelDTO;
  constructor(
    private changeDetect: ChangeDetectorRef,
    public customerThongTinService: CustomerThongTinService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    private auth: AuthService,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');
    const getCustomersb = this.customerThongTinService
      .getCustomer(+this.idParam)
      .pipe(
        map((res: ResultObjModel<CustomerModelDTO>) => {
          if (res && res.status === 1) {
            this.customerModel = res.data;
          }
        })
      )
      .subscribe();
    this.subscriptions.push(getCustomersb);
    this.filter();
    this.grouping = this.customerThongTinService.grouping;
    this.paginator = this.customerThongTinService.paginator;
    this.sorting = this.customerThongTinService.sorting;
    const sb = this.customerThongTinService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.customerThongTinService.fetchStateSort({ sorting });
  }

  filter() {
    const filter = {};
    filter['CustomerID'] = this.idParam;
    this.customerThongTinService.patchState({ filter });
  }

  paginate(paginator: PaginatorState) {
    this.customerThongTinService.fetchStateSort({ paginator });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  getDate(date: string) {
    return date.split(' ')[0];
  }
  getDateTime(date: string) {
    const time = date.split(' ')[1];
    const day = date.split(' ')[0];
    return time + ' ' + day;
  }

  create() {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerManagementEditDialogComponent, {
      data: {},
      width: '1200px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerThongTinService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerThongTinService.fetch();
      }
    });
  }

  format_date(value: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }

  getTileStatus(value: boolean) {
    if (value) return this.translate.instant('COMMOM.TAMKHOA');
    return this.translate.instant('COMMOM.DANGSUDUNG');
  }

  getColorStatus(value: boolean) {
    if (!value) return COLOR_DANGHIEULUC;
    return COLOR_HETHIEULUC;
  }
  updateStatus(item) {
    const CustomerID = +this.idParam;
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerStatusDialogComponent, {
      data: { item: item, CustomerID: CustomerID },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerThongTinService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerThongTinService.fetch();
      }
    });
  }
  goBack(): void {
    window.history.back();
  }
}
