using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class AppCustomerDTO
    {
        public long CustomerID { get; set; }
        public long AppID { get; set; }
        public string EndDate { get; set; }
        public bool Status { get; set; }
        public string Note { get; set; }
        public string AppName { get; set; }
        public string PakageTitle { get; set; }
    }
}