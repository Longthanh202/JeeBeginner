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

export class DoiTacBaoHiemModel extends BaseModel {
    Id_DV: number
    TenDonVi: string
    DiaChi: string
    SoDT: string
    NguoiLienHe: string
    GhiChu: string
    IsDisable: boolean
        IdCustomer: number
        clear() {
                this.Id_DV = 0;
                this.TenDonVi = '';
                this.DiaChi = '';
                this.SoDT = '';
                this.NguoiLienHe = '';
                this.GhiChu = '';
                this.IsDisable = true;
        }
        copy(item: DoiTacBaoHiemModel) {
				this.Id_DV = item.Id_DV;
				this.TenDonVi = item.TenDonVi;
                this.DiaChi = item.DiaChi;
                this.SoDT = item.SoDT;
                this.NguoiLienHe = item.NguoiLienHe;
                this.GhiChu = item.GhiChu;
                this.IsDisable = item.IsDisable;
        }
        empty() {
            this.Id_DV = 0;
            this.TenDonVi = '';
            this.DiaChi = '';
            this.SoDT = '';
            this.NguoiLienHe = '';
            this.GhiChu = '';
            this.IsDisable = true;
            this.IdCustomer=0;
            }
}