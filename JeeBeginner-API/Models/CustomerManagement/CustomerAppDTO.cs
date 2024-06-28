using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerAppDTO
    {
        public long CustomerID { get; set; }
        public long AppID { get; set; }
        public string AppName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int PackageID { get; set; }
        public int Status { get; set; }
        public int SoLuongNhanSu { get; set; }
    }
}