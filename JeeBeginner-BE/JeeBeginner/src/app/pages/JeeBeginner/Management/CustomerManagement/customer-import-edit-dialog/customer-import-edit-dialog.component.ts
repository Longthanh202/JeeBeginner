import { CustomerModel } from './../Model/customer-management.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { ResultModel } from '../../../_core/models/_base.model';
import { CustomerManagementService } from '../Services/customer-management.service';

import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { AppListDTO } from '../Model/customer-management.model';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';

@Component({
  selector: 'app-customer-import-edit-dialog',
  templateUrl: './customer-import-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerImportEditDialogComponent implements OnInit, OnDestroy {
  item: any = [];
  isLoading;
  paginator: PaginatorState;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  displayedColumns = ['select', 'tenapp', 'goisudung', 'soluongnhansu'];
  appCodes$ = new BehaviorSubject<AppListDTO[]>([]);
  itemIds: number[] = [];
  selection = new SelectionModel<number>(true, []);
  goisudungArrayFrom: FormControl[] = [];
  soluongnhansuArrayFrom: FormControl[] = [];
  inputSoLuongForm: FormControl = new FormControl('', Validators.pattern(/^-?(0|[0-9]\d*)?$/));
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  checked: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerImportEditDialogComponent>,
    private fb: FormBuilder,
    public customerManagementService: CustomerManagementService,
    private layoutUtilsService: LayoutUtilsService,
    public danhmuc: DanhMucChungService,
    public datepipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    //this.item = this.data.item;
    const request = this.customerManagementService
      .getListApp()
      .pipe(
        tap((res: ResultModel<AppListDTO>) => {
          if (res && res.status === 1) {
            const sb = this.customerManagementService.getPakageList().subscribe((data) => {
              res.data.forEach((element) => {
                const pakeges = data.filter((item) => item.AppID == element.AppID);
                element.LstPakage = pakeges;
              });
              this.appCodes$.next([...res.data]);
              this.addGoisudungArrayFrom();
              this.addSoluongnhansuArrayFrom();
              res.data.forEach((element) => {
                this.itemIds.push(element.AppID);
              });
            });
            this.subscriptions.push(sb);
          } else {
            return this.appCodes$.next([]);
          }
        }),
        finalize(() => {
          this.isLoading = true;
        })
      )
      .subscribe();
    this.subscriptions.push(request);
    const sb = this.customerManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    this.loadCustomer();
  }
  loadCustomer() {
    this.loadForm();
    this.selection.changed.subscribe((res) => {
      this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
    });
  }

  loadForm() {
    this.formGroup = this.fb.group({
      tencongty: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      nguoidaidien: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
      ngaybatdausudung: ['', Validators.compose([Validators.required])],
      diachi: ['', Validators.compose([Validators.required])],
      gioitinh: ['Nam', Validators.compose([Validators.required])],
      sodienthoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)])],
      ngayhethan: [''],
      code: ['', Validators.compose([Validators.required])],
      customerID: ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]*$/)])],
      email: ['', Validators.compose([Validators.email])],
      linhvuchoatdong: [''],
      ghichu: [''],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      repassword: ['', Validators.compose([Validators.required])],
      staffid: ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]*$/)])],
    });
  }
  private prepareData(): CustomerModel {
    const customer = new CustomerModel();
    customer.empty();
    customer.RowID = this.formGroup.controls.customerID.value;
    customer.Address = this.formGroup.controls.diachi.value;
    customer.Code = this.formGroup.controls.code.value;
    customer.CompanyName = this.formGroup.controls.tencongty.value;
    customer.RegisterName = this.formGroup.controls.nguoidaidien.value;
    customer.Gender = this.formGroup.controls.gioitinh.value;
    customer.LinhVuc = this.formGroup.controls.linhvuchoatdong.value;
    customer.Note = this.formGroup.controls.ghichu.value;
    customer.Phone = this.formGroup.controls.sodienthoai.value;
    customer.Email = this.formGroup.controls.email.value;
    customer.RegisterDate = this.format_date(this.formGroup.controls.ngaybatdausudung.value);
    customer.DeadlineDate = this.format_date(this.formGroup.controls.ngayhethan.value);
    customer.AppID = this.selection.selected;
    customer.Username = this.formGroup.controls.username.value;
    customer.Password = this.formGroup.controls.password.value;
    customer.StaffID = this.formGroup.controls.staffid.value;
    const numberNhanSu: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        numberNhanSu.push(this.soluongnhansuArrayFrom[index].value);
      }
    }
    customer.SoLuongNhanSu = numberNhanSu;

    const goisudung: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        goisudung.push(this.goisudungArrayFrom[index].value);
      }
    }
    customer.GoiSuDung = goisudung;

    const lstDBCurrentID: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        lstDBCurrentID.push(-1);
      }
    }
    customer.CurrentDBID = lstDBCurrentID;
    return customer;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.selection.selected.length === 0) {
        this.layoutUtilsService.showActionNotification('App chưa được chọn', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      if (this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom) === true) return;
      if (this.formGroup.controls.password.value !== this.formGroup.controls.repassword.value) {
        this.layoutUtilsService.showActionNotification(
          'Mật khẩu không trùng khớp',
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          'top',
          0
        );
        return;
      }
      const customer = this.prepareData();
      this.create(customer);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  changeSoLuong() {
    this.soluongnhansuArrayFrom.forEach((formControl) => {
      formControl.setValue(this.inputSoLuongForm.value);
    });
    this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
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
  validateAllSoLuongNhanSu(formControl: FormControl[]): boolean {
    let isMark = false;
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (this.selection.selected.includes(value) && !formControl[index].value) {
        isMark = true;
        formControl[index].markAllAsTouched();
      } else {
        formControl[index].markAsUntouched();
      }
    }
    return isMark;
  }

  create(customer: CustomerModel) {
    this.isLoadingSubmit$.next(true);
    this.customerManagementService.importCustomer(customer).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  goBack() {
    this.dialogRef.close();
  }

  paginate(paginator: PaginatorState) {
    this.customerManagementService.patchState({ paginator });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.itemIds.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.itemIds.forEach((row) => this.selection.select(row));
  }

  private addGoisudungArrayFrom() {
    this.appCodes$
      .getValue()
      .forEach((item) => this.goisudungArrayFrom.push(new FormControl(item.LstPakage[0].RowID, [Validators.required])));
  }
  private addSoluongnhansuArrayFrom() {
    this.appCodes$
      .getValue()
      .forEach((item) =>
        this.soluongnhansuArrayFrom.push(new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]))
      );
  }

  f_number(value: any) {
    return Number((value + '').replace(/,/g, ''));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + '').replace(/,|-/g, ''));
    return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  eventHandler(event) {
    return true;
  }
  disableApp(AppID: number) {
    if (AppID == 14 || AppID == 16 || AppID == 3) {
      this.selection.select(AppID);
      return true;
    } else {
      return false;
    }
  }
}
