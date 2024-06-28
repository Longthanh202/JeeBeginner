using System.Collections.Generic;

namespace JeeAccount.Models.CustomerManagement
{
    public class CustomerModel
    {
        public int RowID { get; set; }
        public string Code { get; set; }
        public string CompanyName { get; set; }
        public string RegisterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string RegisterDate { get; set; }
        public string Note { get; set; }
        public string Gender { get; set; }
        public string LinhVuc { get; set; }
        public string DeadlineDate { get; set; }
        public string Email { get; set; }
        public List<int> AppID { get; set; }
        public List<int> CurrentDBID { get; set; }
        public List<int> SoLuongNhanSu { get; set; }
        public List<int> GoiSuDung { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public long StaffID { get; set; }
    }
}