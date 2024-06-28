import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { AccountManagementService } from './Services/account-management.service';
import { AccountManagementListComponent } from './account-management-list/account-management-list.component';
import { AccountManagementEditDialogComponent } from './account-management-edit-dialog/account-management-edit-dialog.component';
import { AccountManagementComponent } from './account-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccountManagementStatusDialogComponent } from './account-management-status-dialog/account-management-status-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: AccountManagementComponent,
    children: [
      {
        path: '',
        component: AccountManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AccountManagementEditDialogComponent,
    AccountManagementListComponent,
    AccountManagementComponent,
    AccountManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    AccountManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    AccountManagementEditDialogComponent,
    AccountManagementListComponent,
    AccountManagementComponent,
    AccountManagementStatusDialogComponent
  ],
})
export class AccountManagementModule { }
