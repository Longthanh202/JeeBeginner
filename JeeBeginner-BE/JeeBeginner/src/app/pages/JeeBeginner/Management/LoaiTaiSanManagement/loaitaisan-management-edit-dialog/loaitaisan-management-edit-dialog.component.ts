import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, of, ReplaySubject, Subscription } from "rxjs";
import { AuthService } from "src/app/modules/auth/_services/auth.service";
import {
  LayoutUtilsService,
  MessageType,
} from "../../../_core/utils/layout-utils.service";
import { ResultModel, ResultObjModel } from "../../../_core/models/_base.model";
import { DatePipe } from "@angular/common";
import { finalize, tap } from "rxjs/operators";
import { PaginatorState } from "src/app/_metronic/shared/crud-table";
import { LoaiTaiSanManagementService } from "../Services/loaitaisan-management.service";
import { LoaiTaiSanModel } from "../Model/loaitaisan-management.model";
import { TranslateService } from "@ngx-translate/core";
import { GeneralService } from "../../../_core/services/general.service";

@Component({
  selector: "app-loaitaisan-management-edit-dialog",
  templateUrl: "./loaitaisan-management-edit-dialog.component.html",
  styleUrls: ["./StylePhongTo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaiTaiSanManagementEditDialogComponent
  implements OnInit, OnDestroy
{
  item: LoaiTaiSanModel = new LoaiTaiSanModel();
  itemkho: LoaiTaiSanModel = new LoaiTaiSanModel();
  isLoading;
  isExpanded = false;
  formGroup: FormGroup;
  khoFilters: LoaiTaiSanModel[] = [];
  loaiMHFilters: LoaiTaiSanModel[] = [];
  private subscriptions: Subscription[] = [];
  KhofilterForm: FormControl;
  loaiMHfilterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoaiTaiSanManagementEditDialogComponent>,
    private fb: FormBuilder,
    public loaitaisanManagementService: LoaiTaiSanManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public general: GeneralService,
    public authService: AuthService,
    private translate: TranslateService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  check: any
  ngOnInit(): void {
    this.item.empty();
    this.item.IdLoaiTS = this.data.item.IdLoaiTS;
    this.loadForm();
    const sb = this.loaitaisanManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    this.loadInitData();
    this.check = this.item.IdLoaiTS ? false : true;
  }


  loadInitData() {
    if (this.item.IdLoaiTS !== 0) {
      const sbGet = this.loaitaisanManagementService
        .gettaikhoanModelByRowID(this.item.IdLoaiTS)
        .pipe(
          tap((res: ResultObjModel<LoaiTaiSanModel>) => {
            if (res.status === 1) {
              this.item = res.data;
              this.setValueToForm(res.data);
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }

  loadForm() {
    debugger;
    this.formGroup = this.fb.group({
      MaLoai: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      TenLoai: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      TrangThai: [false, Validators.compose([Validators.required])],
    });
  }

  setValueToForm(model: LoaiTaiSanModel) {
    this.formGroup.controls.MaLoai.setValue(model.MaLoai);
    this.formGroup.controls.TenLoai.setValue(model.TenLoai);
    this.formGroup.controls.TrangThai.setValue(model.TrangThai);
  }

  // getTitle() {
  //   if (this.item.RowId === 0) {
  //     return this.translateService.instant(
  //       "ACCOUNTROLEMANAGEMENT.TAOTAIKHOANSUDUNG"
  //     );
  //   }
  //   return (
  //     this.translateService.instant("ACCOUNTROLEMANAGEMENT.SUATAIKHOAN") +
  //     " " +
  //     this.data.item.Username
  //   );
  // }

  private prepareData(): LoaiTaiSanModel {
    let model = new LoaiTaiSanModel();
    model.empty();
    model.IdLoaiTS = this.item.IdLoaiTS;
    model.MaLoai = this.formGroup.controls.MaLoai.value;
    model.TenLoai = this.formGroup.controls.TenLoai.value;
    model.TrangThai =
      this.formGroup.controls.TrangThai.value !== ""
        ? this.formGroup.controls.TrangThai.value
        : false;
    return model;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  savecontinute() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdLoaiTS === 0
        ? this.create(model, "saveAndContinue")
        : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  Luu() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdLoaiTS === 0
        ? this.create(model, "save")
        : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }

  create(item: LoaiTaiSanModel, actionType: string) {
    this.isLoadingSubmit$.next(true);
    if (
      this.authService.currentUserValue.IsMasterAccount ||
      !this.authService.currentUserValue.IsMasterAccount
    )
      this.loaitaisanManagementService
        .DM_LoaiTaiSan_Insert(item)
        .subscribe((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.status === 1) {
            if (actionType === "saveAndContinue") {
              this.dialogRef.close(res);

              const item = new LoaiTaiSanModel();
              item.empty();
              let saveMessageTranslateParam = "";
              saveMessageTranslateParam += "Thêm thành công";
              const saveMessage = this.translate.instant(
                saveMessageTranslateParam
              );
              const messageType = MessageType.Create;
              const dialogRef = this.dialog.open(
                LoaiTaiSanManagementEditDialogComponent,
                {
                  data: { item: item },
                  width: "900px",
                  disableClose: true,
                }
              );
              dialogRef.afterClosed().subscribe((res) => {
                if (!res) {
                  this.loaitaisanManagementService.fetch();
                } else {
                  this.layoutUtilsService.showActionNotification(
                    saveMessage,
                    messageType,
                    4000,
                    true,
                    false
                  );
                  this.loaitaisanManagementService.fetch();
                }
              });
            } else {
              this.dialogRef.close(res);
            }
          } else {
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        });
  }

  // Luu() {
  //   debugger
  //   const model = this.prepareData();
  //   this.item.IdLoaiTS === 0 ? this.create(model) : this.update(model);
  //   // if (this.formGroup.valid) {
  //   //   if (
  //   //     this.formGroup.controls.password.value !==
  //   //     this.formGroup.controls.repassword.value
  //   //   ) {
  //   //     const message = this.translateService.instant(
  //   //       "ERROR.MATKHAUKHONGTRUNGKHOP"
  //   //     );
  //   //     this.layoutUtilsService.showActionNotification(
  //   //       message,
  //   //       MessageType.Read,
  //   //       999999999,
  //   //       true,
  //   //       false,
  //   //       3000,
  //   //       "top",
  //   //       0
  //   //     );
  //   //     return;
  //   //   }
  //   //   const model = this.prepareData();
  //   //   this.item.IdLMH === 0 ? this.create(model) : this.update(model);
  //   // } else {
  //   //   this.validateAllFormFields(this.formGroup);
  //   // }
  // }

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

  // create(item: LoaiTaiSanModel) {
  //   this.isLoadingSubmit$.next(true);
  //   if (this.authService.currentUserValue.IsMasterAccount)
  //     this.loaitaisanManagementService
  //       .DM_LoaiTaiSan_Insert(item)
  //       .subscribe((res) => {
  //         this.isLoadingSubmit$.next(false);
  //         if (res && res.status === 1) {
  //           this.dialogRef.close(res);
  //         } else {
  //           this.layoutUtilsService.showActionNotification(
  //             res.error.message,
  //             MessageType.Read,
  //             999999999,
  //             true,
  //             false,
  //             3000,
  //             "top",
  //             0
  //           );
  //         }
  //       });
  // }

  update(item: LoaiTaiSanModel) {
    debugger;
    this.isLoadingSubmit$.next(true);
    this.loaitaisanManagementService.UpdateLoaiTaiSan(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
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
  }
  onMouseEnter(event: any, color: string) {
    event.target.style.backgroundColor = color;
  }

  onMouseLeave(event: any, color: string) {
    event.target.style.backgroundColor = color;
  }
  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.IdLoaiTS === 0) {
      const empty = new LoaiTaiSanModel();
      empty.empty();
      return this.general.isEqual(empty, model);
    }
    return this.general.isEqual(model, this.item);
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ""); //for Chorme
    }
  }
  handleKeyDown(event: KeyboardEvent) {
    // Kiểm tra nếu cả Ctrl và Enter đều được nhấn cùng lúc
    if (event.ctrlKey && event.key === "Enter") {
      // Gọi hàm lưu và đóng modal
      this.Luu();
      // Ngăn chặn hành vi mặc định của trình duyệt
      event.preventDefault();
    }
  }
  getTitle() {
    if (this.item.IdLoaiTS === 0) {
      return this.translateService.instant('Thêm mới');
    }
    return this.translateService.instant('Chỉnh sửa');
  }
}
