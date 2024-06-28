namespace JeeBeginner.Models.UserModel
{
    public class UserModel
    {
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public bool IsLock { get; set; }
        public bool IsMasterAccount { get; set; }
    }
}