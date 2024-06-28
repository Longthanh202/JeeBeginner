import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { DonViTinhManagementService } from './Services/donvitinh-management.service';
import { DonViTinhManagementListComponent } from './donvitinh-management-list/donvitinh-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
import { DonViTinhManagementComponent } from './donvitinh-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { DonViTinhManagementEditDialogComponent } from './donvitinh-management-edit-dialog/donvitinh-management-edit-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from './nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';
import { DonViTinhManagementDetailDialogComponent } from './donvitinh-management-detail-dialog/donvitinh-management-detail-dialog.component';
const routes: Routes = [
  {
    path: '',
    component: DonViTinhManagementComponent,
    children: [
      {
        path: '',
        component: DonViTinhManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    DonViTinhManagementDetailDialogComponent,
    DonViTinhManagementEditDialogComponent,
    DonViTinhManagementListComponent,
    DonViTinhManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    DonViTinhManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    DonViTinhManagementDetailDialogComponent,
    DonViTinhManagementEditDialogComponent,
    DonViTinhManagementListComponent,
    DonViTinhManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class DonViTinhManagementModule { }
