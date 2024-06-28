import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { QueryParamsModel } from '../../../pages/JeeBeginner/_core/models/query-models/query-params.model';
import { HttpUtilsService } from '../../../pages/JeeBeginner/_core/utils/http-utils.service';
import { QueryResultsModel } from '../../../pages/JeeBeginner/_core/models/query-models/query-results.model';

@Injectable()
export class MenuServices {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
  ReadOnlyControl: boolean;
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  layMenuChucNang(): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.ApiRoot + `/menu/LayMenuChucNang`, { headers: httpHeaders });
  }
}
