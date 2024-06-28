import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nhanhieumanagement',
  templateUrl: './nhanhieu-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NhanHieuManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
