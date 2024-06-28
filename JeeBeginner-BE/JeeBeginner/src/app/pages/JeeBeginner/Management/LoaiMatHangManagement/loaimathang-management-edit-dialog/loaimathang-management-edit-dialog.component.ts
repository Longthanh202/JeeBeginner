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
import { LoaiMatHangManagementService } from "../Services/loaimathang-management.service";
import { LoaiMatHangModel } from "../Model/loaimathang-management.model";
import { TranslateService } from "@ngx-translate/core";
import { GeneralService } from "../../../_core/services/general.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-loaimathang-management-edit-dialog",
  templateUrl: "./loaimathang-management-edit-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaiMatHangManagementEditDialogComponent
  implements OnInit, OnDestroy
{
  item: LoaiMatHangModel = new LoaiMatHangModel();
  itemkho: LoaiMatHangModel = new LoaiMatHangModel();
  isLoading;
  formGroup: FormGroup;
  khoFilters: LoaiMatHangModel[] = [];
  loaiMHFilters: LoaiMatHangModel[] = [];
  private subscriptions: Subscription[] = [];
  KhofilterForm: FormControl;
  loaiMHfilterForm: FormControl;
  filename: any | null = null;
  src: string;
  file: File;
  selectedImageUrl: string = "";

  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoaiMatHangManagementEditDialogComponent>,
    private fb: FormBuilder,
    public loaimathangManagementService: LoaiMatHangManagementService,
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
  check: any;
  ngOnInit(): void {
    this.item.empty();
    this.item.IdLMH = this.data.item.IdLMH;
    this.loadForm();
    const sb = this.loaimathangManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    const add = this.loaimathangManagementService
      .DM_Kho_List()
      .subscribe((res: ResultModel<LoaiMatHangModel>) => {
        if (res && res.status === 1) {
          this.khoFilters = res.data;
          this.KhofilterForm = new FormControl(this.khoFilters[0].IdKho);
          this.isInitData.next(true);
        }
      });
    this.subscriptions.push(add);
    this.loadInitData();
    const addLMHC = this.loaimathangManagementService
      .LoaiMatHangCha_List()
      .subscribe((res: ResultModel<LoaiMatHangModel>) => {
        if (res && res.status === 1) {
          this.loaiMHFilters = res.data;
          this.loaiMHfilterForm = new FormControl(
            this.loaiMHFilters[0].IdLMHParent
          );
          this.isInitData.next(true);
        }
      });
    this.subscriptions.push(addLMHC);
    this.loadInitDataLoaiMHCHA();

    this.loadInitDataUpdate();

    this.check = this.item.IdLMH ? false : true
  }
  loadInitData() {
    if (this.itemkho.IdKho !== 0) {
      const sbGet = this.loaimathangManagementService
        .GetKhoID(this.itemkho.IdKho)
        .pipe(
          tap((res: ResultObjModel<LoaiMatHangModel>) => {
            if (res.status === 1) {
              this.itemkho = res.data;
              this.setValueToForm(res.data);
            }
          })
        )
        .subscribe();
      this.subscriptions.push(sbGet);
    }
  }

  selectedImages: { name: string; url: string }[] = [];

  getTitle() {
    if (this.item.IdLMH === 0) {
      return this.translateService.instant('Thêm mới');
    }
    return this.translateService.instant('Chỉnh sửa');
  }
  loadInitDataLoaiMHCHA() {
    if (this.item.IdLMHParent !== 0) {
      const sbGet = this.loaimathangManagementService
        .GetKhoID(this.item.IdLMHParent)
        .pipe(
          tap((res: ResultObjModel<LoaiMatHangModel>) => {
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

  // onFileSelected(event: any) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (e: any) => {
  //         const base64Str = reader.result as string;
  //         // const metaIdx = base64Str.indexOf(',') + 1;
  //         // const base64Data = base64Str.substr(metaIdx); // Cắt meta data khỏi chuỗi base64
  //         console.log(base64Str);
  //         this.review = base64Str;
  //     };
  // }

  // async onFileSelected(event: any) {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(event.target.files[0]);
  //   reader.onload = (e: any) => {
  //     const base64Str = reader.result as string;
  //     console.log(this.src);
  //     this.src = base64Str;
  //   };
  //   this.file = event.target.files[0];
  //   if (this.file) {
  //     this.selectedImageUrl = (
  //       await this.loaimathangManagementService.uploadImage(this.file)
  //     ).toString();
  //   }
  // }

  async onFileSelected(event: any) {
    debugger;

    this.file = event.target.files[0];

    if (this.file) {
      this.item.HinhAnh = this.file.name;
      try {
        this.selectedImageUrl = this.getImageUrl(this.file.name);
        this.loaimathangManagementService.uploadImage(this.file);
      } catch {
        console.log("Error Upload File");
      }
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  async onFileSelected1(event: any) {
    const files = event.target.files;

    if (files && files.length > 0) {
      for (const file of files) {
        const imageExists = this.selectedImages.some(
          (image) => image.name === file.name
        );

        if (!imageExists) {
          try {
            // for (let i = 0; i < 2; i++) {
            //   this.loaimathangManagementService.uploadImage(file);
            // }
            this.loaimathangManagementService.uploadImage(file);
          } catch {
            console.log("Error Upload File");
          }
          this.selectedImages.push({
            name: file.name,
            url: this.getImageUrl(file.name),
          });
        } else {
          const message = this.translateService.instant("ERROR.ANHBITRUNG");
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      }
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
  loadInitDataUpdate() {
    if (this.item.IdLMH !== 0) {
      const sbGet = this.loaimathangManagementService
        .gettaikhoanModelByRowID(this.item.IdLMH)
        .pipe(
          tap((res: ResultObjModel<LoaiMatHangModel>) => {
            if (res.status === 1) {
              this.item = res.data;
              this.src = res.data.HinhAnh;
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
      tenloaimathang: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ]),
      ],
      loaimathangcha: [
        this.item.IdLMHParent == null ? "0" : this.item.IdLMHParent.toString(),
      ],
      kho: [this.item.IdKho == null ? "0" : this.item.IdKho.toString()],
      douutien: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          Validators.maxLength(50),
        ]),
      ],
      mota: ["", Validators.compose([Validators.maxLength(500)])],
    });
  }

  setValueToForm(model: LoaiMatHangModel) {
    this.formGroup.controls.tenloaimathang.setValue(model.TenLMH);
    this.formGroup.controls.loaimathangcha.setValue(model.IdLMHParent);
    this.formGroup.controls.mota.setValue(model.Mota);
    this.formGroup.controls.douutien.setValue(model.DoUuTien);
    this.formGroup.controls.kho.setValue(model.IdKho);

    if (model.HinhAnh !== "") {
      this.selectedImages.push({
        url: this.getImageUrl(model.HinhAnh),
        name: model.HinhAnh,
      });
    }
    //this.formGroup.controls.image.setValue(model.HinhAnh);
    //this.selectedImageUrl = this.getImageUrl(model.HinhAnh);

    //this.formGroup.controls.nhanhieucha.setValue(model.IdLMHParent);
    //this.formGroup.controls.kho.setValue(model.IdKho);
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

  // private prepareData(): LoaiMatHangModel {
  //   debugger
  //   let model = new LoaiMatHangModel();
  //   model.empty();
  //   model.TenLMH = this.formGroup.controls.tenloaimathang.value;
  //   model.IdLMHParent = this.formGroup.controls.loaimathangcha.value;
  //   model.IdKho = this.formGroup.controls.kho.value;
  //   model.Mota = this.formGroup.controls.mota.value;
  //   model.DoUuTien = this.formGroup.controls.douutien.value;
  //   model.IdLMH = this.item.IdLMH;
  //   //model.HinhAnh = this.formGroup.controls.image.value;
  //   if (this.file && this.file.name) {
  //     model.HinhAnh = this.file.name;
  //   } else {
  //     model.HinhAnh = this.formGroup.controls["HinhAnh"].value; // hoặc bạn có thể gán giá trị khác tùy ý ở đây
  //   }
  //   return model;
  // }

  getImageUrl(imageName: string): string {
    debugger
    return `${environment.ApiUrlRoot}/uploads/${imageName}`;
  }

  private prepareData(): LoaiMatHangModel {
    debugger;
    let model = new LoaiMatHangModel();
    model.empty();
    model.TenLMH = this.formGroup.controls.tenloaimathang.value;
    model.IdLMHParent = this.formGroup.controls.loaimathangcha.value;
    model.IdKho = this.formGroup.controls.kho.value;
    model.Mota = this.formGroup.controls.mota.value;
    model.DoUuTien = this.formGroup.controls.douutien.value;
    model.IdLMH = this.item.IdLMH;
    this.selectedImages.length === 0
    ? (model.HinhAnh = "")
    : (model.HinhAnh = this.selectedImages[0].name);

    
    //model.HinhAnh = this.item.HinhAnh;
    // if (this.file && this.file.name) {
    //   model.HinhAnh = this.file.name;
    // } else {
    //   model.HinhAnh = this.src; // hoặc bạn có thể gán giá trị khác tùy ý ở đây
    // }

    return model;
  }

  savecontinute(){
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdLMH === 0 ? this.create1(model,'saveAndContinue') : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  Luu() {
    debugger;
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.item.IdLMH === 0 ? this.create(model) : this.update(model);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
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

  onSelectionChangeKho(event: any) {
    const selectedValue = event.target.value;
    this.item.IdKho = selectedValue;
  }
  onSelectionChangeCha(event: any) {
    const selectedValue = event.target.value;
    this.item.IdLMHParent = selectedValue;
  }

  onChangeNumber(event: any) {
    const kq = event.target.value.replace(/^0+(?=\d)/, "");
    this.formGroup.get("douutien").setValue(kq);
  }
  create(item: LoaiMatHangModel) {
    this.isLoadingSubmit$.next(true);
    if (
      this.authService.currentUserValue.IsMasterAccount ||
      !this.authService.currentUserValue.IsMasterAccount
    )
      this.loaimathangManagementService
        .DM_LoaiMatHang_Insert(item)
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

  create1(item: LoaiMatHangModel, actionType: string) {
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount || ! this.authService.currentUserValue.IsMasterAccount)
      this.loaimathangManagementService
        .DM_LoaiMatHang_Insert(item)
        .subscribe((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.status === 1) {
            if (actionType === 'saveAndContinue') {
              this.dialogRef.close(res); 

            const item = new LoaiMatHangModel();
            item.empty();
            let saveMessageTranslateParam = '';
            saveMessageTranslateParam += 'Thêm thành công';
            const saveMessage = this.translate.instant(saveMessageTranslateParam);
            const messageType = MessageType.Create;
            const dialogRef = this.dialog.open(LoaiMatHangManagementEditDialogComponent, {
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

  update(item: LoaiMatHangModel) {
    this.isLoadingSubmit$.next(true);
    this.loaimathangManagementService
      .UpdateLoaiMatHang(item)
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

  reset() {
    this.formGroup.controls.tenloaimathang.setValue("");
    this.formGroup.controls.loaimathangcha.setValue("");
    this.formGroup.controls.mota.setValue("");
    this.formGroup.controls.douutien.setValue("");
    this.formGroup.controls.kho.setValue("");
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.IdLMH === 0) {
      const empty = new LoaiMatHangModel();
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
}
