import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { MatHangManagementService } from './Services/mathang-management.service';
import { MatHangManagementListComponent } from './mathang-management-list/mathang-management-list.component';
//import { taikhoanManagementEditDialogComponent } from './loaimathang-management-edit-dialog/loaimathang-management-edit-dialog.component';
import { MatHangManagementComponent } from './mathang-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatHangManagementEditDialogComponent } from './mathang-management-edit-dialog/mathang-management-edit-dialog.component';
//import { MatHangManagementStatusDialogComponent } from './MatHang-management-status-dialog/MatHang-management-status-dialog.component';
import {MatHangManagementImportDialogComponent} from './mathang-management-import-dialog/mathang-management-import-dialog.component';
import { MatHangManagementDetailDialogComponent } from './mathang-management-detail-dialog/mathang-management-detail-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: MatHangManagementComponent,
    children: [
      {
        path: '',
        component: MatHangManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    MatHangManagementEditDialogComponent,
    MatHangManagementListComponent,
    MatHangManagementComponent,
    MatHangManagementImportDialogComponent,
    MatHangManagementDetailDialogComponent
    //taikhoanManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    MatHangManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    MatHangManagementEditDialogComponent,
    MatHangManagementListComponent,
    MatHangManagementComponent,
    MatHangManagementImportDialogComponent,
    MatHangManagementDetailDialogComponent,
    //taikhoanManagementStatusDialogComponent
  ],
})
export class MatHangManagementModule { }
