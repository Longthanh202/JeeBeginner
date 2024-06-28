
export class AccountModel {
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

export interface AccountDTO {
  RowId: number;
  PartnerName: string;
  Username: string;
  Fullname: string;
  Mobile: string;
  CreatedDate: string;
  LastLogin: string;
  IsLock: boolean;

}

export class AccountStatusModel {
  RowID: number;
  IsLock: boolean;
  Note: string;

  empty() {
    this.RowID = 0;
    this.IsLock = false;
    this.Note = '';
  }
}
