import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { NhanHieuManagementService } from './Services/nhanhieu-management.service';
import { NhanHieuManagementListComponent } from './nhanhieu-management-list/nhanhieu-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
import { NhanHieuManagementComponent } from './nhanhieu-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { NhanHieuManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from './nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: NhanHieuManagementComponent,
    children: [
      {
        path: '',
        component: NhanHieuManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    NhanHieuManagementEditDialogComponent,
    NhanHieuManagementListComponent,
    NhanHieuManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    NhanHieuManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    NhanHieuManagementEditDialogComponent,
    NhanHieuManagementListComponent,
    NhanHieuManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class NhanHieuManagementModule { }
