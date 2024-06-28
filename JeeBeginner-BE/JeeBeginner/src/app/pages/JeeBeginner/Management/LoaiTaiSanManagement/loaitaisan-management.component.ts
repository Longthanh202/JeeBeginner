import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loaitaisanmanagement',
  templateUrl: './loaitaisan-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaiTaiSanManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
