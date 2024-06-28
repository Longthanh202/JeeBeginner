export class showSearchFormModel {
  username: boolean;
  isAdmin: boolean;
  dakhoa: boolean;
  titlekeyword: string;
  constructor() {
    this.username = true;
    this.isAdmin = true;
    this.dakhoa = true;
    this.titlekeyword = 'SEARCH.SEARCH1';
  }
}

export interface SelectModel {
  RowID: number;
  Title: string;
}
