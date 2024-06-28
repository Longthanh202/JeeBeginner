import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { TaikhoanManagementService } from './Services/taikhoan-management.service';
import { TaikhoanManagementListComponent } from './taikhoan-management-list/taikhoan-management-list.component';
import { TaikhoanManagementEditDialogComponent } from './taikhoan-management-edit-dialog/taikhoan-management-edit-dialog.component';
import { TaikhoanManagementComponent } from './taikhoan-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { TaikhoanManagementStatusDialogComponent } from './taikhoan-management-status-dialog/taikhoan-management-status-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: TaikhoanManagementComponent,
    children: [
      {
        path: '',
        component: TaikhoanManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    TaikhoanManagementEditDialogComponent,
    TaikhoanManagementListComponent,
    TaikhoanManagementComponent,
    TaikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    TaikhoanManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    TaikhoanManagementEditDialogComponent,
    TaikhoanManagementListComponent,
    TaikhoanManagementComponent,
    TaikhoanManagementStatusDialogComponent
  ],
})
export class TaikhoanManagementModule { }
