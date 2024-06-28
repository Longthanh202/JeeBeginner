import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/http-utils.service';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';

const API_URL = environment.ApiRoot;
const API_PRODUCTS_URL = environment.ApiRoot + '/dashboard';
const API_URL_GENERAL = environment.ApiRoot + '/general';
@Injectable()
export class DanhMucChungService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, public datepipe: DatePipe) { }

  GetListWidgets(module: string): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/api/widgets/get-list-widgets?module=${module}`, {
      headers: httpHeaders,
    });
  }

  //=================Dùng trong trang truy cập nhanh============================================
  Insert_TruyCapNhanh(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_PRODUCTS_URL + '/Insert_TruyCapNhanh', item, { headers: httpHeaders });
  }
  Check_TruyCapNhanh(id: number, type: string = 'sub'): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_PRODUCTS_URL}/Check_TruyCapNhanh?id=${id}&type=${type}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  Delete_TruyCapNhanh(id: string, type: string = 'sub'): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_PRODUCTS_URL}/Delete_TruyCapNhanh?id=${id}&type=${type}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  // =================END============================================

  // =================ALL============================================
  GetMatchipNhanVien(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_URL_GENERAL}/GetMatchipNhanVien`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  GetSelectionDepartment(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_URL_GENERAL}/GetSelectionDepartMent`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  // =================END============================================
  // ========================= Hàm dùng chung =======================
  sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }

  isEqual(object, otherObject) {
    return Object.entries(this.sortObject(object)).toString() === Object.entries(this.sortObject(otherObject)).toString();
  }

  f_number(value: any) {
    return Number((value + '').replace(/,/g, ''));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + '').replace(/,|-/g, ''));
    return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  f_string_date(value: string): Date {
    return new Date(value.split('/')[2] + '-' + value.split('/')[1] + '-' + value.split('/')[0]);
  }
  // ========================= END ==================================
}
