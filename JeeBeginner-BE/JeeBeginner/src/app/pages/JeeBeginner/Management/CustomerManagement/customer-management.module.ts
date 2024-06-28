import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { CustomerManagementService } from './Services/customer-management.service';
import { CustomerThongTinService } from './Services/customer-thong-tin.service';
import { CustomerManagementListComponent } from './customer-management-list/customer-management-list.component';
import { CustomerManagementEditDialogComponent } from './customer-management-edit-dialog/customer-management-edit-dialog.component';
import { CustomerManagementComponent } from './customer-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerGiaHanEditDialogComponent } from './customer-gia-han-edit-dialog/customer-gia-han-edit-dialog.component';
import { CustomerThongTinListComponent } from './customer-thong-tin-list/customer-thong-tin-list.component';
import { CustomerStatusDialogComponent } from './customer-status-dialog/customer-status-dialog.component';
import { CustomerAddNumberStaffDialogComponent } from './customer-add-number-staff-dialog/customer-add-number-staff-dialog.component';
import { CustomerResetPasswordDialog } from './customer-reset-password/customer-reset-password.component';
import { CustomerAddDeleteAppDialogComponent } from './customer-add-delete-app-dialog/customer-add-delete-app-dialog.component';
import { CustomerImportEditDialogComponent } from './customer-import-edit-dialog/customer-import-edit-dialog.component';
const routes: Routes = [
  {
    path: '',
    component: CustomerManagementComponent,
    children: [
      {
        path: '',
        component: CustomerManagementListComponent,
      },
      {
        path: 'info/:id',
        component: CustomerThongTinListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    CustomerManagementEditDialogComponent,
    CustomerManagementListComponent,
    CustomerManagementComponent,
    CustomerGiaHanEditDialogComponent,
    CustomerThongTinListComponent,
    CustomerStatusDialogComponent,
    CustomerAddNumberStaffDialogComponent,
    CustomerResetPasswordDialog,
    CustomerAddDeleteAppDialogComponent,
    CustomerImportEditDialogComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    CustomerManagementService,
    CustomerThongTinService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    CustomerManagementEditDialogComponent,
    CustomerManagementListComponent,
    CustomerManagementComponent,
    CustomerGiaHanEditDialogComponent,
    CustomerStatusDialogComponent,
    CustomerAddNumberStaffDialogComponent,
    CustomerResetPasswordDialog,
    CustomerAddDeleteAppDialogComponent,
    CustomerImportEditDialogComponent,
  ],
})
export class CustomerManagementModule {}
