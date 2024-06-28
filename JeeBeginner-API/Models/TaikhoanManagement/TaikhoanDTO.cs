namespace JeeBeginner.Models.TaikhoanManagement
{
    public class TaikhoanDTO
    {
        public long RowId { get; set; }
        public string PartnerName { get; set; }
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Mobile { get; set; }
        public string CreatedDate { get; set; }
        public string LastLogin { get; set; }
        public bool IsLock { get; set; }
    }
}
