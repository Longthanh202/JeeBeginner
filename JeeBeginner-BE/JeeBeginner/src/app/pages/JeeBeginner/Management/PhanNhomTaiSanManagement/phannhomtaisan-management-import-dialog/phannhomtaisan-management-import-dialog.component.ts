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
import { PhanNhomTaiSanManagementService } from "../Services/phannhomtaisan-management.service";
import { PhanNhomTaiSanModel } from "../Model/phannhomtaisan-management.model";
import { TranslateService } from "@ngx-translate/core";
import { GeneralService } from "../../../_core/services/general.service";

@Component({
  selector: "app-phannhomtaisan-management-edit-dialog",
  templateUrl: "./phannhomtaisan-management-import-dialog.component.html",
  //styleUrls: ["./StylePhongTo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhanNhomTaiSanManagementImportDialogComponent
  implements OnInit, OnDestroy
{
  item: PhanNhomTaiSanModel = new PhanNhomTaiSanModel();
  itemkho: PhanNhomTaiSanModel = new PhanNhomTaiSanModel();
  isLoading;
  isExpanded = false;
  formGroup: FormGroup;
  khoFilters: PhanNhomTaiSanModel[] = [];
  loaiMHFilters: PhanNhomTaiSanModel[] = [];
  private subscriptions: Subscription[] = [];
  KhofilterForm: FormControl;
  selectedFile: File | null = null;
  loaiMHfilterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhanNhomTaiSanManagementImportDialogComponent>,
    private fb: FormBuilder,
    public phannhomtaisanManagementService: PhanNhomTaiSanManagementService,
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

  ngOnInit(): void {
    this.item.empty();
    this.item.IdPNTS = this.data.item.IdPNTS;
    this.loadForm();
    const sb = this.phannhomtaisanManagementService.isLoading$.subscribe(
      (res) => {
        this.isLoading = res;
      }
    );
    this.subscriptions.push(sb);
    this.loadInitData();
  }
  loadInitData() {
    if (this.item.IdPNTS !== 0) {
      const sbGet = this.phannhomtaisanManagementService
        .gettaikhoanModelByRowID(this.item.IdPNTS)
        .pipe(
          tap((res: ResultObjModel<PhanNhomTaiSanModel>) => {
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
    this.formGroup = this.fb.group({
      MaNhom: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      TenNhom: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      TrangThai: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
    });
  }

  setValueToForm(model: PhanNhomTaiSanModel) {
    this.formGroup.controls.MaNhom.setValue(model.MaNhom);
    this.formGroup.controls.TenNhom.setValue(model.TenNhom);

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

  private prepareData(): PhanNhomTaiSanModel {
    let model = new PhanNhomTaiSanModel();
    model.empty();
    model.IdPNTS = this.item.IdPNTS;
    model.MaNhom = this.formGroup.controls.MaNhom.value;
    model.TenNhom = this.formGroup.controls.TenNhom.value;
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
      this.item.IdPNTS === 0
        ? this.create(model, "saveAndContinue")
        : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  Luu() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdPNTS === 0 ? this.create(model, "save") : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }

  create(item: PhanNhomTaiSanModel, actionType: string) {
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount)
      this.phannhomtaisanManagementService
        .DM_PhanNhomTaiSan_Insert(item)
        .subscribe((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.status === 1) {
            if (actionType === "saveAndContinue") {
              this.dialogRef.close(res);

              const item = new PhanNhomTaiSanModel();
              item.empty();
              let saveMessageTranslateParam = "";
              saveMessageTranslateParam += "Thêm thành công";
              const saveMessage = this.translate.instant(
                saveMessageTranslateParam
              );
              const messageType = MessageType.Create;
              const dialogRef = this.dialog.open(
                PhanNhomTaiSanManagementImportDialogComponent,
                {
                  data: { item: item },
                  width: "900px",
                  disableClose: true,
                }
              );
              dialogRef.afterClosed().subscribe((res) => {
                if (!res) {
                  this.phannhomtaisanManagementService.fetch();
                } else {
                  this.layoutUtilsService.showActionNotification(
                    saveMessage,
                    messageType,
                    4000,
                    true,
                    false
                  );
                  this.phannhomtaisanManagementService.fetch();
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
  //   this.item.IdPNTS === 0 ? this.create(model) : this.update(model);
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

  // create(item: PhanNhomTaiSanModel) {
  //   this.isLoadingSubmit$.next(true);
  //   if (this.authService.currentUserValue.IsMasterAccount)
  //     this.phannhomtaisanManagementService
  //       .DM_PhanNhomTaiSan_Insert(item)
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

  update(item: PhanNhomTaiSanModel) {
    debugger;
    this.isLoadingSubmit$.next(true);
    this.phannhomtaisanManagementService
      .UpdatePhanNhomTaiSan(item)
      .subscribe((res) => {
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

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.IdPNTS === 0) {
      const empty = new PhanNhomTaiSanModel();
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

  downloadTemplate(): void {
    this.phannhomtaisanManagementService.exportToExcel().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "doi-tac-bao-hiem-mau.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  // importData(): void {
  //   if (this.selectedFile) {
  //     this.doitacbaohiemManagementService.importData(this.selectedFile).subscribe(
  //       response => {
  //         console.log('Data imported successfully!', response);
  //         // Thông báo thành công hoặc thực hiện các xử lý khác nếu cần
  //       },
  //       error => {
  //         console.error('Error while importing data:', error);
  //         // Xử lý lỗi nếu có
  //       }
  //     );
  //   }
  // }

  import(): void {
    debugger;
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount)
      this.phannhomtaisanManagementService
        .importData(this.selectedFile)
        .subscribe((res) => {
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

  filename: any
  onFileChange(event: any): void {
    //const file = event.target.files[0];
    this.selectedFile = event.target.files[0] as File;
    this.filename = this.selectedFile.name;
  }

  fileInput() {}
}
