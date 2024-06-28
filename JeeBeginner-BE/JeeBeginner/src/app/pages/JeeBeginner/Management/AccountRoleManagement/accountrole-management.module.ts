import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { AccountRoleManagementService } from './Services/accountrole-management.service';
import { AccountRoleManagementListComponent } from './accountrole-management-list/accountrole-management-list.component';
import { AccountRoleManagementEditDialogComponent } from './accountrole-management-edit-dialog/accountrole-management-edit-dialog.component';
import { AccountRoleManagementComponent } from './accountrole-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccountRoleManagementStatusDialogComponent } from './accountrole-management-status-dialog/accountrole-management-status-dialog.component';
import { AccountRoleManagementRoleDialogComponent } from './accountrole-management-role-dialog/accountrole-management-role-dialog.component';
const routes: Routes = [
  {
    path: '',
    component: AccountRoleManagementComponent,
    children: [
      {
        path: '',
        component: AccountRoleManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AccountRoleManagementEditDialogComponent,
    AccountRoleManagementRoleDialogComponent,
    AccountRoleManagementListComponent,
    AccountRoleManagementComponent,
    AccountRoleManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    AccountRoleManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    AccountRoleManagementEditDialogComponent,
    AccountRoleManagementRoleDialogComponent,
    AccountRoleManagementListComponent,
    AccountRoleManagementComponent,
    AccountRoleManagementStatusDialogComponent
  ],
})
export class AccountRoleManagementModule { }
