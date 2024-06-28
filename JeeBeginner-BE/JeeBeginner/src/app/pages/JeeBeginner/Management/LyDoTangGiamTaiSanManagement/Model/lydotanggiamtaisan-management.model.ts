
import { BaseModel } from "../../../_core/models/_base.model"

export class LyDoTangGiamTaiSanModel extends BaseModel {
    IdRow: number
    LoaiTangGiam: number
    TenTangGiam: string
    MaTangGiam: string

    TrangThai: boolean
        IdCustomer: number
        clear() {
                this.IdRow = 0;
                this.TenTangGiam = '';
                this.LoaiTangGiam=0;
                this.MaTangGiam = '';
                this.TrangThai = false;
        }
        copy(item: LyDoTangGiamTaiSanModel) {
				this.IdRow = item.IdRow;
                this.LoaiTangGiam = item.LoaiTangGiam;
				this.TenTangGiam = item.TenTangGiam;
                this.MaTangGiam = item.MaTangGiam;
                this.TrangThai = item.TrangThai;
        }
        empty() {
            this.IdRow = 0;
            this.LoaiTangGiam=0;
            this.TenTangGiam = '';
            this.MaTangGiam = '';
            this.TrangThai = false;
            }
}