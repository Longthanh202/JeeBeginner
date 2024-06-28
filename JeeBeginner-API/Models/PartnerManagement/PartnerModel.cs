namespace JeeBeginner.Models.PartnerManagement
{
    public class PartnerModel
    {
        public int RowId { get; set; }
        public string PartnerName { get; set; }
        public long ParentID { get; set; }
        public string Note { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public string Code { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string JoinDate { get; set; }
    }
}