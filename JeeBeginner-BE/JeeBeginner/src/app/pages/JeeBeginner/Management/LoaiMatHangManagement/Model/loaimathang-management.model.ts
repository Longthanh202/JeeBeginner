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

export class LoaiMatHangModel extends BaseModel {
        IdLMH: number
        TenLMH: string
        Mota: string
        DoUuTien: number
        IdLMHParent: number
        TenLMHParent:string
        domain: string
        HinhAnh: string
        IdKho: number
        MaLMH: string
        listLinkImage: ListImageModel[]
        clear() {
                this.IdLMH = 0;
                this.TenLMH = '';
                this.Mota = '';
                this.DoUuTien = 0;
                this.domain = '';
                this.HinhAnh = "";
				this.IdLMHParent = 0;
				this.IdKho = 0;
                this.MaLMH = '';
        }
        copy(item: LoaiMatHangModel) {
				this.IdLMH = item.IdLMH;
				this.IdKho = item.IdKho;
                this.TenLMH = item.TenLMH;
                this.Mota = item.Mota;
                this.DoUuTien = item.DoUuTien;
                this.domain = item.domain;
                this.HinhAnh = item.HinhAnh;
                this.IdLMHParent = item.IdLMHParent;
                this.MaLMH = item.MaLMH;
        }
        empty() {
              this.IdLMH = 0;
              this.MaLMH = "";
              this.TenLMH = "";
            
              this.IdLMHParent = 0;
             this.TenLMHParent="";
              this.HinhAnh = "";
            
              this.DoUuTien = 0;
            
              this.IdKho = 0;
            }
}
export class ListImageModel  {
        strBase64: string;
        filename: string;
        src: string;
        IsAdd: boolean;
        IsDel: boolean;

        clear() {
            this.strBase64 = '';
            this.filename = '';
            this.src = '';
            this.IsAdd = true;
            this.IsDel = false;
        }
    }