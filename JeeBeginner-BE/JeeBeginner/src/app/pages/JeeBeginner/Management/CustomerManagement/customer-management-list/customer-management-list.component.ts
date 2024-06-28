import { CustomerImportEditDialogComponent } from './../customer-import-edit-dialog/customer-import-edit-dialog.component';
import { CustomerAddDeleteAppDialogComponent } from './../customer-add-delete-app-dialog/customer-add-delete-app-dialog.component';
import { CustomerThongTinService } from './../Services/customer-thong-tin.service';
import { CustomerGiaHanEditDialogComponent } from './../customer-gia-han-edit-dialog/customer-gia-han-edit-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenStorage } from 'src/app/modules/auth/_services/token-storage.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { CustomerManagementService } from '../Services/customer-management.service';
import { CustomerManagementEditDialogComponent } from '../customer-management-edit-dialog/customer-management-edit-dialog.component';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth';
import { CustomerAddNumberStaffDialogComponent } from '../customer-add-number-staff-dialog/customer-add-number-staff-dialog.component';
import { CustomerResetPasswordDialog } from '../customer-reset-password/customer-reset-password.component';
import { DateFilterCustomer } from '../Model/DateFilter-customer.model';
import { showSearchFormModel } from '../../../_shared/jee-search-form/jee-search-form.model';

@Component({
  selector: 'app-customer-management-list',
  templateUrl: './customer-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerManagementListComponent implements OnInit, OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  dateFilter: DateFilterCustomer;
  loadingDateFilter$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];
  displayedColumns = ['thongtinkhachhang', 'thongtinnguoihotro', 'dienthoainguoidaidien', 'thongtinsudung', 'ThaoTac'];
  showSearch = new showSearchFormModel();
  constructor(
    private changeDetect: ChangeDetectorRef,
    public customerManagementService: CustomerManagementService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    private auth: AuthService,
    public customerThongTinService: CustomerThongTinService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDateFilter();
    this.customerManagementService.fetch();
    this.grouping = this.customerManagementService.grouping;
    this.paginator = this.customerManagementService.paginator;
    this.sorting = this.customerManagementService.sorting;
    const sb = this.customerManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    this.configShowSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getDateFilter() {
    this.loadingDateFilter$.next(true);
    const sb = this.customerManagementService.getDateFilterCustomer().subscribe(
      (res) => {
        this.loadingDateFilter$.next(false);
        this.dateFilter = res;
      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(sb);
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
    this.customerManagementService.patchState({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.customerManagementService.patchState({ paginator });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  // 05/05/2021 09:40:58 => 05/05/2021
  getDate(date: string) {
    return date.split(' ')[0];
  }
  // 05/05/2021 09:40:58 => 09:40:58 05/05/2021
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
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }

  giaHan(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerGiaHanEditDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  addNumberStaff(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerAddNumberStaffDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  resetPassword(item) {
    const CustomerID = item.RowID;
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerResetPasswordDialog, {
      data: { item: item, CustomerID: CustomerID },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  lockCustomer(item) {
    const message = 'Bạn có muốn khoá khách hàng này không? Lưu ý: Quá trình khoá không thể hoàn tác.';
    const dialog = this.layoutUtilsService.deleteElement('', message);
    dialog.afterClosed().subscribe((x) => {
      if (x) {
        this.customerThongTinService.UpdateLock(item.RowID).subscribe(
          () => {
            this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Create, 4000, true, false);
            this.customerManagementService.fetch();
          },
          (error) => {
            this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        );
      }
    });
  }
  addDeleteApp(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerAddDeleteAppDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }
  unLockCustomer(item) {
    const message = 'Bạn có muốn mở khoá khách hàng này không? Lưu ý: Quá trình mở khoá không thể hoàn tác.';
    const dialog = this.layoutUtilsService.deleteElement('', message);
    dialog.afterClosed().subscribe((x) => {
      if (x) {
        this.customerThongTinService.UpdateUnLock(item.RowID).subscribe(
          () => {
            this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Create, 4000, true, false);
            this.customerManagementService.fetch();
          },
          (error) => {
            this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        );
      }
    });
  }

  filter() {
    const filter = {};

    this.customerManagementService.patchState({ filter });
  }

  filterDaKhoa() {
    const filter = {};
    filter['dakhoa'] = true;
    this.customerManagementService.patchState({ filter });
  }
  filterDangSuDung() {
    const filter = {};
    filter['dangsudung'] = true;
    const ListCustomerIDSDangSuDung = this.dateFilter.ListCustomerIDSDangSuDung;
    filter['ListCustomerIDSDangSuDung'] = ListCustomerIDSDangSuDung;
    this.customerManagementService.patchState({ filter });
  }
  filterSapHetHan() {
    const filter = {};
    filter['saphethan'] = true;
    const ListCustomerIDSapHetHan = this.dateFilter.ListCustomerIDSapHetHan;
    filter['ListCustomerIDSapHetHan'] = ListCustomerIDSapHetHan;
    this.customerManagementService.patchState({ filter });
  }
  filterDaHetHan() {
    const filter = {};
    filter['dahethan'] = true;
    const ListCustomerIDHetHan = this.dateFilter.ListCustomerIDHetHan;
    filter['ListCustomerIDHetHan'] = ListCustomerIDHetHan;
    this.customerManagementService.patchState({ filter });
  }
  filterAll() {
    const filter = {};
    this.customerManagementService.patchState({ filter });
  }

  changeKeyword(val) {
    this.search(val);
  }

  changeFilter(filter) {
    this.customerManagementService.patchState({ filter });
  }

  search(searchTerm: string) {
    this.customerManagementService.patchState({ searchTerm });
  }

  configShowSearch() {
    this.showSearch.dakhoa = false;
    this.showSearch.isAdmin = false;
    this.showSearch.username = false;
    this.showSearch.titlekeyword = 'SEARCH.SEARCH4';
    this.changeDetect.detectChanges();
  }

  import() {
    const saveMessage = this.translate.instant('COMMOM.IMPORTHANHCONG');
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerImportEditDialogComponent, {
      data: {},
      width: '1200px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }
}
