import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, of, ReplaySubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { GeneralService } from '../../../_core/services/general.service'; import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { PartnerManagementService } from '../Services/partner-management.service';
import { PartnerModel } from '../Model/partner-management.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-partner-management-edit-dialog',
  templateUrl: './partner-management-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerManagementEditDialogComponent implements OnInit, OnDestroy {
  item: PartnerModel = new PartnerModel();
  isLoading;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PartnerManagementEditDialogComponent>,
    private fb: FormBuilder,
    public partnerManagementService: PartnerManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public generalService: GeneralService,
    private authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.RowId = this.data.item.RowId;
    this.loadForm();
    const sb = this.partnerManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    this.loadInitData();
  }

  loadInitData() {
    if (this.item.RowId !== 0) {
      const sbGet = this.partnerManagementService.getPartnerModelByRowID(this.item.RowId).pipe(tap((res: ResultObjModel<PartnerModel>) => {
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
      tendoitac: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
      nguoilienhe: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      ngaybatdausudung: ['', Validators.compose([Validators.required])],
      sodienthoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/), Validators.maxLength(50)])],
      code: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
      ghichu: ['', Validators.compose([Validators.maxLength(500)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      repassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])]
    });

    // this.formGroup.controls.code.valueChanges.subscribe((res) => {
    //   res ? this.formGroup.controls.username.setValue(res + '.') : this.formGroup.controls.username.setValue(undefined);
    // }
    // );
  }

  setValueToForm(partnerModel: PartnerModel) {
    this.formGroup.controls.tendoitac.setValue(partnerModel.PartnerName);
    this.formGroup.controls.nguoilienhe.setValue(partnerModel.ContactName);
    this.formGroup.controls.ngaybatdausudung.setValue(this.generalService.f_string_date(partnerModel.JoinDate));
    this.formGroup.controls.sodienthoai.setValue(partnerModel.ContactPhone);
    this.formGroup.controls.code.setValue(partnerModel.Code);
    this.formGroup.controls.email.setValue(partnerModel.ContactEmail);
    this.formGroup.controls.ghichu.setValue(partnerModel.Note);
    this.formGroup.controls.username.setValue(partnerModel.Username);
    this.formGroup.controls.password.setValue(partnerModel.Password);
    this.formGroup.controls.repassword.setValue(partnerModel.Password);
  }

  getTitle() {
    if (this.item.RowId === 0) {
      return this.translateService.instant('PARTNERMANAGEMENT.THEMDOITAC');
    }
    return this.translateService.instant('PARTNERMANAGEMENT.SUADOITAC') + ' ' + this.item.PartnerName;
  }

  private prepareData(): PartnerModel {
    let model = new PartnerModel();
    model.empty();
    model.RowId = this.item.RowId;
    model.Code = this.formGroup.controls.code.value;
    model.PartnerName = this.formGroup.controls.tendoitac.value;
    model.ContactName = this.formGroup.controls.nguoilienhe.value;
    model.Note = this.formGroup.controls.ghichu.value;
    model.ContactPhone = this.formGroup.controls.sodienthoai.value;
    model.ContactEmail = this.formGroup.controls.email.value;
    model.JoinDate = this.formGroup.controls.ngaybatdausudung.value ? this.generalService.format_date(this.formGroup.controls.ngaybatdausudung.value) : "";
    model.Username = this.formGroup.controls.username.value;
    model.Password = this.formGroup.controls.password.value;
    return model;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // if (this.formGroup.controls.username.value.length <= this.formGroup.controls.code.value.length + 1) {
      //   this.formGroup.controls.username.markAsTouched();
      //   this.layoutUtilsService.showActionNotification('Username không hợp lệ', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      //   return;
      // }
      if (this.formGroup.controls.password.value !== this.formGroup.controls.repassword.value) {
        this.layoutUtilsService.showActionNotification('Mật khẩu không trùng khớp', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
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

  create(item: PartnerModel) {
    this.isLoadingSubmit$.next(true);
    this.partnerManagementService.createPartner(item).subscribe((res) => {
      if (res && res.status === 1) {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  update(item: PartnerModel) {
    this.isLoadingSubmit$.next(true);
    this.partnerManagementService.updatePartner(item).subscribe((res) => {
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
      const _title = "Xác nhận";
      const _description = "Bạn có các thay đổi chưa lưu. Bạn có muốn thoát?";
      const _waitDesciption = "Đang thoát";
      const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      popup.afterClosed().subscribe((res) => {
        res ? this.dialogRef.close() : undefined
      })
    }
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.RowId === 0) {
      const empty = new PartnerModel();
      empty.empty();
      return this.generalService.isEqual(empty, model);
    };
    return this.generalService.isEqual(model, this.item);
  }

  eventHandler(event) {
    const length = this.formGroup.controls.code.value.length + 1;

    if (event.target.value.length == length && (event.code == "Backspace" || event.code == "Delete")) {
      return false;
    }
    return true;
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return e.returnValue = ''; //for Chorme
    }
  }
}
