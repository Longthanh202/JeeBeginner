import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, of, ReplaySubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { TaikhoanManagementService } from '../Services/taikhoan-management.service';
import { TaikhoanModel } from '../Model/taikhoan-management.model';
import { TranslateService } from '@ngx-translate/core';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { GeneralService } from '../../../_core/services/general.service';

@Component({
  selector: 'app-taikhoan-management-edit-dialog',
  templateUrl: './taikhoan-management-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaikhoanManagementEditDialogComponent implements OnInit, OnDestroy {
  item: TaikhoanModel = new TaikhoanModel();
  isLoading;
  formGroup: FormGroup;
  partnerFilters: PartnerFilterDTO[] = [];
  private subscriptions: Subscription[] = [];
  filterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TaikhoanManagementEditDialogComponent>,
    private fb: FormBuilder,
    public taikhoanManagementService: TaikhoanManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public general: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,

  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.RowId = this.data.item.RowId;
    this.loadForm();
    const sb = this.taikhoanManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    const add = this.taikhoanManagementService.getPartnerFilters().subscribe((res: ResultModel<PartnerFilterDTO>) => {
      if (res && res.status === 1) {
        this.partnerFilters = res.data;
        this.filterForm = new FormControl(this.partnerFilters[0].RowId);
        this.isInitData.next(true);
      }
    });
    this.subscriptions.push(add);
    this.loadInitData();
  }

  loadInitData() {
    if (this.item.RowId !== 0) {
      const sbGet = this.taikhoanManagementService.getTaikhoanModelByRowID(this.item.RowId).pipe(tap((res: ResultObjModel<TaikhoanModel>) => {
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
      hoten: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      sodienthoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/), Validators.maxLength(50)])],
      gioitinh: ['Nam', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
      ghichu: ['', Validators.compose([Validators.maxLength(500)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      repassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])]
    });
  }

  setValueToForm(model: TaikhoanModel) {
    this.formGroup.controls.hoten.setValue(model.Fullname);
    this.formGroup.controls.gioitinh.setValue(model.Gender);
    this.formGroup.controls.sodienthoai.setValue(model.Mobile);
    this.formGroup.controls.email.setValue(model.Email);
    this.formGroup.controls.ghichu.setValue(model.Note);
    this.formGroup.controls.username.setValue(model.Username);
    this.formGroup.controls.password.setValue(model.Password);
    this.formGroup.controls.repassword.setValue(model.Password);
  }

  getTitle() {
    if (this.item.RowId === 0) {
      return this.translateService.instant('TAIKHOANMANAGEMENT.TAOTAIKHOANSUDUNG');
    }
    return this.translateService.instant('TAIKHOANMANAGEMENT.SUATAIKHOAN') + ' ' + this.data.item.Username;
  }

  private prepareData(): TaikhoanModel {
    let model = new TaikhoanModel();
    model.empty();
    model.RowId = this.item.RowId;
    model.Email = this.formGroup.controls.email.value;
    model.Fullname = this.formGroup.controls.hoten.value;
    model.Gender = this.formGroup.controls.gioitinh.value;
    model.Mobile = this.formGroup.controls.sodienthoai.value;
    model.Note = this.formGroup.controls.ghichu.value;
    model.PartnerId = this.item.PartnerId;
    model.Password = this.formGroup.controls.password.value;
    model.Username = this.formGroup.controls.username.value;
    return model;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.formGroup.controls.password.value !== this.formGroup.controls.repassword.value) {
        const message = this.translateService.instant('ERROR.MATKHAUKHONGTRUNGKHOP');
        this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      const model = this.prepareData();
      (this.item.RowId === 0) ? this.create(model) : this.update(model);
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

  create(item: TaikhoanModel) {
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount || !this.authService.currentUserValue.IsMasterAccount) 
      item.PartnerId = this.filterForm.value;
    this.taikhoanManagementService.createTaikhoan(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  update(item: TaikhoanModel) {
    this.isLoadingSubmit$.next(true);
    this.taikhoanManagementService.updateTaikhoan(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  goBack() {
    if (this.checkDataBeforeClose()) {
      this.dialogRef.close();
    } else {
      const _title = this.translateService.instant('CHECKPOPUP.TITLE');
      const _description = this.translateService.instant('CHECKPOPUP.DESCRIPTION');
      const _waitDesciption = this.translateService.instant('CHECKPOPUP.WAITDESCRIPTION');
      const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      popup.afterClosed().subscribe((res) => {
        res ? this.dialogRef.close() : undefined
      })
    }
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.RowId === 0) {
      const empty = new TaikhoanModel();
      empty.empty();
      return this.general.isEqual(empty, model);
    };
    return this.general.isEqual(model, this.item);
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return e.returnValue = ''; //for Chorme
    }
  }
}
