namespace JeeBeginner.Models.AccountManagement.CustomerManagement
{
    public class CustomerModelDTO
    {
        public int RowID { get; set; }
        public string Code { get; set; }
        public string CompanyName { get; set; }
        public string RegisterName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string RegisterDate { get; set; }
        public int Status { get; set; }
        public string Note { get; set; }
        public string GiaHanDenNgay { get; set; }
    }
}