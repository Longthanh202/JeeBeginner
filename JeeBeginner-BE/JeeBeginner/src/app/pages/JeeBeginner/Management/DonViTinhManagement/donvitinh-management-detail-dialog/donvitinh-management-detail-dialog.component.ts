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
  import {
    ResultModel,
    ResultObjModel,
  } from "../../../_core/models/_base.model";
  import { DatePipe } from "@angular/common";
  import { finalize, tap } from "rxjs/operators";
  import { PaginatorState } from "src/app/_metronic/shared/crud-table";
  import { DonViTinhManagementService } from "../Services/donvitinh-management.service";
  import { DonViTinhModel } from "../Model/donvitinh-management.model";
  import { TranslateService } from "@ngx-translate/core";
  import { GeneralService } from "../../../_core/services/general.service";
  
  @Component({
    selector: "app-donvitinh-management-detail-dialog",
    templateUrl: "./donvitinh-management-detail-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DonViTinhManagementDetailDialogComponent
    implements OnInit, OnDestroy
  {
    item: DonViTinhModel = new DonViTinhModel();
    itemkho: DonViTinhModel = new DonViTinhModel();
    isLoading;
    formGroup: FormGroup;
    khoFilters: DonViTinhModel[] = [];
    loaiMHFilters: DonViTinhModel[] = [];
    private subscriptions: Subscription[] = [];
    KhofilterForm: FormControl;
    loaiMHfilterForm: FormControl;
    isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
      false
    );
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<DonViTinhManagementDetailDialogComponent>,
      private fb: FormBuilder,
      public donvitinhManagementService: DonViTinhManagementService,
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
      this.item.IdDVT = this.data.item.IdDVT;
      this.loadForm();
      const sb = this.donvitinhManagementService.isLoading$.subscribe((res) => {
        this.isLoading = res;
      });
      this.subscriptions.push(sb);
    this.loadInitData();
  
  
    }
    loadInitData() {
      if (this.item.IdDVT !== 0) {
        const sbGet = this.donvitinhManagementService.gettaikhoanModelByRowID(this.item.IdDVT).pipe(tap((res: ResultObjModel<DonViTinhModel>) => {
          if (res.status === 1) {
            this.item = res.data;
            this.setValueToForm(res.data);
          }
        })).subscribe();
        this.subscriptions.push(sbGet);
      }
    }
  
    loadForm() {
        this.formGroup = this.fb.group({
            IdDVT: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
          TenDVT: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],   
        });
      }
  
    setValueToForm(model: DonViTinhModel) {
        this.formGroup.controls.IdDVT.setValue(this.item.IdDVT);
      this.formGroup.controls.TenDVT.setValue(model.TenDVT);
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
  
    private prepareData(): DonViTinhModel {
      let model = new DonViTinhModel();
      model.empty();
      model.IdDVT=this.item.IdDVT;
      model.TenDVT = this.formGroup.controls.TenDVT.value;
      return model;
    }
  
    Luu() {
      debugger
      const model = this.prepareData();
      this.item.IdDVT === 0 ? this.create(model) : this.update(model);
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
  
    create(item: DonViTinhModel) {
      this.isLoadingSubmit$.next(true);
      if (this.authService.currentUserValue.IsMasterAccount)
        this.donvitinhManagementService
          .DM_DonViTinh_Insert(item)
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
  
    update(item: DonViTinhModel) {
      debugger
      this.isLoadingSubmit$.next(true);
      this.donvitinhManagementService.UpdateDonViTinh(item).subscribe((res) => {
        this.isLoadingSubmit$.next(false);
        if (res && res.status === 1) {
          this.dialogRef.close(res);
        } else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
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
      if (this.item.IdDVT === 0) {
        const empty = new DonViTinhModel();
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
  