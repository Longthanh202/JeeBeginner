using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerAppStatusModel
    {
        public long CustomerID { get; set; }
        public long AppID { get; set; }
        public bool Status { get; set; }
        public string Note { get; set; }
    }
}