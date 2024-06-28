
import { BaseModel } from "../../../_core/models/_base.model"

export class PhanNhomTaiSanModel extends BaseModel {
    IdPNTS: number
    TenNhom: string
    MaNhom: string

    TrangThai: boolean
        IdCustomer: number
        clear() {
                this.IdPNTS = 0;
                this.TenNhom = '';
                this.MaNhom = '';
                this.TrangThai = false;
        }
        copy(item: PhanNhomTaiSanModel) {
				this.IdPNTS = item.IdPNTS;
				this.TenNhom = item.TenNhom;
                this.MaNhom = item.MaNhom;
                this.TrangThai = item.TrangThai;
        }
        empty() {
            this.IdPNTS = 0;
            this.TenNhom = '';
            this.MaNhom = '';
            this.TrangThai = false;
            }
}