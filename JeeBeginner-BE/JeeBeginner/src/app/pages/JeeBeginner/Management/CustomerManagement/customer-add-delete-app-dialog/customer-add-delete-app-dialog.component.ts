import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { GeneralService } from '../../../_core/services/general.service';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import {
  AppCustomerDTO,
  AppListDTO,
  CustomerAddDeletAppModel,
  CustomerAppGiaHanModel,
  CustomerModelDTO,
} from '../Model/customer-management.model';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerThongTinService } from '../Services/customer-thong-tin.service';
import { CustomerManagementService } from '../Services/customer-management.service';
import { finalize, tap } from 'rxjs/operators';
import { error } from 'console';

@Component({
  selector: 'customer-add-delete-app-dialog',
  templateUrl: './customer-add-delete-app-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddDeleteAppDialogComponent implements OnInit, OnDestroy {
  item: CustomerAppGiaHanModel = new CustomerAppGiaHanModel();
  isLoading;
  formGroup: FormGroup;
  partnerFilters: PartnerFilterDTO[] = [];
  private subscriptions: Subscription[] = [];
  filterForm: FormControl;
  minDate: Date;
  customer: CustomerModelDTO;
  LstAppCustomerDTO: AppCustomerDTO[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // table
  appCodes$ = new BehaviorSubject<AppListDTO[]>([]);
  displayedColumns = ['select', 'tenapp', 'goisudung', 'soluongnhansu'];
  goisudungArrayFrom: FormControl[] = [];
  soluongnhansuArrayFrom: FormControl[] = [];
  inputSoLuongForm: FormControl = new FormControl('', Validators.pattern(/^-?(0|[0-9]\d*)?$/));
  selection = new SelectionModel<number>(true, []);
  itemIds: number[] = [];
  selection2 = new SelectionModel<number>(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerAddDeleteAppDialogComponent>,
    private fb: FormBuilder,
    public customerThongTinService: CustomerThongTinService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public generalService: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private customerManagementService: CustomerManagementService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.CustomerID = this.data.item.RowID;
    this.minDate = new Date();
    this.loadForm();
    const sb = this.customerThongTinService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    this.isLoading = false;
    const add = this.customerThongTinService.getInfoAppByCustomerID(this.item.CustomerID).subscribe((res) => {
      if (res && res.status === 1) {
        this.LstAppCustomerDTO = res.data;
        this.isLoading = true;
        this.LstAppCustomerDTO.forEach((element) => {
          this.selection.select(element.AppID);
        });
        this.changeDetect.detectChanges();
        const request = this.customerManagementService
          .getListApp()
          .pipe(
            tap((res: ResultModel<AppListDTO>) => {
              if (res && res.status === 1) {
                const sb = this.customerManagementService.getPakageList().subscribe((data) => {
                  const dataNew = [];
                  res.data.forEach((element) => {
                    const pakeges = data.filter((item) => item.AppID == element.AppID);
                    element.LstPakage = pakeges;
                    if (this.LstAppCustomerDTO.findIndex((item) => item.AppID == element.AppID) < 0) {
                      dataNew.push(element);
                      this.itemIds.push(element.AppID);
                    }
                  });
                  this.appCodes$.next([...dataNew]);
                  this.addGoisudungArrayFrom();
                  this.addSoluongnhansuArrayFrom();
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
      }
    });
    this.subscriptions.push(add);
    const customerSB = this.customerThongTinService.getCustomer(this.item.CustomerID).subscribe((res: ResultObjModel<CustomerModelDTO>) => {
      if (res && res.status === 1) {
        this.customer = res.data;
        this.setValueToForm(this.customer);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
    this.subscriptions.push(customerSB);
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

  isAllSelected() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.itemIds.length;
    return numSelected === numRows;
  }

  changeSoLuong() {
    this.soluongnhansuArrayFrom.forEach((formControl) => {
      formControl.setValue(this.inputSoLuongForm.value);
    });
    this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
  }

  validateAllSoLuongNhanSu(formControl: FormControl[]): boolean {
    let isMark = false;
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (this.selection2.selected.includes(value) && !formControl[index].value) {
        isMark = true;
        formControl[index].markAllAsTouched();
      } else {
        formControl[index].markAsUntouched();
      }
    }
    return isMark;
  }

  setValueToForm(model: CustomerModelDTO) {
    if (model.GiaHanDenNgay) this.formGroup.controls.enddate.setValue(this.generalService.f_string_date(model.GiaHanDenNgay));
  }

  masterToggle() {
    this.isAllSelected() ? this.selection2.clear() : this.itemIds.forEach((row) => this.selection2.select(row));
  }

  loadForm() {
    this.formGroup = this.fb.group({
      enddate: [''],
    });
  }

  getTitle() {
    return this.translateService.instant('CUSTOMER_ADDDELETEAPP.TITLE');
  }

  private prepareData(): CustomerAddDeletAppModel {
    let model = new CustomerAddDeletAppModel();
    model.empty();
    model.CustomerID = this.item.CustomerID;
    model.EndDate = this.formGroup.controls.enddate.value ? this.generalService.format_date(this.formGroup.controls.enddate.value) : '';
    model.LstAddAppID = this.selection2.selected;
    if (model.LstAddAppID.length > 0) {
      if (!model.EndDate) {
        const message = this.translateService.instant('CUSTOMER_ADDDELETEAPP.NGAYHETHANBATBUOC');
        this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
    }
    this.LstAppCustomerDTO.forEach((element) => {
      if (!this.selection.selected.includes(element.AppID)) model.LstDeleteAppID.push(element.AppID);
    });
    const numberNhanSu: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (model.LstAddAppID.includes(value)) {
        numberNhanSu.push(this.soluongnhansuArrayFrom[index].value);
      }
    }
    model.SoLuongNhanSu = numberNhanSu;

    const goisudung: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (model.LstAddAppID.includes(value)) {
        goisudung.push(this.goisudungArrayFrom[index].value);
      }
    }
    model.GoiSuDung = goisudung;
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

  update(item: CustomerAddDeletAppModel) {
    this.isLoadingSubmit$.next(true);
    const sb = this.customerThongTinService.UpdateCustomerAddDeletAppModel(item).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(res);
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        this.isLoadingSubmit$.next(false);
      }
    );
    this.subscriptions.push(sb);
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
        res ? this.dialogRef.close() : undefined;
      });
    }
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (model.LstAddAppID.length > 0 || model.LstDeleteAppID.length > 0) return false;
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ''); //for Chorme
    }
  }
}
