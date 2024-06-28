namespace JeeBeginner.Models.PartnerManagement
{
    public class PartnerDTO
    {
        public int RowId { get; set; }
        public string PartnerName { get; set; }
        public long ParentID { get; set; }
        public string Note { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public string Code { get; set; }
        public bool IsLock { get; set; }
        public string JoinDate { get; set; }
        public string LockedNote { get; set; }
        public string UnLockNote { get; set; }
        public int NumberAccount { get; set; }
        public int NumberCustomer { get; set; }
    }
}