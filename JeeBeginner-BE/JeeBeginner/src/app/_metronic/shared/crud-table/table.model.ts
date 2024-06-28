import { GroupingState } from './grouping.model';
import { PaginatorState } from './paginator.model';
import { SortState } from './sort.model';

export interface ITableState {
  filter: {};
  paginator: PaginatorState;
  sorting: SortState;
  searchTerm: string;
  grouping: GroupingState;
  entityId: number | undefined;
}

export interface TableResponseModel<T> {
  items: T[];
  total: number;
}

export interface ICreateAction {
  create(): void;
}

export interface IEditAction {
  edit(id: number): void;
}

export interface IDeleteAction {
  delete(id: number): void;
}

export interface IDeleteSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  deleteSelected(): void;
}

export interface IFetchSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  fetchSelected(): void;
}

export interface IUpdateStatusForSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  updateStatusForSelected(): void;
}

export interface ht_Panigator{
  //total items
  total: number;
  totalpage: number;//total page
  page: number;//page index
  pageSize: number;//page size, row per page
}

export interface ht_ErrorModel{
  code: number;
  msg: string;
}

export interface TableResponseModel_LandingPage<T> {
  status: number;
  data: T[];
  panigator: ht_Panigator;
  error: ht_ErrorModel;
}

export interface ht_BaseModel<T> {
  status: number;
  data: T[];
  panigator: ht_Panigator;
  error: ht_ErrorModel;
}

export interface ht_BaseModel_Single<T> {
  status: number;
  data: T;
  panigator: ht_Panigator;
  error: ht_ErrorModel;
}
