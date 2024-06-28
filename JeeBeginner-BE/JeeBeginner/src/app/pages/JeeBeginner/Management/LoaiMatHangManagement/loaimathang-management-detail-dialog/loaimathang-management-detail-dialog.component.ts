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
    templateUrl: "./loaimathang-management-detail-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class LoaiMatHangManagementDetailDialogComponent
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
      public dialogRef: MatDialogRef<LoaiMatHangManagementDetailDialogComponent>,
      private fb: FormBuilder,
      public loaimathangManagementService: LoaiMatHangManagementService,
      private changeDetect: ChangeDetectorRef,
      private layoutUtilsService: LayoutUtilsService,
      public general: GeneralService,
      public authService: AuthService,
      public datepipe: DatePipe,
      public dialog: MatDialog,
      private translateService: TranslateService
    ) {}
  
    ngOnDestroy(): void {
      this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
  
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

    getImageUrl(imageName: string): string {
      debugger
      return `${environment.ApiUrlRoot}/uploads/${imageName}`;
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
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        const base64Str = reader.result as string;
        this.src = base64Str;
        
        // Tiếp tục xử lý tải lên hình ảnh và gán cho selectedImageUrl
        this.file = event.target.files[0];
        if (this.file) {
          this.selectedImageUrl = (this.loaimathangManagementService.uploadImage(this.file)
          ).toString();
        }
      };
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
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[0-9]\d*)?$/),
            Validators.maxLength(50),
          ]),
        ],
        kho: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[0-9]\d*)?$/),
            Validators.maxLength(50),
          ]),
        ],
        douutien: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[0-9]\d*)?$/),
            Validators.maxLength(50),
          ]),
        ],
        mota: ["", Validators.compose([Validators.maxLength(500)])],
        image: [this.item.HinhAnh],
      });
    }
  
    setValueToForm(model: LoaiMatHangModel) {
      this.formGroup.controls.tenloaimathang.setValue(model.TenLMH);
      this.formGroup.controls.loaimathangcha.setValue(model.IdLMHParent);
      this.formGroup.controls.mota.setValue(model.Mota);
      this.formGroup.controls.douutien.setValue(model.DoUuTien);
      this.formGroup.controls.kho.setValue(model.IdKho);
      //this.formGroup.controls.image.setValue(model.HinhAnh);
      this.src = this.getImageUrl(model.HinhAnh);
  
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
  
    private prepareData(): LoaiMatHangModel {
      let model = new LoaiMatHangModel();
      model.empty();
      model.TenLMH = this.formGroup.controls.tenloaimathang.value;
      model.IdLMHParent = this.formGroup.controls.loaimathangcha.value;
      model.IdKho = this.formGroup.controls.kho.value;
      model.Mota = this.formGroup.controls.mota.value;
      model.DoUuTien = this.formGroup.controls.douutien.value;
      model.IdLMH = this.item.IdLMH;
      //model.HinhAnh = this.formGroup.controls.image.value;
      if (this.file && this.file.name) {
        model.HinhAnh = this.file.name;
      } else {
        model.HinhAnh = this.formGroup.controls["HinhAnh"].value; // hoặc bạn có thể gán giá trị khác tùy ý ở đây
      }
      return model;
    }
  
    Luu() {
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
  
    create(item: LoaiMatHangModel) {
      this.isLoadingSubmit$.next(true);
      if (this.authService.currentUserValue.IsMasterAccount)
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
  