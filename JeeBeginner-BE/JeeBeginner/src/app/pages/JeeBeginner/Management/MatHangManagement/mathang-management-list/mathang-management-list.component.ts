import { MatHangManagementEditDialogComponent } from "../mathang-management-edit-dialog/mathang-management-edit-dialog.component";
import { MatHangManagementImportDialogComponent } from "../mathang-management-import-dialog/mathang-management-import-dialog.component";
//import { MatHangManagementDetailDialogComponent } from "../mathang-management-detail-dialog/mathang-management-detail-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, merge, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import {
  LayoutUtilsService,
  MessageType,
} from "../../../_core/utils/layout-utils.service";
import { DanhMucChungService } from "../../../_core/services/danhmuc.service";
import { QueryParamsModel } from "../../../_core/models/query-models/query-params.model";
import { DeleteEntityDialogComponent } from "../../../_shared/delete-entity-dialog/delete-entity-dialog.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TokenStorage } from "../../../../../modules/auth/_services/token-storage.service";
import { MatHangManagementService } from "../Services/mathang-management.service";
import {
  GroupingState,
  PaginatorState,
  SortState,
} from "src/app/_metronic/shared/crud-table";
import { SubheaderService } from "src/app/_metronic/partials/layout";
// import { nhanhieuModels, mathangDeleteModel } from '../Model/mathang-management.model';
import { MatHangModel } from "../Model/mathang-management.model";
import { AuthService } from "src/app/modules/auth";
import {
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { PartnerFilterDTO } from "../../PartnerManagement/Model/partner-management.model";
import { ResultModel } from "../../../_core/models/_base.model";
//import { xuatxuManagementStatusDialogComponent } from '../xuatxu-management-status-dialog/xuatxu-management-status-dialog.component';
import { ReplaySubject, fromEvent, interval, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { QueryResultsModel } from "../../../_core/models/query-models/query-results.model";
import { environment } from "src/environments/environment";
import { MatHangManagementDetailDialogComponent } from "../mathang-management-detail-dialog/mathang-management-detail-dialog.component";
const COLOR_DANGHIEULUC = "#3699ff";
const COLOR_THANHLY = "#1bc5bd";
const COLOR_CHUAHIEULUC = "#ffa800";
const COLOR_HETHIEULUC = "#f64e60";

@Component({
  selector: "app-mathang-management-list",
  templateUrl: "./mathang-management-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatHangManagementListComponent implements OnInit, OnDestroy {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  filterText: any = {};
  items: any = {};
  filterGroupData: any = {};
  filterGroupArray: any = {};
  haveFilter: boolean = false;
  // Table fields

  selection = new SelectionModel<MatHangModel>(true, []);
  availableColumns = [
    {
      stt: 1,
      name: "CheckBox",
      displayName: "Check chọn",
      alwaysChecked: true,
      isShow: true,
    },
    {
      stt: 2,
      name: "stt",
      displayName: "#",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 3,
      name: "hinhanh",
      displayName: "Hình ảnh",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 4,
      name: "mahang",
      displayName: "Mã loại mặt hàng",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 5,
      name: "tenmathang",
      displayName: "loại mặt hàng cha",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 6,
      name: "soKyTinhKhauHaoToiThieu",
      displayName: "độ ưu tiên",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 7,
      name: "soKyTinhKhauHaoToiDa",
      displayName: "mô tả",
      alwaysChecked: false,
      isShow: true,
    },
    {
      stt: 99,
      name: "thaotac",
      displayName: "Thao tác",
      alwaysChecked: true,
      isShow: true,
    },
  ];
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild("sort1", { static: true }) sort2: MatSort;
  // Filter fields
  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;
  Visible: boolean;
  listIdLMH: any[] = [];
  selectIdLMH: string[] = [];
  filteredIdLMH: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdLMHFilterCtrl: string = "";
  haveElementIdLMH: boolean = false;
  listIdDVT: any[] = [];
  selectIdDVT: string[] = [];
  filteredIdDVT: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdDVTFilterCtrl: string = "";
  haveElementIdDVT: boolean = false;
  listIdDVTCap2: any[] = [];
  selectIdDVTCap2: string[] = [];
  filteredIdDVTCap2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdDVTCap2FilterCtrl: string = "";
  haveElementIdDVTCap2: boolean = false;
  listIdDVTCap3: any[] = [];
  selectIdDVTCap3: string[] = [];
  filteredIdDVTCap3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdDVTCap3FilterCtrl: string = "";
  haveElementIdDVTCap3: boolean = false;
  listIdNhanHieu: any[] = [];
  selectIdNhanHieu: string[] = [];
  filteredIdNhanHieu: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdNhanHieuFilterCtrl: string = "";
  haveElementIdNhanHieu: boolean = false;
  listIdXuatXu: any[] = [];
  selectIdXuatXu: string[] = [];
  filteredIdXuatXu: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IdXuatXuFilterCtrl: string = "";
  haveElementIdXuatXu: boolean = false;

  tmpfilterText: any = {};
  entitySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  paginatorTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  loadingSubject = new BehaviorSubject<boolean>(false);
  selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  searchGroup: FormGroup;
  MatHangsResult: MatHangModel[] = [];

  dm_mathangsResult: MatHangModel[] = [];
  tmpdm_mathangsResult: MatHangModel[] = [];
  autoRefresh: boolean = false;
  private subscriptions: Subscription[] = [];
  displayedColumns = [
    "CheckBox",
    "stt",
    "hinhanh",
    "mahang",
    "tenmathang",
    "soKyTinhKhauHaoToiThieu",
    "soKyTinhKhauHaoToiDa",
    "thaotac",
  ];
  previousIndex: number;
  partnerFilters: PartnerFilterDTO[] = [];
  constructor(
    private changeDetect: ChangeDetectorRef,
    public mathangManagementService: MatHangManagementService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    debugger;

    this.haveFilter = true;
    this.tmpfilterText = Object.assign({}, this.filterText);
    this.filterText["MaHang"] = "";
    this.filterText["TenMatHang"] = "";

    // this.filterForm();
    this.searchForm();
    this.mathangManagementService.fetch();
    this.grouping = this.mathangManagementService.grouping;
    this.paginator = this.mathangManagementService.paginator;
    this.sorting = this.mathangManagementService.sorting;
    const sb = this.mathangManagementService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);

    this.ListIdLMH();
    this.ListIdDVT();

    this.ListIdNhanHieu();
    this.ListIdXuatXu();
    const vi = this.mathangManagementService
      .IsReadOnlyPermitAccountRole("3906")
      .subscribe((res) => (this.Visible = res));
    this.subscriptions.push(vi);
  }

  getImageUrl(imageName: string): string {
    debugger;
    return `${environment.ApiUrlRoot}/uploads/${imageName}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  //   showDetail(item) {
  //     const dialogRef = this.dialog.open(MatHangManagementDetailDialogComponent, {
  //       data: { item: item },
  //       width: "900px",

  //       disableClose: true,
  //     });
  //     dialogRef.afterClosed().subscribe((res) => {
  //       this.mathangManagementService.fetch();
  //     });
  //   }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [""],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((val) => this.search());
    this.subscriptions.push(searchEvent);
  }

  search() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.filterGroupData
    );
    this.loadDM_MatHangs(queryParams);
  }

  sort(column: string): void {
    debugger;
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = "asc";
    } else {
      sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
    }
    this.mathangManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    debugger;
    this.mathangManagementService.fetchStateSort({ paginator });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + "px";
  }

  // 05/05/2021 09:40:58 => 05/05/2021
  getDate(date: string) {
    return date.split(" ")[0];
  }
  // 05/05/2021 09:40:58 => 09:40:58 05/05/2021
  getDateTime(date: string) {
    const time = date.split(" ")[1];
    const day = date.split(" ")[0];
    return time + " " + day;
  }

  create() {
    const item = new MatHangModel();
    item.empty();
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Thêm thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(MatHangManagementEditDialogComponent, {
      data: { item: item },
      width: "1000px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.mathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          6000,
          true,
          false
        );
        this.mathangManagementService.fetch();
      }
    });
  }

  showDetail(item) {
    debugger
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Chi tiết';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open( MatHangManagementDetailDialogComponent, {
      data: { item: item },
      width: "1000px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.mathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.mathangManagementService.fetch();
      }
    });
  }

  update(item) {
    debugger;
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Cập nhật thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(MatHangManagementEditDialogComponent, {
      data: { item: item },
      width: "900px",
      disableClose: true,
    });
    console.log(item);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.mathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );
        this.mathangManagementService.fetch();
      }
    });
  }
  delete(_item: MatHangModel) {
    debugger;
    const _title: string = "Xóa mặt hàng";
    const _description: string = "Bạn có chắc muốn xóa mặt hàng không?";
    const _waitDesciption: string = "Loại mặt hàng đang được xóa...";
    const _deleteMessage = `Xóa thành công`;
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.mathangManagementService.DeleteMatHang(_item).subscribe((res) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            _deleteMessage,
            MessageType.Delete,
            2000,
            true,
            false
          );
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Delete,
            0
          );
        }
        this.mathangManagementService.fetch();
      });
    });
  }
  deleteDM_MatHangs() {
    const _title: string = "Xóa loại mặt hàng";
    const _description: string =
      "Bạn có chắc muốn xóa những loại mặt hàng này không?";
    const _waitDesciption: string = "Loại mặt hàng đang được xóa...";
    const _deleteMessage = `Xóa thành công`;
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      const idsForDeletion: number[] = [];

      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].IdMH);
      }
      this.mathangManagementService
        .DeletesMatHang(idsForDeletion)
        .subscribe((res) => {
          if (res && res.status === 1)
            this.layoutUtilsService.showActionNotification(
              _deleteMessage,
              MessageType.Delete,
              2000,
              true,
              false
            );
          else
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Delete,
              0
            );

          this.mathangManagementService.fetch();
          this.selection.clear();
        });
    });
  }
  // filtration
  filterForm() {
    debugger;
    this.filterGroup = this.fb.group({
      loaimathang: ["-1"],
      donvitinh: ["-1"],
    });
    this.subscriptions.push(
      this.filterGroup.controls.donvitinh.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.loaimathang.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }
  import() {
    debugger;
    const item = new MatHangModel();
    item.empty();
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Import thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(MatHangManagementImportDialogComponent, {
      data: { item: item },
      width: "900px",
      height: "250px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("Res", res);
      if (!res) {
        this.mathangManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );
        this.mathangManagementService.fetch();
      }
    });
  }
  filter() {
    debugger;
    const filter = {};
    const loaimathang = this.filterGroup.get("loaimathang").value;
    if (loaimathang) {
      filter["loaimathang"] = loaimathang;
    }

    const donvitinh = this.filterGroup.get("donvitinh").value;
    if (donvitinh) {
      filter["donvitinh"] = donvitinh;
    }
    this.mathangManagementService.patchState({ filter });
  }

  // loadDM_MatHangs(queryParams: QueryParamsModel) {
  // 	this.mathangManagementService.lastFilter$.next(queryParams);
  // 	this.loadingSubject.next(true);

  // 	const sb=this.mathangManagementService.getData(queryParams).subscribe();
  // 	this.subscriptions.push(sb);
  // }
  // loadDM_MatHangs(queryParams: QueryParamsModel) {
  // 	debugger
  // 	this.mathangManagementService.lastFilter$.next(queryParams);
  // 	this.loadingSubject.next(true);
  // 	this.mathangManagementService.getData(queryParams)
  // 		.pipe(
  // 			tap(resultFromServer => {
  // 				if (resultFromServer.status == 1) {
  // 					if (resultFromServer.data) {
  // 						this.mathangManagementService._items$.next(resultFromServer.data); // Cập nhật dữ liệu
  // 						// this.entitySubject.next();
  // 					} else {
  // 						this.entitySubject.next([]);
  // 					}
  // 					if (resultFromServer.page != null) {
  // 						var totalCount = resultFromServer.page.TotalCount || (resultFromServer.page.AllPage * resultFromServer.page.Size);
  // 						this.paginatorTotalSubject.next(totalCount);
  // 					} else {
  // 						this.paginatorTotalSubject.next(0);
  // 					}
  // 				} else {
  // 					this.entitySubject.next([]);
  // 					this.paginatorTotalSubject.next(0);
  // 					// let message = '';
  // 					// if(resultFromServer.error.message == null){
  // 					// 	message = 'Lấy thông tin thất bại';
  // 					// }else{
  // 					// 	message = resultFromServer.error.message;
  // 					// }
  // 				}
  // 			}),
  // 		).subscribe();
  // }
  loadDM_MatHangs(queryParams: QueryParamsModel) {
    this.mathangManagementService.lastFilter$.next(queryParams);
    this.loadingSubject.next(true);
    this.mathangManagementService
      .getData(queryParams)
      .pipe(
        tap((resultFromServer) => {
          if (resultFromServer.status == 1) {
            if (resultFromServer.data) {
              this.mathangManagementService._items$.next(resultFromServer.data); // Cập nhật dữ liệu
            } else {
              this.mathangManagementService._items$.next([]);
            }
            if (resultFromServer.page != null) {
              var totalCount =
                resultFromServer.page.TotalCount ||
                resultFromServer.page.AllPage * resultFromServer.page.Size;
              this.paginatorTotalSubject.next(totalCount);
            } else {
              this.paginatorTotalSubject.next(0);
            }
          } else {
            this.mathangManagementService._items$.next([]);
            this.paginatorTotalSubject.next(0);
          }
        }),
        catchError((err) => of(new QueryResultsModel([], err))),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }
  // loadDM_MatHangsList(holdCurrentPage: boolean = false) {
  // 	debugger
  // 	this.selection.clear();
  // 	const filter = this.filterConfiguration();
  // 	this.mathangManagementService.patchState({filter});

  // }

  loadDM_MatHangsList(holdCurrentPage: boolean = false) {
    debugger;
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.filterGroupData
    );

    this.loadDM_MatHangs(queryParams);
    setTimeout((x) => {
      this.loadPage();
    }, 500);
  }
  loadPage() {
    debugger;
    var arrayData = [];
    this.mathangManagementService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    if (arrayData && arrayData.length == 0) {
      var totalRecord = 0;
      if (totalRecord > 0) {
        const queryParams = new QueryParamsModel(
          this.filterConfiguration(),
          this.filterGroupData
        );
        this.loadDM_MatHangs(queryParams);
      } else {
        const queryParams = new QueryParamsModel(
          this.filterConfiguration(),
          this.filterGroupData
        );

        this.loadDM_MatHangs(queryParams);
      }
    }
  }

  ListIdLMH() {
    debugger;
    let queryParams = new QueryParamsModel({});
    queryParams.more = true;
    this.mathangManagementService.DM_LoaiMatHang_List().subscribe((res) => {
      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdLMH = res.data;
        this.filteredIdLMH.next(this.listIdLMH.slice());
        this.changeDetect.detectChanges();
      }
    });
  }

  filterIdLMH() {
    debugger;
    if (!this.listIdLMH) {
      return;
    }
    // get the search keyword
    let search = this.IdLMHFilterCtrl;
    if (!search) {
      this.filteredIdLMH.next(this.listIdLMH.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIdLMH.next(
      this.listIdLMH.filter(
        (ts) => ts.TenLMH.toLowerCase().indexOf(search) > -1
      )
    );
    this.changeDetect.detectChanges();
  }
  SelectIdLMH(event: any, dependOnField: string = "") {
    debugger;
    if (this.selectIdLMH.length >= 0 && event.length > 0)
      this.haveElementIdLMH = true;
    if (this.selectIdLMH.length <= 1 && event.length == 0)
      this.haveElementIdLMH = false;
    if (dependOnField != "") {
    }
    this.loadDM_MatHangsList();
  }
  ClearIdLMH() {
    this.selectIdLMH = [];
    this.haveElementIdLMH = false;
    this.loadDM_MatHangsList();
  }
  /** FILTRATION */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value.trim();
    filter.keyword = searchText;

    if (this.selectIdLMH.length > 0) filter.IdLMH = this.selectIdLMH;
    if (this.selectIdDVT.length > 0) filter.IdDVT = this.selectIdDVT;
    if (this.selectIdNhanHieu.length > 0)
      filter.IdNhanHieu = this.selectIdNhanHieu;
    if (this.selectIdXuatXu.length > 0) filter.IdXuatXu = this.selectIdXuatXu;

    // #filter
    if (this.filterText) {
      filter.MaHang = this.filterText["MaHang"];
      filter.TenMatHang = this.filterText["TenMatHang"];
    }

    return filter;
  }

  ListIdDVT() {
    let queryParams = new QueryParamsModel({});
    queryParams.more = true;
    this.mathangManagementService.DM_DVT_List().subscribe((res) => {
      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdDVT = res.data;
        this.filteredIdDVT.next(this.listIdDVT.slice());
        this.changeDetect.detectChanges();
      }
    });
  }
  filterIdDVT() {
    if (!this.listIdDVT) {
      return;
    }
    // get the search keyword
    let search = this.IdDVTFilterCtrl;
    if (!search) {
      this.filteredIdDVT.next(this.listIdDVT.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIdDVT.next(
      this.listIdDVT.filter(
        (ts) => ts.TenDVT.toLowerCase().indexOf(search) > -1
      )
    );
    this.changeDetect.detectChanges();
  }
  SelectIdDVT(event: any, dependOnField: string = "") {
    if (this.selectIdDVT.length >= 0 && event.length > 0)
      this.haveElementIdDVT = true;
    if (this.selectIdDVT.length <= 1 && event.length == 0)
      this.haveElementIdDVT = false;
    if (dependOnField != "") {
    }
    this.loadDM_MatHangsList();
  }
  ClearIdDVT() {
    this.selectIdDVT = [];
    this.haveElementIdDVT = false;
    this.loadDM_MatHangsList();
  }

  // ListIdNhanHieu() {
  // 	let queryParams = new QueryParamsModel({});
  // 	queryParams.more = true;
  // 	this.mathangManagementService.DM_NhanHieu_List().subscribe(res => {
  // 		this.loadingSubject.next(false);
  // 		if (res && res.status === 1) {
  // 			this.listIdNhanHieu = res.data;
  // 			this.filteredIdNhanHieu.next(this.listIdNhanHieu.slice());
  // 			this.changeDetect.detectChanges();
  // 		};
  // 	});
  // }
  // filterIdNhanHieu() {
  // 	if (!this.listIdNhanHieu) { return; }
  // 	// get the search keyword
  // 	let search = this.IdNhanHieuFilterCtrl;
  // 	if (!search) { this.filteredIdNhanHieu.next(this.listIdNhanHieu.slice()); return; }
  // 	else { search = search.toLowerCase(); }
  // 	this.filteredIdNhanHieu.next(this.listIdNhanHieu.filter(ts => ts.TenDVT.toLowerCase().indexOf(search) > -1));
  // 	this.changeDetect.detectChanges();
  // }
  // SelectIdNhanHieu(event: any, dependOnField: string = '') {
  // 	if (this.selectIdNhanHieu.length >= 0 && event.length > 0)
  // 		this.haveElementIdNhanHieu = true;
  // 	if (this.selectIdNhanHieu.length <= 1 && event.length == 0)
  // 		this.haveElementIdNhanHieu = false;
  // 	if (dependOnField != '') { }
  // 	this.loadDM_MatHangsList();
  // }
  // ClearIdNhanHieu() {
  // 	this.selectIdNhanHieu = [];
  // 	this.haveElementIdNhanHieu = false;
  // 	this.loadDM_MatHangsList();
  // }

  ListIdNhanHieu() {
    let queryParams = new QueryParamsModel({});
    queryParams.more = true;
    this.mathangManagementService.DM_NhanHieu_List().subscribe((res) => {
      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdNhanHieu = res.data;
        this.filteredIdNhanHieu.next(this.listIdNhanHieu.slice());
        this.changeDetect.detectChanges();
      }
    });
  }
  filterIdNhanHieu() {
    if (!this.listIdNhanHieu) {
      return;
    }
    // get the search keyword
    let search = this.IdNhanHieuFilterCtrl;
    if (!search) {
      this.filteredIdNhanHieu.next(this.listIdNhanHieu.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIdNhanHieu.next(
      this.listIdNhanHieu.filter(
        (ts) => ts.TenNhanHieu.toLowerCase().indexOf(search) > -1
      )
    );
    this.changeDetect.detectChanges();
  }
  SelectIdNhanHieu(event: any, dependOnField: string = "") {
    if (this.selectIdNhanHieu.length >= 0 && event.length > 0)
      this.haveElementIdNhanHieu = true;
    if (this.selectIdNhanHieu.length <= 1 && event.length == 0)
      this.haveElementIdNhanHieu = false;
    if (dependOnField != "") {
    }
    this.loadDM_MatHangsList();
  }
  ClearIdNhanHieu() {
    this.selectIdNhanHieu = [];
    this.haveElementIdNhanHieu = false;
    this.loadDM_MatHangsList();
  }

  ListIdXuatXu() {
    let queryParams = new QueryParamsModel({});
    queryParams.more = true;
    this.mathangManagementService.DM_XuatXu_List().subscribe((res) => {
      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdXuatXu = res.data;
        this.filteredIdXuatXu.next(this.listIdXuatXu.slice());
        this.changeDetect.detectChanges();
      }
    });
  }
  filterIdXuatXu() {
    if (!this.listIdXuatXu) {
      return;
    }
    // get the search keyword
    let search = this.IdXuatXuFilterCtrl;
    if (!search) {
      this.filteredIdXuatXu.next(this.listIdXuatXu.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIdXuatXu.next(
      this.listIdXuatXu.filter(
        (ts) => ts.TenXuatXu.toLowerCase().indexOf(search) > -1
      )
    );
    this.changeDetect.detectChanges();
  }
  SelectIdXuatXu(event: any, dependOnField: string = "") {
    if (this.selectIdXuatXu.length >= 0 && event.length > 0)
      this.haveElementIdXuatXu = true;
    if (this.selectIdXuatXu.length <= 1 && event.length == 0)
      this.haveElementIdXuatXu = false;
    if (dependOnField != "") {
    }
    this.loadDM_MatHangsList();
  }
  ClearIdXuatXu() {
    this.selectIdXuatXu = [];
    this.haveElementIdXuatXu = false;
    this.loadDM_MatHangsList();
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }

  getTileStatus(value: boolean) {
    if (value) return this.translate.instant("COMMOM.TAMKHOA");
    return this.translate.instant("COMMOM.DANGSUDUNG");
  }
  getColorStatus(value: boolean) {
    if (!value) return COLOR_DANGHIEULUC;
    return COLOR_HETHIEULUC;
  }
  /** SELECTION */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.MatHangsResult.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.MatHangsResult.forEach((row) => this.selection.select(row));
    }
  }
  IsAllColumnsChecked() {
    const numSelected = this.selectedColumns.selected.length;
    const numRows = this.availableColumns.length;
    return numSelected === numRows;
  }
  CheckAllColumns() {
    if (this.IsAllColumnsChecked()) {
      this.availableColumns.forEach((row) => {
        if (!row.alwaysChecked) this.selectedColumns.deselect(row);
      });
    } else {
      this.availableColumns.forEach((row) => this.selectedColumns.select(row));
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
      if (this.availableColumns[i].name == column) return i;
    }
  }
  dragStarted(event: CdkDragStart, column: string) {
    this.previousIndex = this.findIndexColumn(column);
  }
  dropListDropped(event: CdkDropList, column: string) {
    if (event) {
      moveItemInArray(
        this.availableColumns,
        this.previousIndex,
        this.findIndexColumn(column)
      );
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
    this.selectedColumns.selected.forEach((col) => {
      _applySelectedColumns.push(col.name);
    });
    this.displayedColumns = _applySelectedColumns;
  }
  /** SELECTION */
}
