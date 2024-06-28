namespace JeeBeginner.Models.MatHangManagement
{
    public class MatHangModel
    {
        public long IdMH { get; set; }
        public string? MaHang { get; set; }
        public string? TenMatHang { get; set; }
        public long? IdLMH { get; set; }
        public long? IdDVT { get; set; }
        public string? Mota { get; set; }
        public float? GiaMua { get; set; }
        public float? GiaBan { get; set; }
        public bool IsDel { get; set; }
        public float? VAT { get; set; }
        public string? Barcode { get; set; }
        public bool? NgungKinhDoanh { get; set; }
        public long? IdDVTCap2 { get; set; }
        public float? QuyDoiDVTCap2 { get; set; }
        public long? IdDVTCap3 { get; set; }
        public float? QuyDoiDVTCap3 { get; set; }
        public string? TenOnSite { get; set; }
        public long? IdNhanHieu { get; set; }
        public long? IdXuatXu { get; set; }
        public string? ChiTietMoTa { get; set; }
        public string? MaPhu { get; set; }
        public string? ThongSo { get; set; }
        public bool?  TheoDoiTonKho { get; set; }
        public bool? TheodoiLo { get; set; }
        public long? MaLuuKho { get; set; }
        public string? MaViTriKho { get; set; }
        public long? SoKyTinhKhauHaoToiThieu { get; set; }
        public long? SoKyTinhKhauHaoToiDa { get; set; }
        public string? TenXuatXu { get; set; }
        public string? TenNhanHieu { get; set; }
        public string? TenLMH { get; set; }
        public string? TenDVT { get; set; }
        public string? TenDVTCap2 { get; set; }
        public string? TenDVTCap3 { get; set; }
        public string? TenK { get; set; }
        public string? HinhAnh { get; set; }
        public bool? IsTaiSan { get; set; }
        public long? UpperLimit { get; set; }
        public long? LowerLimit { get; set; }
        public long? SoNamDeNghi { get; set; }
        public float? TiLeHaoMon { get; set; }
    }
}
