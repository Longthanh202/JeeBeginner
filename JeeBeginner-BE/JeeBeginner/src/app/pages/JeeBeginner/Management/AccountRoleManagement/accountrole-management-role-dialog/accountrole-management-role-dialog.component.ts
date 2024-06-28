import { SelectionModel } from "@angular/cdk/collections";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { QueryParamsModelNew } from "../../../_core/models/query-models/query-params.model";
import { DeleteEntityDialogComponent } from "../../../_shared/delete-entity-dialog/delete-entity-dialog.component";
import { AccountRoleManagementEditDialogComponent } from "../accountrole-management-edit-dialog/accountrole-management-edit-dialog.component";
import { TokenStorage } from "../../../../../modules/auth/_services/token-storage.service";
import { AccountRoleManagementService } from "../Services/accountrole-management.service";
import {
  GroupingState,
  PaginatorState,
  SortState,
} from "src/app/_metronic/shared/crud-table";
import { SubheaderService } from "src/app/_metronic/partials/layout";
import { AuthService } from "src/app/modules/auth";
import { PartnerFilterDTO } from "../../PartnerManagement/Model/partner-management.model";
import { ResultModel, ResultObjModel } from "../../../_core/models/_base.model";
import {
  AccountRoleModel,
  AccountRole,
  AccountRoleStatusModel,
} from "../Model/accountrole-management.model";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { DatePipe } from "@angular/common";

const COLOR_DANGHIEULUC = "#3699ff";
const COLOR_THANHLY = "#1bc5bd";
const COLOR_CHUAHIEULUC = "#ffa800";
const COLOR_HETHIEULUC = "#f64e60";

