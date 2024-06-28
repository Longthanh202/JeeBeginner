namespace JeeBeginner.Models.AccountRoleManagement
{
    public class AccountRole
    {
       
        public string Username { get; set; }
        public long Id_Permit { get; set; }
        public string Tenquyen { get; set; }
        public bool Edit { get; set; }
        public long Id_chucnang { get; set; }
        public bool Edit1 { get; set; }
        public bool Edit2 { get; set; }
        public bool IsReadPermit { get; set; }
        public long ID_NhomChucNang { get; set; }
    }
}
