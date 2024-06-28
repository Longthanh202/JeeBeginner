namespace JeeBeginner.Models.LoaiMatHangManagement
{
    public class LoaiMatHangModel
    {
        public long IdLMH { get; set; }
        public string MaLMH { get; set; }
        public string TenLMH { get; set; }
        public long IdCustomer { get; set; }
        public long IdLMHParent { get; set; }
        public string TenLMHParent { get; set; }
        public string Mota { get; set; }
        public string HinhAnh { get; set; }
        public long DoUuTien { get; set; }
        public bool IsDel { get; set; }
        public string TenK { get; set; }
        public long IdKho { get; set; }
    }
}
