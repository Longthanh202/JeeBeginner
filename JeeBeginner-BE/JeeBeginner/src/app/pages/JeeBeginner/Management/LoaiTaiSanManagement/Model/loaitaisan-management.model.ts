
import { BaseModel } from "../../../_core/models/_base.model"

export class LoaiTaiSanModel extends BaseModel {
    IdLoaiTS: number
    TenLoai: string
    MaLoai: string

    TrangThai: boolean
        IdCustomer: number
        clear() {
                this.IdLoaiTS = 0;
                this.TenLoai = '';
                this.MaLoai = '';
                this.TrangThai = true;
        }
        copy(item: LoaiTaiSanModel) {
				this.IdLoaiTS = item.IdLoaiTS;
				this.TenLoai = item.TenLoai;
                this.MaLoai = item.MaLoai;
                this.TrangThai = item.TrangThai;
        }
        empty() {
            this.IdLoaiTS = 0;
            this.TenLoai = '';
            this.MaLoai = '';
            this.TrangThai = true;
            }
}