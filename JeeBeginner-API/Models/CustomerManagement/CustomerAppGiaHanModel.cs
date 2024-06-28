using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerAppGiaHanModel
    {
        public long CustomerID { get; set; }
        public string EndDate { get; set; }
        public string Note { get; set; }
        public List<long> LstAppCustomerID { get; set; }
    }
}