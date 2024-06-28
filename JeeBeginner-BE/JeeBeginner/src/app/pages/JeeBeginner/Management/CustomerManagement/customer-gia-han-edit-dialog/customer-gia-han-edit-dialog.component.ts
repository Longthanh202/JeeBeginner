import { CustomerManagementService } from './../Services/customer-management.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, of, ReplaySubject, Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { GeneralService } from '../../../_core/services/general.service';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { TranslateService } from '@ngx-translate/core';
import { PartnerFilterDTO } from '../../PartnerManagement/Model/partner-management.model';
import { AppCustomerDTO, CustomerAppGiaHanModel, CustomerModelDTO } from '../Model/customer-management.model';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerThongTinService } from '../Services/customer-thong-tin.service';

@Component({
  selector: 'app-customer-gia-han-edit-dialog',
  templateUrl: './customer-gia-han-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGiaHanEditDialogComponent implements OnInit, OnDestroy {
  item: CustomerAppGiaHanModel = new CustomerAppGiaHanModel();
  isLoading;
  formGroup: FormGroup;
  partnerFilters: PartnerFilterDTO[] = [];
  private subscriptions: Subscription[] = [];
  filterForm: FormControl;
  selection = new SelectionModel<number>(true, []);
  minDate: Date;
  customer: CustomerModelDTO;
  LstAppCustomerDTO: AppCustomerDTO[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerGiaHanEditDialogComponent>,
    private fb: FormBuilder,
    public customerThongTinService: CustomerThongTinService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public generalService: GeneralService,
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
    this.item.CustomerID = this.data.item.RowID;
    this.minDate = new Date();
    this.loadForm();
    const sb = this.customerThongTinService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    this.isLoading = false;
    const add = this.customerThongTinService.getInfoAppByCustomerID(this.item.CustomerID).subscribe((res) => {
      if (res && res.status === 1) {
        this.LstAppCustomerDTO = res.data;
        this.isLoading = true;
        this.LstAppCustomerDTO.forEach(element => {
          this.selection.select(element.AppID);
        });
        this.changeDetect.detectChanges();
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

  setValueToForm(model: CustomerModelDTO) {
    this.formGroup.controls.ghichu.setValue(model.Note);
    if (model.GiaHanDenNgay) this.formGroup.controls.enddate.setValue(this.generalService.f_string_date(model.GiaHanDenNgay));
  }

  loadForm() {
    this.formGroup = this.fb.group({
      ghichu: ['', Validators.compose([Validators.maxLength(500)])],
      enddate: ['', Validators.compose([Validators.required])],
    });
  }

  getTitle() {
    return this.translateService.instant('CUSTOMER_GIAHAN.TITLE');
  }

  private prepareData(): CustomerAppGiaHanModel {
    let model = new CustomerAppGiaHanModel();
    model.empty();
    model.CustomerID = this.item.CustomerID;
    model.EndDate = (this.formGroup.controls.enddate.value) ? this.generalService.format_date(this.formGroup.controls.enddate.value) : '';
    model.Note = this.formGroup.controls.ghichu.value;
    model.LstAppCustomerID = this.selection.selected;
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

  update(item: CustomerAppGiaHanModel) {
    this.isLoadingSubmit$.next(true);
    this.customerThongTinService.UpdateCustomerAppGiaHanModel(item).subscribe((res) => {
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
    if (model.EndDate === this.customer.GiaHanDenNgay && model.Note === this.customer.Note) return true;
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
