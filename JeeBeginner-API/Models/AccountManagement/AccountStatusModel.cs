namespace JeeBeginner.Models.AccountManagement
{
    public class AccountStatusModel
    {
        public long RowID { get; set; }
        public bool IsLock { get; set; }
        public string Note { get; set; }
    }
}