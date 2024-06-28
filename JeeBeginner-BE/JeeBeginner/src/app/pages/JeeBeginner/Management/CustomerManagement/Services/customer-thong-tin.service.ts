import { CustomerAddDeletAppModel } from './../Model/customer-management.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { HttpUtilsService } from '../../../_core/utils/http-utils.service';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { environment } from '../../../../../../environments/environment';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { catchError, finalize, tap } from 'rxjs/operators';
import {
  AppCustomerDTO,
  AppListDTO,
  CustomerAppGiaHanModel,
  CustomerAppStatusModel,
  CustomerModel,
  CustomerResetPasswordModel,
} from '../Model/customer-management.model';
import { AccountStatusModel } from '../../AccountManagement/Model/account-management.model';

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
export class CustomerThongTinService {
  // Private fields
  private _items$ = new BehaviorSubject<AppCustomerDTO[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private _appCodes$ = new BehaviorSubject<AppListDTO[]>([]);
  private _tableAppCodeState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  // Getters
  get appCode$() {
    return this._appCodes$.asObservable();
  }
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  get tableAppCodeState$() {
    return this._tableAppCodeState$.asObservable();
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get paginatorAppList() {
    return this._tableAppCodeState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findData(this._tableState$.value)
      .pipe(
        tap((res: ResultModel<AppCustomerDTO>) => {
          if (res && res.status === 1) {
            this._items$.next(res.data);
            this._tableState$.value.paginator.total = res.panigator.TotalCount;
          } else {
            this._errorMessage.next(res.error.message);
            return of({
              items: [],
              total: 0,
            });
          }
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public fetchStateSort(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  private findData(tableState: ITableState): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/GetDS_InfoAppByCustomerID';
    return this.http
      .post<any>(url, tableState, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: [], total: 0 });
        })
      );
  }

  public getCustomer(CustomerID: number): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetCustomerByCustomerID?CustomerID=${CustomerID}`;
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: [], total: 0 });
        })
      );
  }

  createCustomer(item: CustomerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/CreateCustomer';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateStatus(item: CustomerAppStatusModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateStatus';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateCustomerAddDeletAppModel(item: CustomerAddDeletAppModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateCustomerAddDeletAppModel';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateCustomerAppGiaHanModel(item: CustomerAppGiaHanModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateCustomerAppGiaHanModel';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  public getInfoAppByCustomerID(CustomerID: number): Observable<ResultModel<AppCustomerDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetInfoAppByCustomerID?CustomerID=${CustomerID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public UpdateCustomerResetPasswordModel(item: CustomerResetPasswordModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateCustomerResetPassword';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  public UpdateLock(customerid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateLock/${customerid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  public UpdateUnLock(customerid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateUnLock/${customerid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
}
