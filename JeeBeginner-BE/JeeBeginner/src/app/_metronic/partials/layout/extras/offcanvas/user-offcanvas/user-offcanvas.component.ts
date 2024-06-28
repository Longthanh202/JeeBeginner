import { LayoutUtilsService } from './../../../../../../pages/JeeBeginner/_core/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable, of } from 'rxjs';
import { User, UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
import { ChangePasswordEditDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { MessageType } from 'src/app/pages/JeeBeginner/_core/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<User>;

  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    public translate: TranslateService,
    public dialog: MatDialog,
    public layoutUtilsService: LayoutUtilsService
  ) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp('extras.user.offcanvas.direction')}`;
    this.user$ = this.auth.getAuthFromLocalStorage();
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  doimatkhau() {
    const username = this.auth.getAuthFromLocalStorage()['user']['username'];
    let saveMessage = 'Đổi mật khẩu thành công';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(ChangePasswordEditDialogComponent, {
      data: { username: username },
      panelClass: ['mat-dialog-popup', 'with40'],
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.logout();
      }
    });
  }
}
