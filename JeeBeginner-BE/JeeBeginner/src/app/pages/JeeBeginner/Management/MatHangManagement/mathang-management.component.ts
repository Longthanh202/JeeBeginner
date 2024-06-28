import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taikhoan-management',
  templateUrl: './mathang-management.component.html',
  styleUrls: ['./mathang-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatHangManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
