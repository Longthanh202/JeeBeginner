import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { TranslateModule } from '@ngx-translate/core';
import { PartnerManagementService } from './Services/partner-management.service';
import { PartnerManagementEditDialogComponent } from './partner-management-edit-dialog/partner-management-edit-dialog.component';
import { PartnerManagementListComponent } from './partner-management-list/partner-management-list.component';
import { PartnerManagementComponent } from './partner-management.component';
import { JeeCustomerModule } from 'src/app/pages/jee-customer.module';
import { PartnerManagementStatusDialogComponent } from './partner-management-status-dialog/partner-management-status-dialog.component';
const routes: Routes = [
  {
    path: '',
    component: PartnerManagementComponent,
    children: [
      {
        path: '',
        component: PartnerManagementListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    PartnerManagementComponent,
    PartnerManagementEditDialogComponent,
    PartnerManagementListComponent,
    PartnerManagementStatusDialogComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), JeeCustomerModule, NgxMatSelectSearchModule, InlineSVGModule, TranslateModule],
  providers: [
    PartnerManagementService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, height: 'auto', width: '900px' } },
  ],
  entryComponents: [
    PartnerManagementEditDialogComponent,
    PartnerManagementListComponent,
    PartnerManagementComponent,
    PartnerManagementStatusDialogComponent
  ],
})
export class PartnerManagementModule { }
