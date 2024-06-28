import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taikhoan-management',
  templateUrl: './taikhoan-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaikhoanManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
