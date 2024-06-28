import { CustomerThongTinService } from './../Services/customer-thong-tin.service';
import { CustomerAppStatusModel, CustomerModel, CustomerResetPasswordModel } from './../Model/customer-management.model';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-reset-password-dialog',
  templateUrl: './customer-reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerResetPasswordDialog implements OnInit, OnDestroy {
  item: CustomerModel = new CustomerModel();
  isLoading;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerResetPasswordDialog>,
    private fb: FormBuilder,
    public customerThongTinService: CustomerThongTinService,
    private layoutUtilsService: LayoutUtilsService,
    public danhmuc: DanhMucChungService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,

  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.RowID = this.data.item.RowID;
    this.loadForm();
    const sb = this.customerThongTinService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
  }

  loadForm() {
    this.formGroup = this.fb.group({
      oldpassword: ['', Validators.compose([Validators.required])],
      newpassword: ['', Validators.compose([Validators.required])],
      renewpassword: ['', Validators.compose([Validators.required])]
    });
  }



  getTitle() {
    return this.translateService.instant('CUSTOMER_RESETPASSWORD.TITLE');
  }

  private prepareData(): CustomerResetPasswordModel {
    let model = new CustomerResetPasswordModel();
    model.empty();
    model.CustomerID = this.item.RowID;
    model.OldPassword = this.formGroup.controls.oldpassword.value;
    model.NewPassword = this.formGroup.controls.newpassword.value;
    return model;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.formGroup.controls.newpassword.value !== this.formGroup.controls.renewpassword.value) {
        this.layoutUtilsService.showActionNotification('Mật khẩu không trùng khớp', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      const model = this.prepareData();
      this.update(model);
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

  update(item: CustomerResetPasswordModel) {
    this.isLoadingSubmit$.next(true);
    this.customerThongTinService.UpdateCustomerResetPasswordModel(item).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
      }
    }, (error) => {
      console.log(error);
      this.isLoadingSubmit$.next(false);
      this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    }, () => {
      this.isLoadingSubmit$.next(false);
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
    if (this.formGroup.controls.oldpassword.value === '' || this.formGroup.controls.newpassword.value === '' || this.formGroup.controls.renewpassword.value === '') return true;
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return e.returnValue = ''; //for Chorme
    }
  }
}
