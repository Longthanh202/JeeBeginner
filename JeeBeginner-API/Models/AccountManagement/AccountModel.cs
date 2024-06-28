namespace JeeBeginner.Models.AccountManagement
{
    public class AccountModel
    {
        public long RowId { get; set; }
        public long PartnerId { get; set; }
        public string Gender { get; set; }
        public string Fullname { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Note { get; set; }
    }
}