import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { LoaiTaiSanManagementService } from './Services/loaitaisan-management.service';
import { LoaiTaiSanManagementListComponent } from './loaitaisan-management-list/loaitaisan-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
import { LoaiTaiSanManagementComponent } from './loaitaisan-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoaiTaiSanManagementEditDialogComponent } from './loaitaisan-management-edit-dialog/loaitaisan-management-edit-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from './nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';
import {LoaiTaiSanManagementImportDialogComponent} from './loaitaisan-management-import-dialog/loaitaisan-management-import-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: LoaiTaiSanManagementComponent,
    children: [
      {
        path: '',
        component: LoaiTaiSanManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    LoaiTaiSanManagementEditDialogComponent,
    LoaiTaiSanManagementListComponent,
    LoaiTaiSanManagementComponent,
    LoaiTaiSanManagementImportDialogComponent,
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    LoaiTaiSanManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    LoaiTaiSanManagementEditDialogComponent,
    LoaiTaiSanManagementListComponent,
    LoaiTaiSanManagementComponent,
    LoaiTaiSanManagementImportDialogComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class LoaiTaiSanManagementModule { }
