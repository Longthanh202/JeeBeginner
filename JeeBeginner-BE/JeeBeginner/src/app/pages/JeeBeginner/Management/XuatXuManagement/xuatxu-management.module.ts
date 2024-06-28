import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { XuatXuManagementService } from './Services/xuatxu-management.service';
import { XuatXuManagementListComponent } from './xuatxu-management-list/xuatxu-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
import { XuatXuManagementComponent } from './xuatxu-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { XuatXuManagementEditDialogComponent } from './xuatxu-management-edit-dialog/xuatxu-management-edit-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from './nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: XuatXuManagementComponent,
    children: [
      {
        path: '',
        component: XuatXuManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    XuatXuManagementEditDialogComponent,
    XuatXuManagementListComponent,
    XuatXuManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    XuatXuManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    XuatXuManagementEditDialogComponent,
    XuatXuManagementListComponent,
    XuatXuManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class XuatXuManagementModule { }
