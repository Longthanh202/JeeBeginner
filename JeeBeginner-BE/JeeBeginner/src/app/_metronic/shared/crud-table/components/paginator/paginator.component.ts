import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { PageSizes, PaginatorState } from '../../models/paginator.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() paginator: PaginatorState;
  @Input() isLoading;
  @Output() paginate: EventEmitter<PaginatorState> = new EventEmitter();
  pageSizes: number[] = PageSizes;
  sodonghientai: number = 1;
  sodongcuoitrang: number = 1;
  constructor(
    public translate: TranslateService,
    public translationService: TranslationService,

  ) {

  }

  ngOnInit(): void {
    this.sodonghientai = this.sodongcuoitrang = 0;
    this.paginator.pageSize = +this.paginator.pageSize;
    this.paginator.page = 1;
    this.paginate.emit(this.paginator);
    if (this.paginator.page > 1)
      this.sodonghientai = this.paginator.pageSize * (this.paginator.page - 1) + 1;
    else
      this.sodonghientai = 1;
    this.sodongcuoitrang = (this.sodonghientai - 1) + this.paginator.pageSize;
    if (this.sodongcuoitrang > this.paginator.total)
      this.sodongcuoitrang = this.paginator.total;
      this.sodongcuoitrang = this.paginator.pageSize;
  }
  pageChange(num: number) {
    this.sodonghientai = this.sodongcuoitrang = 0;
    this.paginator.page = num;
    this.paginate.emit(this.paginator);
    if (this.paginator.page > 1)
      this.sodonghientai = this.paginator.pageSize * (this.paginator.page - 1) + 1;
    else
      this.sodonghientai = 1;
    this.sodongcuoitrang = (this.sodonghientai - 1) + this.paginator.pageSize;
    if (this.sodongcuoitrang > this.paginator.total)
      this.sodongcuoitrang = this.paginator.total;
  }

  sizeChange() {
    this.sodonghientai = this.sodongcuoitrang = 0;
    this.paginator.pageSize = +this.paginator.pageSize;
    this.paginator.page = 1;
    this.paginate.emit(this.paginator);
    if (this.paginator.page > 1)
      this.sodonghientai = this.paginator.pageSize * (this.paginator.page - 1) + 1;
    else
      this.sodonghientai = 1;
    this.sodongcuoitrang = (this.sodonghientai - 1) + this.paginator.pageSize;
    if (this.sodongcuoitrang > this.paginator.total)
      this.sodongcuoitrang = this.paginator.total;
  }
}
