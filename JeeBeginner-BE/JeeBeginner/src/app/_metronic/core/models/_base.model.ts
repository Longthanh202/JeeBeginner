import { IEdit } from 'src/app/pages/JeeBeginner/_core/models/interfaces/edit.interface';
import { IFilter } from 'src/app/pages/JeeBeginner/_core/models/interfaces/filter.interface';
import { ILog } from 'src/app/pages/JeeBeginner/_core/models/interfaces/log.interface';

export class BaseModel implements IEdit, IFilter, ILog {
  // Edit
  _isEditMode: boolean = false;
  _isNew: boolean = false;
  _isUpdated: boolean = false;
  _isDeleted: boolean = false;
  _prevState: any = null;
  // Filter
  _defaultFieldName: string = '';
  // Log
  _userId: number = 0; // Admin
  _createdDate: string;
  _updatedDate: string;
}

export interface ResultModel<T> {
  Visible?: boolean;
  data: T[];
  error: ErrorModel;
  panigator?: PageModel;
  status: number;
}

export interface ResultObjModel<T> {
  data: T;
  error?: ErrorModel;
  status?: number;
  panigator?: PageModel;
}
export interface ResultObjectModel<T> {
  data: T;
  error?: ErrorReturnModel;
  status?: number;
  panigator?: PageModel;
}

export interface ErrorModel {
  LastError: string;
  code: number;
  message: string;
}

export interface ErrorReturnModel {
  error: string;
  statusCode: number;
  message: string;
}

export interface PageModel {
  Page: number;
  AllPage: number;
  Size: number;
  TotalCount: number;
}
