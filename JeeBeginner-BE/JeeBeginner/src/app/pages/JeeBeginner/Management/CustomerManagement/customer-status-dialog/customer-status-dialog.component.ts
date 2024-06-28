import { CustomerThongTinService } from './../Services/customer-thong-tin.service';
import { CustomerAppStatusModel, CustomerModel } from './../Model/customer-management.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AccountStatusModel } from '../../AccountManagement/Model/account-management.model';

@Component({
  selector: 'app-customer-status-dialog',
  templateUrl: './customer-status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerStatusDialogComponent implements OnInit, OnDestroy {
  item: CustomerModel = new CustomerModel();
  isLoading;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerStatusDialogComponent>,
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
      ghichu: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(500)])],
    });
  }

  setValueToForm(note: string) {
    this.formGroup.controls.ghichu.setValue(note);
  }

  getTitle() {
    if (!this.data.item.Status) {
      return this.translateService.instant('CUSTOMER_INFO.MOAPP') + ' ' + this.data.item.AppName;
    }
    return this.translateService.instant('CUSTOMER_INFO.KHOAAPP') + ' ' + this.data.item.AppName;
  }

  private prepareData(): CustomerAppStatusModel {
    let model = new CustomerAppStatusModel();
    model.empty();
    model.CustomerID = this.data.CustomerID;
    model.AppID = this.data.item.AppID;
    model.Status = this.data.item.Status;
    model.Note = this.formGroup.controls.ghichu.value;
    return model;
  }

  onSubmit() {
    if (this.formGroup.valid) {
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

  update(item: CustomerAppStatusModel) {
    this.isLoadingSubmit$.next(true);
    this.customerThongTinService.UpdateStatus(item).subscribe((res) => {
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
    return model.Note === "";
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return e.returnValue = ''; //for Chorme
    }
  }
}
