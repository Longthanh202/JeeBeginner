import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

import { QueryParamsModelNew } from '../../../_core/models/query-models/query-params.model';
import { ResultModel, ResultObjModel } from '../../../_core/models/_base.model';
import { environment } from '../../../../../../environments/environment';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { catchError, finalize, tap } from 'rxjs/operators';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { AccountRoleDTO, AccountRoleModel, AccountRole, AccountRoleStatusModel } from '../Model/accountrole-management.model';
import { HttpUtilsService } from '../../../_core/utils/http-utils.service';

const API_PRODUCTS_URL = environment.ApiRoot + '/accountrolemanagement';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable()
export class AccountRoleManagementService {
  // Private fields
  private _items$ = new BehaviorSubject<AccountRoleDTO[]>([]);
  private _items2$ = new BehaviorSubject<AccountRole[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private _tableAppCodeState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  public Visible: boolean;
  public Visible2: boolean;
  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get items2$() {
    return this._items2$.asObservable();
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

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findData(this._tableState$.value)
      .pipe(
        tap((res: ResultModel<AccountRoleDTO>) => {
          if (res && res.status === 1) {
            this.Visible = res.Visible;
            this._items$.next(res.data);
            this._tableState$.value.paginator.total = res.panigator.TotalCount;
          } else {
            this._errorMessage.next(res.error.message);
            return of({
              items: [],
              total: 0
            });
          }
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      ).subscribe();
    this._subscriptions.push(request);
  }
  public fetchRole() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findDataRole(this._tableState$.value)
      .pipe(
        tap((res: ResultModel<AccountRole>) => {
          if (res && res.status === 1) {
            this._items2$.next(res.data);
            // this._tableState$.value.paginator.total = res.panigator.TotalCount;
          } else {
            this._errorMessage.next(res.error.message);
            return of({
              items2: [],
              total: 0
            });
          }
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      ).subscribe();
    this._subscriptions.push(request);
  }
  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
    // đổi tên thành fetch thì chạy các chức năng còn lại bth
  }

  public fetchStateSort(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetchRole();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  private findData(tableState: ITableState): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Get_DS';
    return this.http.post<any>(url, tableState, {
      headers: httpHeaders,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );
  }
  private findDataRole(tableState: ITableState): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/GetRoleUsername';
    return this.http.post<any>(url, tableState, {
      headers: httpHeaders,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items2: [], total: 0 });
      })
    );
  }
  createAccount(item: AccountRoleModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/createAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  updateAccount(item: AccountRoleModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/updateAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateStatusAccount(item: AccountRoleStatusModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateStatusAccount';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateInsertEditRole(item: AccountRole): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/UpdateEditRole';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  getAccountModelByRowID(RowID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetAccountByRowID?RowID=${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  getRoleByUsername(Username: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetRoleUsername?Username=${Username}`;
    return this.http.post<any>(url, { headers: httpHeaders });
  }
  getRoleById(Username: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetRoleById?Username=${Username}`;
    return this.http.post<any>(url, { headers: httpHeaders });
  }
  IsReadOnlyPermitAccountRole(roleName: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/IsReadOnlyPermitAccountRole?roleName=${roleName}`;
    return this.http.post<any>(url, { headers: httpHeaders });
  }
  Save_QuyenNguoiDung(item: AccountRole[]): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Save_QuyenNguoiDung`;
    return this.http.post<any>(url,item,{ headers: httpHeaders });
  }
  // Save_QuyenNguoiDung(usernames: AccountRole[]): Observable<any> {
  //   const httpHeaders = this.httpUtils.getHTTPHeaders();
  //   const serializedUsernames = usernames.join(','); // Chuyển đổi mảng thành một chuỗi phân tách bằng dấu phẩy
  //   const url = `${API_PRODUCTS_URL}/Save_QuyenNguoiDung?arr_data=${encodeURIComponent(serializedUsernames)}`;
  //   return this.http.post<any>(url, {}, { headers: httpHeaders });
  // }
  public getRole(Username: string): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetRoleUsername?Username=${Username}`;
    
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: []});
        })
      );
  }


  getNoteLock(RowID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetNoteLock?RowID=${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getPartnerFilters(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetFilterPartner`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  Save_Quyen(item: AccountRole[]): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Save_Quyen`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
}