@Component({
  selector: "app-accountrole-management-role-dialog",
  templateUrl: "./accountrole-management-role-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRoleManagementRoleDialogComponent
  implements OnInit, OnDestroy
{
  note: string;
  item: AccountRole = new AccountRole();
  paginator: PaginatorState;
  formGroup: FormGroup;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  displayedColumns = ["stt", "Id_Permit", "Tenquyen", "Edit", "IsReadPermit"];
  partnerFilters: PartnerFilterDTO[] = [];
  itemid: AccountRole[] = [];

  itemp: any[] = [];
  originalItemState: any[] = [];
  @ViewChild("table") table: ElementRef;
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  AfterViewInit: AfterViewInit;
  selection = new SelectionModel<number>(true, []);
  itemIds: number[] = [];
  selection2 = new SelectionModel<number>(true, []);
  checkboxItems: AccountRole[] = [];
  listQuyen: any[] = [];
  loadingSubject = new BehaviorSubject<boolean>(false);
  disabledBtn: boolean = false;
  Visible: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountRoleManagementRoleDialogComponent>,
    private changeDetect: ChangeDetectorRef,
    public accountroleManagementService: AccountRoleManagementService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    public auth: AuthService,
    private translateService: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.filterForm();
    // this.searchForm();
    // this.accountroleManagementService.getRole(this.data.item.Username);

    this.loadInitData();
    this.grouping = this.accountroleManagementService.grouping;
    this.paginator = this.accountroleManagementService.paginator;
    this.sorting = this.accountroleManagementService.sorting;
    const sb = this.accountroleManagementService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.getData();

    // debugger
    const add = this.accountroleManagementService
      .getRoleByUsername(this.data.item.Username)
      .subscribe((res: ResultModel<AccountRole>) => {
        if (res && res.status === 1) {
          this.itemid = res.data;
        }
      });
    this.subscriptions.push(add);

    // this.item.empty();
    // this.item.Username = this.data.item.Username;
    // this.loadForm();
    // this.loadInitData();
  }
  loadInitData() {
    if (this.item.Username !== "") {
      const sbGet = this.accountroleManagementService
        .getRoleByUsername(this.data.item.Username)
        .pipe(
          tap((res: ResultObjModel<AccountRole>) => {
            if (res.status === 1) {
              this.item = res.data;
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }
  checkReadOnlyPermission(roleName: string): void {
    this.accountroleManagementService
      .IsReadOnlyPermitAccountRole(roleName)
      .subscribe(
        (result) => {
          this.Visible = result; // Update Visible variable based on API response
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      doitac: ["-1"],
      status: ["-1"],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.doitac.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get("status").value;
    if (status) {
      filter["status"] = status;
    }

    const doitac = this.filterGroup.get("doitac").value;
    if (doitac) {
      filter["doitac"] = doitac;
    }
    this.accountroleManagementService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [""],
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
    this.accountroleManagementService.patchState({ searchTerm });
  }

  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = "asc";
    } else {
      sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
    }
    this.accountroleManagementService.fetchStateSort({ sorting });
  }

  paginate(paginator: PaginatorState) {
    this.accountroleManagementService.fetchStateSort({ paginator });
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
    const item = new AccountRoleModel();
    item.empty();
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Thêm thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(
      AccountRoleManagementEditDialogComponent,
      {
        data: { item: item },
        width: "900px",
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountroleManagementService.fetchRole();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );
        this.accountroleManagementService.fetchRole();
      }
    });
  }
  isAllSelected() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.itemIds.length;
    return numSelected === numRows;
  }
  // masterToggle() {
  //   debugger
  //   this.isAllSelected() ? this.selection2.clear() : this.itemIds.forEach((row) => this.selection2.select(row));
  // }

  update(item) {
    // this.isLoadingSubmit$.next(true);
    // const sb = this.accountroleManagementService.UpdateCustomerAddDeletAppModel(item).subscribe(
    //   (res) => {
    //     this.isLoadingSubmit$.next(false);
    //     this.dialogRef.close(res);
    //   },
    //   (error) => {
    //     this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    //     this.isLoadingSubmit$.next(false);
    //   }
    // );
    // this.subscriptions.push(sb);
  }

  updateStatus(item) {
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Cập nhật thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(
      AccountRoleManagementRoleDialogComponent,
      {
        data: { item: item },
        width: "900px",
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountroleManagementService.fetchRole();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );
        this.accountroleManagementService.fetchRole();
      }
    });
  }
  updateStatusRole(item) {
    let saveMessageTranslateParam = "";
    saveMessageTranslateParam += "Cập nhật thành công";
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(
      AccountRoleManagementRoleDialogComponent,
      {
        data: { item: item },
        width: "900px",
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountroleManagementService.fetchRole();
      } else {
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );
        this.accountroleManagementService.fetchRole();
      }
    });
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }
  getTitle() {
    if (this.data.item.IsLock) {
      return (
        this.translateService.instant(
          "ACCOUNTROLEMANAGEMENT.PHANQUYENTAIKHOAN"
        ) +
        " " +
        this.data.item.Username
      );
    }
    return (
      this.translateService.instant("ACCOUNTROLEMANAGEMENT.PHANQUYENTAIKHOAN") +
      " " +
      this.data.item.Username
    );
  }
  getTileStatus(value: boolean) {
    if (value) return this.translate.instant("COMMOM.TAMKHOA");
    return this.translate.instant("COMMOM.DANGSUDUNG");
  }

  getColorStatus(value: boolean) {
    if (!value) return COLOR_DANGHIEULUC;
    return COLOR_HETHIEULUC;
  }

  private prepareData(): AccountRole {
    let model = new AccountRole();
    model.empty();
    // model.Username = this.item.Username;
    model.Id_Permit = this.item.Id_Permit;
    model.Tenquyen = this.item.Tenquyen;
    model.Edit = this.item.Edit;
    //model.IsRead = this.item.IsRead;
    return model;
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  onSubmit() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    return model.Username !== "";
  }
  goBack() {
    if (this.checkDataBeforeClose()) {
      this.dialogRef.close();
    } else {
      const _title = this.translateService.instant("CHECKPOPUP.TITLE");
      const _description = this.translateService.instant(
        "CHECKPOPUP.DESCRIPTION"
      );
      const _waitDesciption = this.translateService.instant(
        "CHECKPOPUP.WAITDESCRIPTION"
      );
      const popup = this.layoutUtilsService.deleteElement(
        _title,
        _description,
        _waitDesciption
      );
      popup.afterClosed().subscribe((res) => {
        res ? this.dialogRef.close() : undefined;
      });
    }
    // this.dialogRef.close();
  }
  loadForm() {
    this.formGroup = this.fb.group({
      ghichu: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  setValueToForm(model: AccountRole) {
    this.formGroup.controls.Id_Permit.setValue(model.Id_Permit);
    this.formGroup.controls.Tenquyen.setValue(model.Tenquyen);
    this.formGroup.controls.Edit.setValue(model.Edit);
    this.formGroup.controls.IsRead.setValue(model.IsReadPermit);
  }
  masterToggle(event: MatCheckboxChange, row: any) {
    let item = new AccountRole();
    item.empty();
    item.Username = row.Username;
    item.Id_Permit = row.Id_Permit;
    item.Tenquyen = row.Tenquyen;
    item.Edit = event.checked;
    item.IsReadPermit = event.checked;

    this.isLoadingSubmit$.next(true);
    const sb = this.accountroleManagementService
      .UpdateInsertEditRole(item)
      .subscribe(
        (res) => {
          this.isLoadingSubmit$.next(false);
          // this.dialogRef.close(res);
        },
        (error) => {
          this.layoutUtilsService.showActionNotification(
            error.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
          this.isLoadingSubmit$.next(false);
        }
      );
    this.subscriptions.push(sb);
  }

  getData() {
    this.accountroleManagementService
      .getRoleByUsername(this.data.item.Username)
      .subscribe((data: any) => {
        this.itemp = data;
        this.originalItemState = JSON.parse(JSON.stringify(data));
      });
  }
  onCheckboxChange(event: MatCheckboxChange, row: any) {
    debugger;

    const existingItem = this.checkboxItems.find(
      (item) =>
        item.Username === row.Username && item.Id_Permit === row.Id_Permit
    );

    if (existingItem) {
      existingItem.Edit = event.checked;
    } else {
      let item = new AccountRole();
      item.empty();
      item.Username = row.Username;
      item.Id_Permit = row.Id_Permit;
      item.Tenquyen = row.Tenquyen;
      item.Edit = event.checked;
      this.checkboxItems.push(item);
    }
  }
  onSubmit7() {
    this.accountroleManagementService
      .Save_QuyenNguoiDung(this.checkboxItems)
      .subscribe(
        (response: any) => {
          this.dialogRef.close(response); // In ra thông báo sau khi lưu thành công
        },
        (error: any) => {
          this.layoutUtilsService.showActionNotification(
            error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          ); // In ra lỗi nếu có lỗi xảy ra
        }
      );
  }
  masterToggle1(val: any) {
    debugger;
    // if (val.checked) {
    // 	this.productsResult.forEach(row => {
    // 		if (row.IsEdit_Enable == true) {
    // 			row.IsEdit = true;
    // 		}
    // 	});
    // }
    // else {
    // 	this.productsResult.forEach(row => {
    // 		if (row.IsEdit_Enable == true) {
    // 			row.IsEdit = false;
    // 		}
    // 	});
    // }
    if (val.checked) {
      this.itemp.forEach((row) => {
        if (row.IsEdit_Enable == true) {
          row.Edit = true;
        } else {
          row.Edit = false;
        }
      });
    } else {
      this.itemp.forEach((row) => {
        if (row.IsEdit_Enable == true) {
          row.Edit = false;
        }
      });
    }
  }

  changeChinhSua(val: any, row: any) {
    debugger;
    this.itemid.map((item, index) => {
      if (item.Id_Permit == row.Id_Permit) {
        item.Edit = val.checked;
      }
    });
  }
  LuuQuyen() {
    debugger;
    this.accountroleManagementService.Save_Quyen(this.arr_data).subscribe(
      (response: any) => {
        this.dialogRef.close(response); // In ra thông báo sau khi lưu thành công
      },
      (error: any) => {
        this.layoutUtilsService.showActionNotification(
          error.message,
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        ); // In ra lỗi nếu có lỗi xảy ra
      }
    );
  }
  luuQuyen(withBack: boolean = true) {
    debugger;
    this.listQuyen = [];
    this.itemid.forEach((row) => {
      const q = new AccountRole();
      q.Username = row.Username;
      q.Id_Permit = row.Id_Permit;
      q.Edit = row.Edit;
      q.Tenquyen = row.Tenquyen;
      q.IsReadPermit = row.IsReadPermit;
      this.listQuyen.push(q);
    });
    if (this.listQuyen.length > 0) {
      this.updateNhomNguoiDung(this.listQuyen, withBack);
    }
  }
  updateNhomNguoiDung(_product: any[], withBack: boolean = true) {
    debugger;
    this.loadingSubject.next(true);
    this.disabledBtn = true;

    this.accountroleManagementService
      .Save_QuyenNguoiDung(_product)
      .subscribe((res) => {
        this.loadingSubject.next(false);

        this.disabledBtn = false;
        this.changeDetectorRefs.detectChanges();
        if (res && res.status === 1) {
          // if (withBack) {
          this.dialogRef.close({
            _product,
          });
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            99999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }
  itemtemprole3: AccountRole[] = [];
  changeChinhSua2(val: any, row: any) {
    debugger;
    this.itemid.map((item, index) => {
      if (item.Id_Permit == row.Id_Permit) {
        item.IsReadPermit = val.checked;
      } else {
        item.IsReadPermit = !val.checked;
      }
    });
    //  this.accountroleManagementService.Visible2 = this.itemid.some(item => item.IsReadPermit);
  }
  itemtemprole2: AccountRole = new AccountRole();
  loadInitDataById2() {
    debugger;
    if (this.item.Username !== "") {
      const sbGetrole = this.accountroleManagementService
        .getRoleById(this.data.item.Username)
        .pipe(
          tap((res: ResultObjModel<AccountRole>) => {
            // Gán toàn bộ mảng res vào this.itemtemprole
            if (res.status === 1) {
              this.itemtemprole2 = res.data;
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGetrole);
    }
  }
  itemtemprole: any[] = [];
  loadInitDataById() {
    debugger;
    if (this.item.Username !== "") {
      const sbGetrole = this.accountroleManagementService
        .getRoleById(this.data.item.Username)
        .pipe(
          tap((res: any[]) => {
            // Gán toàn bộ mảng res vào this.itemtemprole
            this.itemtemprole = res;
            console.log(this.itemtemprole);
          })
        )
        .subscribe();
      this.subscriptions.push(sbGetrole);
    }
  }
  ListIdNhanHieu() {
    debugger;
    if (this.item.Username !== "") {
      const xuatxu = this.accountroleManagementService
        .getRoleById(this.data.item.Username)
        .subscribe((res: ResultModel<AccountRole[]>) => {
          // Chú ý đến kiểu dữ liệu của res
          if (res && Array.isArray(res.data)) {
            this.itemtemprole = res.data;
            console.log(this.itemtemprole);
            // this.changeDetectorRefs.detectChanges();
          } else {
            console.error("Invalid data format:", res.data);
            // Xử lý trường hợp dữ liệu không hợp lệ ở đây
          }
        });
      this.subscriptions.push(xuatxu);
    }
  }
  isUserInRole2(username: string): boolean {
    debugger;
    // return this.itemtemprole2.Username === username;
    // Sử dụng phương thức find để tìm một phần tử trong mảng có giá trị Username trùng với biến username
    const foundRole = this.itemtemprole.find(
      (role) => role.Username === username
    );
    // Nếu foundRole không null (tức là đã tìm thấy một phần tử thỏa mãn điều kiện), trả về true; ngược lại trả về false
    return foundRole !== undefined;
  }
  isUserInRole3(Id_Permit: number): boolean {
    return this.itemid.some(
      (role) => role.Id_Permit === Id_Permit && role.Edit === true
    );
  }
  isUserInRole4(Id_Permit: number): boolean {
    return this.itemtemprole3.some((role) => role.Id_Permit === Id_Permit);
  }
  isUserInRole(Id_Permit: number): boolean {
    debugger;
    return this.itemtemprole3.some(
      (role) => role.Id_Permit === Id_Permit && role.Edit === false
    );
  }
  arr_data: AccountRole[] = [];
  changeIsReadPermit(event: MatCheckboxChange, index: number) {
    debugger;
    this.arr_data = this.itemid;
    if (event.checked) {
      this.arr_data[index].Edit = false;
      this.arr_data[index].Edit2 = false;
    } else {
      this.arr_data[index].Edit = true;
    }
    console.log(this.arr_data);
  }
  changeEdit(event: MatCheckboxChange, index: number) {
    debugger;
    // Kiểm tra nếu chỉ mục index không tồn tại trong mảng arr_data
    this.arr_data = this.itemid;

    // Gán giá trị cho thuộc tính Edit1 của phần tử tại chỉ mục index
    this.arr_data[index].Edit1 = event.checked;
    console.log(this.arr_data);
  }
}
