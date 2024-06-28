export class AuthSSO {
  user: any;
  access_token: string;
  refresh_token: string;

  setAuthSSO(auth: any) {
    this.user = auth.user;
    this.access_token = auth.access_token;
    this.refresh_token = auth.refresh_token;
  }
}
