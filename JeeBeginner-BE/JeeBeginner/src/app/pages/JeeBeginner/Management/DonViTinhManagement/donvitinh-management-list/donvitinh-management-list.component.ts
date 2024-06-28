import { DonViTinhManagementEditDialogComponent } from '../donvitinh-management-edit-dialog/donvitinh-management-edit-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnDestroy, OnInit,ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { QueryParamsModel } from '../../../_core/models/query-models/query-params.model';
import { DeleteEntityDialogComponent } from '../../../_shared/delete-entity-dialog/delete-entity-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorage } from '../../../../../modules/auth/_services/token-storage.service';
import { DonViTinhManagementService } from '../Services/donvitinh-management.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
// import { nhanhieuModels, nhanhieuDeleteModel } from '../Model/nhanhieu-management.model';
import { DonViTinhModel } from '../Model/donvitinh-management.model';
import { AuthService } from 'src/app/modules/auth';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { ResultModel } from '../../../_core/models/_base.model';
import * as moment from 'moment';
import { DonViTinhManagementDetailDialogComponent } from '../donvitinh-management-detail-dialog/donvitinh-management-detail-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from '../nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';

const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';

@Component({
  selector: 'app-donvitinh-management-list',
  templateUrl: './donvitinh-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DonViTinhManagementListComponent
  implements
  OnInit,
  OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;


  selection = new SelectionModel<DonViTinhModel>(true, []);
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
			name: 'TenDVT',
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
  filterText: any = {};
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  searchGroup: FormGroup;
  DonViTinhsResult: DonViTinhModel[] = [];
  private subscriptions: Subscription[] = [];
  displayedColumns = ['CheckBox','stt', 'TenDVT','thaotac'];
  // displayedColumns = [];
  previousIndex: number;
  customerInfo={
    "IdDVT": 0,
		"TenDVT": "",
		"IdCustomer": 0
  };
  Visible: boolean;
  partnerFilters: PartnerFilterDTO[] = [];
  constructor(
    private changeDetect: ChangeDetectorRef,
    public donvitinhManagementService: DonViTinhManagementService,
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
    debugger
    this.filterForm();
    this.searchForm();
    this.showColumnsInTable();
		this.applySelectedColumns();
    this.donvitinhManagementService.fetch();
    this.grouping = this.donvitinhManagementService.grouping;
    this.paginator = this.donvitinhManagementService.paginator;
    this.sorting = this.donvitinhManagementService.sorting;
    const sb = this.donvitinhManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    const vi = this.donvitinhManagementService
      .IsReadOnlyPermitAccountRole("3700")
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
    this.donvitinhManagementService.patchState({ filter });
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
    this.donvitinhManagementService.patchState({ searchTerm });
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
    this.donvitinhManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.donvitinhManagementService.fetchStateSort({ paginator });
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
    const item = new DonViTinhModel();
    item.empty();
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(DonViTinhManagementEditDialogComponent, {
      data: { item: item },
      width: '600px',
      height: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.donvitinhManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.donvitinhManagementService.fetch();
      }
    });
  }

  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( DonViTinhManagementEditDialogComponent, {
      data: { item: item },
      width: '600px',
      height: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.donvitinhManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.donvitinhManagementService.fetch();
      }
    });
  }
  showDetail(item) {
    debugger
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'chi tiết';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( DonViTinhManagementDetailDialogComponent, {
      data: { item: item },
      width: '600px',
      height: '350px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.donvitinhManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.donvitinhManagementService.fetch();
      }
    });
  }
  delete(_item: DonViTinhModel) {
    debugger
		const _title: string = 'Xóa đơn vị tính';
		const _description: string = 'Bạn có chắc muốn xóa đơn vị tính không?';
		const _waitDesciption: string = 'Loại mặt hàng đang được xóa...';
		const _deleteMessage = `Xóa thành công`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.donvitinhManagementService.DeleteDonViTinh(_item).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);
				}
        this.donvitinhManagementService.fetch();
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
				idsForDeletion.push(this.selection.selected[i].IdDVT);
			}
			this.donvitinhManagementService.DeletesDonViTinh(idsForDeletion).subscribe(res => {
				if (res && res.status === 1)
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				else
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);

          this.donvitinhManagementService.fetch();
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
		const numRows = this.DonViTinhsResult.length;
		return numSelected === numRows;
	}
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.DonViTinhsResult.forEach(row => this.selection.select(row));
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
	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value.trim();
		filter.keyword = searchText;
		// filter.IdLMHParent = this.selectIdLMHParent;
		//#filter
		if (this.filterText) {
			filter.TenLMH = this.filterText['TenLMH'] ? this.filterText['TenLMH'] : '';
			filter.DoUuTien = this.filterText['DoUuTien'] ? this.filterText['DoUuTien'] : '';
			filter.TenLMHParent = this.filterText['TenLMHParent'] ? this.filterText['TenLMHParent'] : '';
		}
		return filter;
	}

    export(): void {
      this.donvitinhManagementService.exportToExcel().subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    }
}

