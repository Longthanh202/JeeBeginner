import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { AuthGuard } from '../modules/auth/_services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'builder',
        loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./JeeBeginner/page-girdters-dashboard/page-girdters-dashboard.module').then((m) => m.PageGirdtersDashboardModule),
      },
      {
        path: 'Management/CustomerManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/CustomerManagement/customer-management.module').then((m) => m.CustomerManagementModule),
      },
      {
        path: 'Management/PartnerManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/PartnerManagement/partner-management.module').then((m) => m.PartnerManagementModule),
      },
      {
        path: 'Management/AccountManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/AccountManagement/account-management.module').then((m) => m.AccountManagementModule),
      },
      {
        path: 'Management/TaikhoanManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/TaikhoanManagement/taikhoan-management.module').then((m) => m.TaikhoanManagementModule),
      },
      {
        path: 'Management/AccountRoleManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/AccountRoleManagement/accountrole-management.module').then((m) => m.AccountRoleManagementModule),
      },
      {
        path: 'Management/LoaiMatHangManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/LoaiMatHangManagement/loaimathang-management.module').then((m) => m.LoaiMatHangManagementModule),
      },
      {
        path: 'Management/NhanHieuManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/NhanHieuManagement/nhanhieu-management.module').then((m) => m.NhanHieuManagementModule),
      },
      {
        path: 'Management/DonViTinhManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/DonViTinhManagement/donvitinh-management.module').then((m) => m.DonViTinhManagementModule),
      },
      {
        path: 'Management/XuatXuManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/XuatXuManagement/xuatxu-management.module').then((m) => m.XuatXuManagementModule),
      },
      {
        path: 'Management/DoiTacBaoHiemManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/DoiTacBaoHiemManagement/doitacbaohiem-management.module').then((m) => m.DoiTacBaoHiemManagementModule),
      },
      {
        path: 'Management/LoaiTaiSanManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/LoaiTaiSanManagement/loaitaisan-management.module').then((m) => m.LoaiTaiSanManagementModule),
      },
      {
        path: 'Management/PhanNhomTaiSanManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/PhanNhomTaiSanManagement/phannhomtaisan-management.module').then((m) => m.PhanNhomTaiSanManagementModule),
      },
      {
        path: 'Management/LyDoTangGiamTaiSanManagement',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./JeeBeginner/Management/LyDoTangGiamTaiSanManagement/lydotanggiamtaisan-management.module').then((m) => m.LyDoTangGiamTaiSanManagementModule),
      },
      {
        path: 'Management/MatHangManagement',
        loadChildren: () =>
          import('./JeeBeginner/Management/MatHangManagement/mathang-management.module').then((m) => m.MatHangManagementModule),
      },
      {
        path: 'Abc',
        loadChildren: () =>
          import('./JeeBeginner/Management/AccountManagement/account-management.module').then((m) => m.AccountManagementModule),
      },

      {
        path: '',
        redirectTo: '/Management/CustomerManagement',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
