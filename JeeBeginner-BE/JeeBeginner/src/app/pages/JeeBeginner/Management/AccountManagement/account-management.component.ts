import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
