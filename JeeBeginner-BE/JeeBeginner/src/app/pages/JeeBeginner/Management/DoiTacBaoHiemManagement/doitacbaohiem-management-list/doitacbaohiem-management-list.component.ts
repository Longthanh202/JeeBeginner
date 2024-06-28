
import { DoiTacBaoHiemManagementEditDialogComponent } from '../doitacbaohiem-management-edit-dialog/doitacbaohiem-management-edit-dialog.component';
import { DoiTacBaoHiemManagementImportDialogComponent } from '../doitacbaohiem-management-inport-dialog/doitacbaohiem-management-import-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { QueryParamsModelNew } from '../../../_core/models/query-models/query-params.model';
import { DeleteEntityDialogComponent } from '../../../_shared/delete-entity-dialog/delete-entity-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorage } from '../../../../../modules/auth/_services/token-storage.service';
import { DoiTacBaoHiemManagementService } from '../Services/doitacbaohiem-management.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
// import { nhanhieuModels, DoiTacBaoHiemDeleteModel } from '../Model/DoiTacBaoHiem-management.model';
import { DoiTacBaoHiemModel } from '../Model/doitacbaohiem-management.model';
import { AuthService } from 'src/app/modules/auth';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { ResultModel } from '../../../_core/models/_base.model';
//import { DoiTacBaoHiemManagementStatusDialogComponent } from '../DoiTacBaoHiem-management-status-dialog/DoiTacBaoHiem-management-status-dialog.component';

const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';

@Component({
  selector: 'app-doitacbaohiem-management-list',
  templateUrl: './doitacbaohiem-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DoiTacBaoHiemManagementListComponent
  implements
  OnInit,
  OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;


  selection = new SelectionModel<DoiTacBaoHiemModel>(true, []);
  searchGroup: FormGroup;
  DoiTacBaoHiemsResult: DoiTacBaoHiemModel[] = [];
  private subscriptions: Subscription[] = [];
  displayedColumns = ['stt', 'TenDonVi','DiaChi','SoDT','NguoiLienHe','GhiChu','thaotac'];
  previousIndex: number;
  partnerFilters: PartnerFilterDTO[] = [];
  Visible: boolean;
  constructor(
    private changeDetect: ChangeDetectorRef,
    public doitacbaohiemManagementService: DoiTacBaoHiemManagementService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    public auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.doitacbaohiemManagementService.fetch();
    this.grouping = this.doitacbaohiemManagementService.grouping;
    this.paginator = this.doitacbaohiemManagementService.paginator;
    this.sorting = this.doitacbaohiemManagementService.sorting;
    const sb = this.doitacbaohiemManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    debugger;
    const vi = this.doitacbaohiemManagementService
      .IsReadOnlyPermitAccountRole("3905")
      .subscribe((res) => (this.Visible = res));
    this.subscriptions.push(vi);
  }






  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      doitac: ['-1'],
      status: ['-1'],
    });
    this.subscriptions.push(this.filterGroup.controls.status.valueChanges.subscribe(() => this.filter()));
    this.subscriptions.push(this.filterGroup.controls.doitac.valueChanges.subscribe(() => this.filter()));
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const doitac = this.filterGroup.get('doitac').value;
    if (doitac) {
      filter['doitac'] = doitac;
    }
    this.doitacbaohiemManagementService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.doitacbaohiemManagementService.patchState({ searchTerm });
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
    this.doitacbaohiemManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.doitacbaohiemManagementService.fetchStateSort({ paginator });
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
    const item = new DoiTacBaoHiemModel();
    item.empty();
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(DoiTacBaoHiemManagementEditDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.doitacbaohiemManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.doitacbaohiemManagementService.fetch();
      }
    });
  }

  import() {
    debugger
    const item = new DoiTacBaoHiemModel();
    item.empty();
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Import thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(DoiTacBaoHiemManagementImportDialogComponent, {
      data: { item: item },
      width: '900px',
      height: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("Res", res);
      if (!res) {
        this.doitacbaohiemManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.doitacbaohiemManagementService.fetch();
      }
    });
  }

  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(DoiTacBaoHiemManagementEditDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.doitacbaohiemManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.doitacbaohiemManagementService.fetch();
      }
    });
  }
  delete(_item: DoiTacBaoHiemModel) {
    debugger
		const _title: string = 'Xóa đối tác';
		const _description: string = 'Bạn có chắc muốn xóa đối tác không?';
		const _waitDesciption: string = 'đối tác đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.doitacbaohiemManagementService.DeleteDoiTacBaoHiem(_item).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);
				}
        this.doitacbaohiemManagementService.fetch();
			});
		});
	}
	deleteDM_LoaiMatHangs() {
		const _title: string = 'Xóa đối tác';
		const _description: string = 'Bạn có chắc muốn xóa đối tác không?';
		const _waitDesciption: string = 'đối tác đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) { return; }
			const idsForDeletion: number[] = [];

			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].Id_DV);
			}
			this.doitacbaohiemManagementService.DeletesDoiTacBaoHiem(idsForDeletion).subscribe(res => {
				if (res && res.status === 1)
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				else
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);

          this.doitacbaohiemManagementService.fetch();
				this.selection.clear();
			});
		});
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
}

