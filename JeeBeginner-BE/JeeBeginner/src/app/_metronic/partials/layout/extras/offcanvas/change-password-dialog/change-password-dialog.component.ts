import { GeneralService } from './../../../../../../pages/JeeBeginner/_core/services/general.service';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/pages/JeeBeginner/_core/utils/layout-utils.service';
import { ChangePasswordModel } from 'src/app/pages/JeeBeginner/_core/models/danhmuc.model';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordEditDialogComponent implements OnInit, OnDestroy {
  item: ChangePasswordModel = new ChangePasswordModel();
  itemForm = this.fb.group(
    {
      MatKhauCu: ['', [Validators.required]],
      MatKhau: ['', [Validators.required]],
      NhapLaiMatKhau: ['', [Validators.required]],
    },
    { validator: this.checkPasswords }
  );
  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordEditDialogComponent>,
    private fb: FormBuilder,
    private service: GeneralService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
    this.item = this.data.username;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.MatKhau.value;
    let confirmPass = group.controls.NhapLaiMatKhau.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const job = this.initDataFromFB();
      this.update(job);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  update(item: ChangePasswordModel) {
    this.isLoadingSubmit$.next(true);
    this.service.changePassword(item).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(res);
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      },
      () => {
        this.isLoadingSubmit$.next(false);
      }
    );
  }

  initDataFromFB(): ChangePasswordModel {
    const acc = new ChangePasswordModel();
    acc.Username = this.data.username;
    acc.PasswordOld = this.itemForm.controls.MatKhauCu.value;
    acc.PaswordNew = this.itemForm.controls.MatKhau.value;
    return acc;
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

  goBack() {
    this.dialogRef.close();
  }
}
