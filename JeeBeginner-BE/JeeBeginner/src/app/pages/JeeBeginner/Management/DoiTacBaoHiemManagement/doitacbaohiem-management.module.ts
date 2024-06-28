import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { DoiTacBaoHiemManagementService } from './Services/doitacbaohiem-management.service';
import { DoiTacBaoHiemManagementListComponent } from './doitacbaohiem-management-list/doitacbaohiem-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './nhanhieu-management-edit-dialog/nhanhieu-management-edit-dialog.component';
import { DoiTacBaoHiemManagementComponent } from './doitacbaohiem-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { DoiTacBaoHiemManagementEditDialogComponent } from './doitacbaohiem-management-edit-dialog/doitacbaohiem-management-edit-dialog.component';
//import { nhanhieuManagementStatusDialogComponent } from './nhanhieu-management-status-dialog/nhanhieu-management-status-dialog.component';
import {DoiTacBaoHiemManagementImportDialogComponent} from './doitacbaohiem-management-inport-dialog/doitacbaohiem-management-import-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: DoiTacBaoHiemManagementComponent,
    children: [
      {
        path: '',
        component: DoiTacBaoHiemManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    DoiTacBaoHiemManagementEditDialogComponent,
    DoiTacBaoHiemManagementImportDialogComponent,
    DoiTacBaoHiemManagementListComponent,
    DoiTacBaoHiemManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    DoiTacBaoHiemManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    DoiTacBaoHiemManagementEditDialogComponent,
    DoiTacBaoHiemManagementImportDialogComponent,
    DoiTacBaoHiemManagementListComponent,
    DoiTacBaoHiemManagementComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class DoiTacBaoHiemManagementModule { }
