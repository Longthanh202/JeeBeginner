import { HttpUtilsService } from './../utils/http-utils.service';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChangePasswordModel } from '../models/danhmuc.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_PRODUCT_URL = environment.ApiRoot;

@Injectable()
export class GeneralService {
  constructor(public datepipe: DatePipe, private httpUtils: HttpUtilsService, private http: HttpClient) {}

  sortObject(obj) {
    return Object.keys(obj)
      .sort()
      .reduce(function (result, key) {
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

  public changePassword(model: ChangePasswordModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCT_URL + `/authorization/changePassword`;
    return this.http.post(url, model, { headers: httpHeaders });
  }
}
