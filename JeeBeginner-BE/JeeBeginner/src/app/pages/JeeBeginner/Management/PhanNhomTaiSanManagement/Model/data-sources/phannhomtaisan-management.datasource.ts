import { QueryResultsModel } from '../../../../_core/models/query-models/query-results.model';
import { QueryParamsModelNew } from '../../../../_core/models/query-models/query-params.model';
import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PhanNhomTaiSanManagementService } from '../../Services/phannhomtaisan-management.service';
import { BaseDataSource } from 'src/app/pages/JeeBeginner/_core/models/data-sources/_base.datasource';

export class PhanNhomTaiSanManagementDataSource extends BaseDataSource {
  constructor(private phannhomtaisanManagementServe: PhanNhomTaiSanManagementService) {
    super();
  }

  // LoadList(queryParams: QueryParamsModelNew) {
  //   this.accountManagementServe.lastFilter$.next(queryParams);
  //   this.loadingSubject.next(true);
  //   this.accountManagementServe
  //     .findData(queryParams)
  //     .pipe(
  //       tap((resultFromServer) => {
  //         this.entitySubject.next(resultFromServer.data);
  //         var totalCount = resultFromServer.page.TotalCount || resultFromServer.page.AllPage * resultFromServer.page.Size;
  //         this.paginatorTotalSubject.next(totalCount);
  //       }),
  //       catchError((err) => of(new QueryResultsModel([], err))),
  //       finalize(() => this.loadingSubject.next(false))
  //     )
  //     .subscribe((res) => {});
  // }
}
