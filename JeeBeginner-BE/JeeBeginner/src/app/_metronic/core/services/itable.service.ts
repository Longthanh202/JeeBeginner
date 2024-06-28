import { ResultObjectModel } from './../models/_base.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseModel, GroupingState, ITableState, PaginatorState, SortState, TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { HttpUtilsService } from 'src/app/pages/JeeBeginner/_core/utils/http-utils.service';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

export abstract class ITableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T>(undefined);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
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
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
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

  protected http: HttpClient;
  protected httpUtils: HttpUtilsService;
  // API URL has to be overrided
  abstract API_URL_FIND: string;
  abstract API_URL_CTEATE: string;
  abstract API_URL_EDIT: string;
  abstract API_URL_DELETE: string;
  constructor(http: HttpClient, httpUtils: HttpUtilsService) {
    this.http = http;
    this.httpUtils = httpUtils;
  }

  create(item: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<any>(this.API_URL_CTEATE, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  find(tableState: ITableState): Observable<ResultObjectModel<T>> {
    const url = this.API_URL_FIND;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    this._errorMessage.next('');
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
        params: httpParams,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: [], total: 0 });
        })
      );
  }

  getItemById(id: number): Observable<any> {
    this._isLoading$.next(true);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    const url = `${this.API_URL_FIND}/${id}`;
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
  }

  update(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = this.API_URL_EDIT;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http
      .post(url, item, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of(item);
        }),
        finalize(() => this._isLoading$.next(false))
      );
  }

  delete(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL_DELETE;
    return this.http.post(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: ResultObjectModel<T>) => {
          this._items$.next(res.data);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(res.panigator.TotalCount),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState(),
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }
}
