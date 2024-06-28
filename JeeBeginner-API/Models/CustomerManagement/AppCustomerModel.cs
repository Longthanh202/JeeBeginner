using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class AppCustomerModel
    {
        public long CustomerID { get; set; }
        public long AppID { get; set; }
        public string Note { get; set; }
    }
}