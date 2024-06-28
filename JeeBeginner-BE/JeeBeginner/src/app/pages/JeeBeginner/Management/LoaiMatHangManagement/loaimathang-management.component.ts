import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taikhoan-management',
  templateUrl: './loaimathang-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaiMatHangManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
