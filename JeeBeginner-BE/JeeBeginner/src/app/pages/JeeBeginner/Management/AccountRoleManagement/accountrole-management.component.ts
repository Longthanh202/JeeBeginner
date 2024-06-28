import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accountrole-management',
  templateUrl: './accountrole-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRoleManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
