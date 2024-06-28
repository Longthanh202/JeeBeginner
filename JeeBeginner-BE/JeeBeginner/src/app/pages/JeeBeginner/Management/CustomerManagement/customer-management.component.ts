import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
