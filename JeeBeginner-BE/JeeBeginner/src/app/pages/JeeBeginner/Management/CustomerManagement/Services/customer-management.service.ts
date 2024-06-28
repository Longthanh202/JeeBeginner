import { Pakage } from './../Model/customer-management.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, OnDestroy } from '@angular/core';

import { HttpUtilsService } from '../../../_core/utils/http-utils.service';
import { ResultModel } from '../../../_core/models/_base.model';
import { environment } from '../../../../../../environments/environment';
import { GroupingState, ITableState, PaginatorState, SortState, TableService } from 'src/app/_metronic/shared/crud-table';

import {
  AppListDTO,
  CustomerAppAddNumberStaffModel,
  CustomerAppDTO,
  CustomerModel,
  CustomerModelDTO,
} from '../Model/customer-management.model';
import { ITableService } from 'src/app/_metronic/core/services/itable.service';

const API_PRODUCTS_URL = environment.ApiRoot + '/customermanagement';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable()
export class CustomerManagementService extends ITableService<CustomerModelDTO[]> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_EDIT: string = API_PRODUCTS_URL + '/Get_DSCustomer';
  API_URL_DELETE: string = API_PRODUCTS_URL + '/Get_DSCustomer';

  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public getListApp(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListApp`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public getPakageList(): Observable<Pakage[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetPakageListApp`;
    return this.http.get<Pakage[]>(url, {
      headers: httpHeaders,
    });
  }

  public getListAppFromJeeAccount(CustomerID: number): Observable<ResultModel<CustomerAppDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListAppFromJeeAccount?CustomerID=${CustomerID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  createCustomer(item: CustomerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/CreateCustomer';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  importCustomer(item: CustomerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/ImportCustomer';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  updateCustomerAppAddNumberStaff(item: CustomerAppAddNumberStaffModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateCustomerAppAddNumberStaff';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  getDateFilterCustomer(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/DateFilter`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }
}
