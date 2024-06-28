export interface CustomerModelDTO {
  RowID: number;
  Code: string;
  CompanyName: string;
  RegisterName: string;
  Address: string;
  Phone: string;
  RegisterDate: string;
  Status: number;
  Note: string;
  GiaHanDenNgay: string;
}

export class CustomerModel {
  RowID: number;
  Code: string;
  CompanyName: string;
  RegisterName: string;
  Address: string;
  Phone: string;
  RegisterDate: string;
  Note: string;
  Gender: string;
  LinhVuc: string;
  DeadlineDate: string;
  AppID: number[];
  SoLuongNhanSu: number[];
  GoiSuDung: number[];
  CurrentDBID: number[];
  Email: string;
  Username: string;
  Password: string;
  StaffID: number;
  empty() {
    this.RowID = 0;
    this.Code = '';
    this.CompanyName = '';
    this.RegisterDate = '';
    this.Address = '';
    this.Phone = '';
    this.RegisterDate = '';
    this.Note = '';
    this.Gender = '';
    this.DeadlineDate = '';
    this.AppID = [];
    this.SoLuongNhanSu = [];
    this.GoiSuDung = [];
    this.Email = '';
    this.Username = '';
    this.Password = '';
    this.StaffID = 0;
  }
}

export class AppListDTO {
  AppID: number;
  AppCode: string;
  AppName: string;
  Description: string;
  BackendURL: string;
  APIUrl: string;
  ReleaseDate: string;
  Note: string;
  CurrentVersion: string;
  LastUpdate: string;
  IsDefaultApp: boolean;
  SoLuongNhanSu: number;
  LstPakage: Pakage[] = [];
}

export class AppCustomerDTO {
  CustomerID: number;
  AppID: number;
  EndDate: string;
  Status: boolean;
  Note: string;
  AppName: string;
  PakageTitle: string;
}

export class CustomerAppStatusModel {
  CustomerID: number;
  AppID: number;
  Status: boolean;
  Note: string;
  empty() {
    this.CustomerID = 0;
    this.AppID = 0;
    this.Status = true;
    this.Note = '';
  }
}

export class CustomerResetPasswordModel {
  CustomerID: number;
  OldPassword: string;
  NewPassword: string;
  empty() {
    this.CustomerID = 0;
    this.OldPassword = '';
    this.NewPassword = '';
  }
}

export class CustomerAppGiaHanModel {
  CustomerID: number;
  EndDate: string;
  Note: string;
  LstAppCustomerID: number[];

  empty() {
    this.CustomerID = 0;
    this.EndDate = '';
    this.Note = '';
    this.LstAppCustomerID = [];
  }
}

export class CustomerAddDeletAppModel {
  CustomerID: number;
  EndDate: string;
  LstAddAppID: number[];
  LstDeleteAppID: number[];
  SoLuongNhanSu: number[];
  GoiSuDung: number[];
  empty() {
    this.CustomerID = 0;
    this.EndDate = '';
    this.LstAddAppID = [];
    this.LstDeleteAppID = [];
    this.SoLuongNhanSu = [];
    this.GoiSuDung = [];
  }
}

export interface CustomerAppDTO {
  CustomerID: number;
  AppID: number;
  AppName: string;
  StartDate: string;
  EndDate: string;
  PackageID: number;
  Status: number;
  SoLuongNhanSu: number;
}

export class CustomerAppAddNumberStaffModel {
  CustomerID: number;
  lstCustomerAppDTO: CustomerAppDTO[];

  empty() {
    this.CustomerID = 0;
    this.lstCustomerAppDTO = [];
  }
}

export class Pakage {
  RowID: number;
  Title: string;
  LimitedNumberOfProfile: number;
  Note: string;
  IsTrial: boolean;
  NumberOfDayLimit: number;
  AppID: number;
}
