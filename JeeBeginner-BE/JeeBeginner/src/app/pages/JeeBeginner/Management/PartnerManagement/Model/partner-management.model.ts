 
export interface PartnerDTO {
  RowId: number;
  PartnerName: string;
  ParentID: number;
  Note: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Code: string;
  IsLock: boolean;
  JoinDate: string;
  LockedNote: string;
  UnLockNote: string;
  NumberAccount: number;
  NumberCustomer: number;
}

export class PartnerModel {
  RowId: number;
  PartnerName: string;
  Code: string;
  JoinDate: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Username: string;
  Password: string;
  Note: string;
  ParentID: number;
  empty() {
    this.RowId = 0;
    this.PartnerName = '';
    this.Code = '';
    this.JoinDate = '';
    this.ContactName = '';
    this.ContactPhone = '';
    this.ContactEmail = '';
    this.Username = '';
    this.Note = '';
    this.Password = '';
    this.ParentID = -1;
  }

}

export interface PartnerFilterDTO {
  RowId: number;
  PartnerName: string;
}