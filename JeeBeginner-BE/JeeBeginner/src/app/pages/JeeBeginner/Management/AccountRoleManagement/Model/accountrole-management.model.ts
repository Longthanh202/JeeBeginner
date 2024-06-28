
export class AccountRoleModel {
  RowId: number;
  PartnerId: number;
  Gender: string;
  Fullname: string;
  Mobile: string;
  Email: string;
  Username: string;
  Password: string;
  Note: string;

  empty() {
    this.RowId = 0;
    this.PartnerId = 0;
    this.Gender = 'Nam';
    this.Fullname = '';
    this.Mobile = '';
    this.Email = '';
    this.Username = '';
    this.Password = '';
    this.Note = '';
  }
}

export interface AccountRoleDTO {
  RowId: number;
  PartnerName: string;
  Username: string;
  Fullname: string;
  Mobile: string;
  Email: string;
  CreatedDate: string;
  LastLogin: string;
  IsLock: boolean;

}
export class AccountRole {

  Username: string;
  Id_Permit:number;
  Tenquyen: string;
  Edit: boolean;
  Edit1: boolean;
  Edit2: boolean;
  IsReadPermit: boolean;
  tempIsReadPermit: boolean;
  empty() {
    this.Username = '';
    this.Id_Permit = 0;
    this.Tenquyen = '';
    this.Edit = false;
    this.Edit1 = false;
    this.Edit2 = false;
    this.IsReadPermit = false;
    this.tempIsReadPermit = false;
  }

}

export class AccountRoleStatusModel {
  RowID: number;
  IsLock: boolean;
  Note: string;

  empty() {
    this.RowID = 0;
    this.IsLock = false;
    this.Note = '';
  }
}
