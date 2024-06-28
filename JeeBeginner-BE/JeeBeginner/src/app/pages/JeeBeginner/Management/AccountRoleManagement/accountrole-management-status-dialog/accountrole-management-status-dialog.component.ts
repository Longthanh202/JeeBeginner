import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, of, ReplaySubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { AccountRoleManagementService } from '../Services/accountrole-management.service';
import { AccountRoleModel, AccountRoleStatusModel } from '../Model/accountrole-management.model';
import { TranslateService } from '@ngx-translate/core';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';

@Component({
  selector: 'app-accountrole-management-status-dialog',
  templateUrl: './accountrole-management-status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRoleManagementStatusDialogComponent implements OnInit, OnDestroy {
  item: AccountRoleModel = new AccountRoleModel();
  isLoading;
  formGroup: FormGroup;
  note: string;
  private subscriptions: Subscription[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountRoleManagementStatusDialogComponent>,
    private fb: FormBuilder,
    public accountroleManagementService: AccountRoleManagementService,
    private changeDetect: ChangeDetectorRef,
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
    this.item.RowId = this.data.item.RowId;
    this.loadForm();
    const sb = this.accountroleManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    this.loadInitData();
  }

  loadInitData() {
    if (this.item.RowId !== 0) {
      const sbGet = this.accountroleManagementService.getNoteLock(this.item.RowId).pipe(tap((res: ResultObjModel<string>) => {
        if (res.status === 1) {
          this.note = res.data;
          this.setValueToForm(res.data);
        }
      })).subscribe();
      this.subscriptions.push(sbGet);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      ghichu: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    });
  }

  setValueToForm(note: string) {
    this.formGroup.controls.ghichu.setValue(note);
  }

  getTitle() {
    if (this.data.item.IsLock) {
      return this.translateService.instant('ACCOUNTROLEMANAGEMENT.MOKHOATAIKHOAN') + ' ' + this.data.item.Username;
    }
    return this.translateService.instant('ACCOUNTROLEMANAGEMENT.KHOATAIKHOAN') + ' ' + this.data.item.Username;
  }

  private prepareData(): AccountRoleStatusModel {
    let model = new AccountRoleStatusModel();
    model.empty();
    model.RowID = this.item.RowId;
    model.IsLock = this.data.item.IsLock;
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

  update(item: AccountRoleStatusModel) {
    this.isLoadingSubmit$.next(true);
    this.accountroleManagementService.UpdateStatusAccount(item).subscribe((res) => {
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
    return model.Note === this.note;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return e.returnValue = ''; //for Chorme
    }
  }
}
