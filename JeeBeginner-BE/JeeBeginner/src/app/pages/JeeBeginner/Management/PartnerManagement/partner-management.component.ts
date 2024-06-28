import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner-management',
  templateUrl: './partner-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
