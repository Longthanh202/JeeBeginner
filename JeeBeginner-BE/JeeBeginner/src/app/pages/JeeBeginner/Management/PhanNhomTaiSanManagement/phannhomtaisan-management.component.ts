import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phannhomtaisanmanagement',
  templateUrl: './phannhomtaisan-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhanNhomTaiSanManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
