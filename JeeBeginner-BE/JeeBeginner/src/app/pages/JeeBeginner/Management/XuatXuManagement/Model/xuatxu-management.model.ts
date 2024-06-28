// export class LoaiMatHangModels {
//   IdLMH?: number;
//   MaLMH?: string;
//   TenLMH?: string;
//   IdCustomer?: number;
//   IdLMHParent?: number;
//   ParentName?: string;
//   MoTa?: string;
//   HinhAnh?: string;
//   isDel?: boolean;
//   DoUuTien?: number;
//   CreateBy?: number;
//   DeleteBy?: number;
//   ModifiedBy?: number;
//   CreatedDate?: string;
//   DeleteDate?: string;
//   ModifiedDate?: string;
//   IdKho?: number;

//   empty() {
//     this.IdLMH = 0;
//     this.MaLMH = "";
//     this.TenLMH = "";
//     this.IdCustomer = 1;
//     this.IdLMHParent = 0;
//     this.ParentName = "";
//     this.MoTa = "";
//     this.HinhAnh = "";
//     this.isDel = false;
//     this.DoUuTien = 0;
//     this.CreateBy = 0;
//     this.DeleteBy = 0;
//     this.ModifiedBy = 0;
//     this.CreatedDate = "";
//     this.DeleteDate = "";
//     this.ModifiedDate = "";
//     this.IdKho = 0;
//   }
// }

// export class LoaiMatHangDeleteModel {
//   IdLMH: number;
//   isDel: boolean;
//   DeleteDate: string;

//   empty() {
//     this.IdLMH = 0;
//     this.isDel = false;
//     this.DeleteDate = "";
//   }
// }
import { BaseModel } from "../../../_core/models/_base.model"

export class XuatXuModel extends BaseModel {
    IdXuatXu: number
    TenXuatXu: string
    isDel: boolean
        IdCustomer: number
        clear() {
                this.IdXuatXu = 0;
                this.TenXuatXu = '';
                this.isDel = true;
                this.IdCustomer = 0;
        }
        copy(item: XuatXuModel) {
				this.IdXuatXu = item.IdXuatXu;
				this.TenXuatXu = item.TenXuatXu;
                this.isDel = item.isDel;
                this.IdCustomer = item.IdCustomer;
        }
        empty() {
            this.IdXuatXu = 0;
            this.TenXuatXu = '';
            this.isDel = true;
            this.IdCustomer = 0;
            }
}