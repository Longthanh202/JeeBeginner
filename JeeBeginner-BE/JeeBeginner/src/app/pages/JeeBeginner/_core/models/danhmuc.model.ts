export interface NhanVienMatchip {
  Fullname: string;
  Username: string;
  Display: string;
  UserId: number;
}

export interface  DepartmentSelection {
  RowID: string;
  DeparmentName: string;
}
export class ChangePasswordModel {
  Username: string;
  PasswordOld: string;
  PaswordNew: string;
}