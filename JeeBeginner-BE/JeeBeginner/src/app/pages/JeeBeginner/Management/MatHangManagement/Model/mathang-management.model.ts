
import { BaseModel } from "../../../_core/models/_base.model"

export class MatHangModel extends BaseModel {
        IdMH: number
        MaHang: string
        TenMatHang: string
        IdLMH: number
        IdDVT: number
        Mota: string
        GiaMua: number
        GiaBan: number
        VAT: number
        Barcode: string
        NgungKinhDoanh: boolean
        IdDVTCap2: number
        QuyDoiDVTCap2: number
        IdDVTCap3: number
        QuyDoiDVTCap3: number
        TenOnSite: string
        IdNhanHieu: number
        IdXuatXu: number
        ChiTietMoTa: string
        MaPhu: string
        ThongSo: string
        TheoDoiTonKho: boolean
        TheodoiLo: boolean
        MaLuuKho: number
        MaViTriKho: string
        domain: string
        HinhAnh: string
        listLinkImage: ListImageModel[]
        lstImg: ListImageModel[]
        UpperLimit: number
        LowerLimit: number
        isError: boolean
        Message: string
        IsTaiSan: boolean
        SoKyTinhKhauHaoToiThieu: number
        SoKyTinhKhauHaoToiDa: number

        SoNamDeNghi: number
        TiLeHaoMon: number
        empty() {
                this.IdMH = 0;
                this.MaHang = '';
                this.TenMatHang = '';
                this.IdLMH = 0;
                this.IdDVT = 0;
                this.Mota = '';
                this.GiaMua = 0;
                this.GiaBan = 0;
                this.VAT = 0;
                this.Barcode = '';
                this.NgungKinhDoanh = false;
                this.IdDVTCap2 = 0;
                this.QuyDoiDVTCap2 = 0;
                this.IdDVTCap3 = 0;
                this.QuyDoiDVTCap3 = 0;
                this.TenOnSite = '';
                this.IdNhanHieu = 0;
                this.IdXuatXu = 0;
                this.ChiTietMoTa = '';
                this.MaPhu = '';
                this.ThongSo = '';
                this.TheoDoiTonKho = true;
                this.TheodoiLo = true;
                this.MaLuuKho = 0;
                this.MaViTriKho = '';
                this.domain = '';
                this.HinhAnh = "";
                this.UpperLimit = 0;
                this.LowerLimit = 0;
                this.Message = '';
                this.isError = false;
                this.IsTaiSan = false;
                this.listLinkImage = [];
                this.lstImg = [];
                this.SoKyTinhKhauHaoToiThieu = 0;
                this.SoKyTinhKhauHaoToiDa = 0;

                this.SoNamDeNghi = 0;
                this.TiLeHaoMon = 0;
        }
        copy(item: MatHangModel) {
                this.IdMH = item.IdMH;
                this.MaHang = item.MaHang;
                this.TenMatHang = item.TenMatHang;
                this.IdLMH = item.IdLMH;
                this.IdDVT = item.IdDVT;
                this.Mota = item.Mota;
                this.GiaMua = item.GiaMua;
                this.GiaBan = item.GiaBan;
                this.VAT = item.VAT;
                this.Barcode = item.Barcode;
                this.NgungKinhDoanh = item.NgungKinhDoanh;
                this.IdDVTCap2 = item.IdDVTCap2;
                this.QuyDoiDVTCap2 = item.QuyDoiDVTCap2;
                this.IdDVTCap3 = item.IdDVTCap3;
                this.QuyDoiDVTCap3 = item.QuyDoiDVTCap3;
                this.TenOnSite = item.TenOnSite;
                this.IdNhanHieu = item.IdNhanHieu;
                this.IdXuatXu = item.IdXuatXu;
                this.ChiTietMoTa = item.ChiTietMoTa;
                this.MaPhu = item.MaPhu;
                this.ThongSo = item.ThongSo;
                this.TheoDoiTonKho = item.TheoDoiTonKho;
                this.TheodoiLo = item.TheodoiLo;
                this.MaLuuKho = item.MaLuuKho;
                this.MaViTriKho = item.MaViTriKho;
                this.domain = item.domain;
                this.HinhAnh = item.HinhAnh;
                this.UpperLimit = item.UpperLimit;
                this.LowerLimit = item.LowerLimit;
                this.isError = item.isError;
                this.Message = item.Message;
                this.IsTaiSan = item.IsTaiSan;
                this.listLinkImage = item.listLinkImage;
                this.lstImg = item.lstImg;
                this.SoKyTinhKhauHaoToiThieu = item.SoKyTinhKhauHaoToiThieu;
                this.SoKyTinhKhauHaoToiDa = item.SoKyTinhKhauHaoToiDa;

                this.SoNamDeNghi = item.SoNamDeNghi;
                this.TiLeHaoMon = item.TiLeHaoMon;
        }
}

export class ListImageModel {
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
