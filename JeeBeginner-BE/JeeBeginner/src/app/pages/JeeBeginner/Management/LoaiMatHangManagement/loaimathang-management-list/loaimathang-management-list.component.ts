import { LoaiMatHangManagementEditDialogComponent } from '../loaimathang-management-edit-dialog/loaimathang-management-edit-dialog.component';
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
import { LoaiMatHangManagementService } from '../Services/loaimathang-management.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
// import { nhanhieuModels, loaimathangDeleteModel } from '../Model/loaimathang-management.model';
import { LoaiMatHangModel } from '../Model/loaimathang-management.model';
import { AuthService } from 'src/app/modules/auth';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { ResultModel } from '../../../_core/models/_base.model';
import { LoaiMatHangManagementDetailDialogComponent } from '../loaimathang-management-detail-dialog/loaimathang-management-detail-dialog.component';
//import { xuatxuManagementStatusDialogComponent } from '../xuatxu-management-status-dialog/xuatxu-management-status-dialog.component';

const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';

@Component({
  selector: 'app-loaimathang-management-list',
  templateUrl: './loaimathang-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LoaiMatHangManagementListComponent
  implements
  OnInit,
  OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;


  selection = new SelectionModel<LoaiMatHangModel>(true, []);
  availableColumns = [
		{
			stt: 1,
			name: 'CheckBox',
			displayName: 'Check chọn',
			alwaysChecked: true,
			isShow: true
		},
		{
			stt: 2,
			name: 'stt',
			displayName: '#',
			alwaysChecked: false,
			isShow: true
		},
		{
			stt: 3,
			name: 'tenloaimathang',
			displayName: 'Mã loại mặt hàng',
			alwaysChecked: false,
			isShow: true
		}, 
    {
			stt: 4,
			name: 'loaimathangcha',
			displayName: 'loại mặt hàng cha',
			alwaysChecked: false,
			isShow: true
		}, 
    {
			stt: 5,
			name: 'douutien',
			displayName: 'độ ưu tiên',
			alwaysChecked: false,
			isShow: true
		}, 
    {
			stt: 7,
			name: 'mota',
			displayName: 'mô tả',
			alwaysChecked: false,
			isShow: true
		}, 
		{
			stt: 99,
			name: 'thaotac',
			displayName: 'Thao tác',
			alwaysChecked: true,
			isShow: true
		}
	];
  selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  searchGroup: FormGroup;
  LoaiMatHangsResult: LoaiMatHangModel[] = [];
  private subscriptions: Subscription[] = [];
  displayedColumns = ['CheckBox','stt', 'tenloaimathang', 'loaimathangcha', 'douutien', 'mota', 'thaotac'];
  previousIndex: number;
  Visible: boolean;
  partnerFilters: PartnerFilterDTO[] = [];
  constructor(
    private changeDetect: ChangeDetectorRef,
    public loaimathangManagementService: LoaiMatHangManagementService,
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
    this.loaimathangManagementService.fetch();
    this.grouping = this.loaimathangManagementService.grouping;
    this.paginator = this.loaimathangManagementService.paginator;
    this.sorting = this.loaimathangManagementService.sorting;
    const sb = this.loaimathangManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    const vi = this.loaimathangManagementService
      .IsReadOnlyPermitAccountRole("3904")
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
    this.loaimathangManagementService.patchState({ filter });
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
    this.loaimathangManagementService.patchState({ searchTerm });
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
    this.loaimathangManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.loaimathangManagementService.fetchStateSort({ paginator });
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
    const item = new LoaiMatHangModel();
    item.empty();
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(LoaiMatHangManagementEditDialogComponent, {
      data: { item: item },
      width: '900px',
      height: '550px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.loaimathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.loaimathangManagementService.fetch();
      }
    });
  }
  showDetail(item) {
    debugger
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'chi tiết';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( LoaiMatHangManagementDetailDialogComponent, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.loaimathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.loaimathangManagementService.fetch();
      }
    });
  }

  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( LoaiMatHangManagementEditDialogComponent, {
      data: { item: item },
      width: '900px',
      height: '550px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.loaimathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.loaimathangManagementService.fetch();
      }
    });
  }
  delete(_item: LoaiMatHangModel) {
		const _title: string = 'Xóa loại mặt hàng';
		const _description: string = 'Bạn có chắc muốn xóa loại mặt hàng không?';
		const _waitDesciption: string = 'Loại mặt hàng đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.loaimathangManagementService.DeleteLoaiMatHang(_item).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);
				}
        this.loaimathangManagementService.fetch();
			});
		});
	}
	deleteDM_LoaiMatHangs() {
		const _title: string = 'Xóa loại mặt hàng';
		const _description: string = 'Bạn có chắc muốn xóa những loại mặt hàng này không?';
		const _waitDesciption: string = 'Loại mặt hàng đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) { return; }
			const idsForDeletion: number[] = [];

			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].IdLMH);
			}
			this.loaimathangManagementService.DeletesLoaiMatHang(idsForDeletion).subscribe(res => {
				if (res && res.status === 1)
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				else
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);

          this.loaimathangManagementService.fetch();
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
    	/** SELECTION */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.LoaiMatHangsResult.length;
		return numSelected === numRows;
	}
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.LoaiMatHangsResult.forEach(row => this.selection.select(row));
		}
	}
  IsAllColumnsChecked() {
		const numSelected = this.selectedColumns.selected.length;
		const numRows = this.availableColumns.length;
		return numSelected === numRows;
	}
	CheckAllColumns() {
		if (this.IsAllColumnsChecked()) {
			this.availableColumns.forEach(row => { if (!row.alwaysChecked) this.selectedColumns.deselect(row); });
		} else {
			this.availableColumns.forEach(row => this.selectedColumns.select(row));
		}
	}
	showColumnsInTable() {
		for (let i = 0; i < this.availableColumns.length; i++) {
			if (this.availableColumns[i].isShow == false) {
				this.selectedColumns.toggle(this.availableColumns[i]);
			}
		}
	}
	findIndexColumn(column: string) {
		for (let i = 0; i < this.availableColumns.length; i++) {
			if (this.availableColumns[i].name == column)
				return i;
		}
	}
	dragStarted(event: CdkDragStart, column: string) {
		this.previousIndex = this.findIndexColumn(column);
	}
	dropListDropped(event: CdkDropList, column: string) {
		;
		if (event) {
			moveItemInArray(this.availableColumns, this.previousIndex, this.findIndexColumn(column));
			this.applySelectedColumns();
		}
	}
	applySelectedColumns() {
		let _selectedColumns = this.selectedColumns.selected;
		this.selectedColumns = new SelectionModel<any>(true, this.availableColumns);
		for (let i = 0; i < this.availableColumns.length; i++) {
			this.selectedColumns.toggle(this.availableColumns[i]);
			for (let j = 0; j < _selectedColumns.length; j++) {
				if (this.availableColumns[i].name == _selectedColumns[j].name) {
					this.selectedColumns.toggle(this.availableColumns[i]);
					break;
				}
			}
		}
		const _applySelectedColumns: string[] = [];
		this.selectedColumns.selected.forEach(col => { _applySelectedColumns.push(col.name) });
		this.displayedColumns = _applySelectedColumns;
	}
  	/** SELECTION */
}

