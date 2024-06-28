import { NhanHieuManagementEditDialogComponent } from '../nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
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
import { NhanHieuManagementService } from '../Services/nhanhieu-management.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
// import { nhanhieuModels, nhanhieuDeleteModel } from '../Model/nhanhieu-management.model';
import { NhanHieuModel } from '../Model/nhanhieu-management.model';
import { AuthService } from 'src/app/modules/auth';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { ResultModel } from '../../../_core/models/_base.model';
//import { nhanhieuManagementStatusDialogComponent } from '../nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';

const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';

@Component({
  selector: 'app-nhanhieu-management-list',
  templateUrl: './nhanhieu-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NhanHieuManagementListComponent
  implements
  OnInit,
  OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;


  selection = new SelectionModel<NhanHieuModel>(true, []);
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
			name: 'tennhanhieu',
			displayName: 'Mã loại mặt hàng',
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
  NhanHieusResult: NhanHieuModel[] = [];
  private subscriptions: Subscription[] = [];
  displayedColumns = ['CheckBox','stt', 'tennhanhieu','thaotac'];
  previousIndex: number;
  Visible: boolean;
  partnerFilters: PartnerFilterDTO[] = [];
  constructor(
    private changeDetect: ChangeDetectorRef,
    public nhanhieuManagementService: NhanHieuManagementService,
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
    this.searchForm();
    this.nhanhieuManagementService.fetch();
    this.grouping = this.nhanhieuManagementService.grouping;
    this.paginator = this.nhanhieuManagementService.paginator;
    this.sorting = this.nhanhieuManagementService.sorting;
    const sb = this.nhanhieuManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    const vi = this.nhanhieuManagementService
      .IsReadOnlyPermitAccountRole("3800")
      .subscribe((res) => (this.Visible = res));
    this.subscriptions.push(vi);
  }






  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  isVisible(): boolean {
    return this.nhanhieuManagementService.Visible;
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
    this.nhanhieuManagementService.patchState({ filter });
  }

  // search
  searchForm() {
    debugger
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
    this.nhanhieuManagementService.patchState({ searchTerm });
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
    this.nhanhieuManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.nhanhieuManagementService.fetchStateSort({ paginator });
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
    const item = new NhanHieuModel();
    item.empty();
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(NhanHieuManagementEditDialogComponent, {
      data: { item: item },
      width: '600px',
      height: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.nhanhieuManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.nhanhieuManagementService.fetch();
      }
    });
  }

  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( NhanHieuManagementEditDialogComponent, {
      data: { item: item },
      width: '600px',
      height: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.nhanhieuManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.nhanhieuManagementService.fetch();
      }
    });
  }
  delete(_item: NhanHieuModel) {
    debugger
		const _title: string = 'Xóa nhãn hiệu';
		const _description: string = 'Bạn có chắc muốn xóa nhãn hiệu này không?';
		const _waitDesciption: string = 'Loại mặt hàng đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.nhanhieuManagementService.DeleteNhanHieu(_item).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);
				}
        this.nhanhieuManagementService.fetch();
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
				idsForDeletion.push(this.selection.selected[i].IdNhanHieu);
			}
			this.nhanhieuManagementService.DeletesNhanHieu(idsForDeletion).subscribe(res => {
				if (res && res.status === 1)
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				else
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);

          this.nhanhieuManagementService.fetch();
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
		const numRows = this.NhanHieusResult.length;
		return numSelected === numRows;
	}
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.NhanHieusResult.forEach(row => this.selection.select(row));
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

