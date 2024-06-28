using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerAppAddNumberStaffModel
    {
        public long CustomerID { get; set; }
        public List<CustomerAppDTO> LstCustomerAppDTO { get; set; }
    }
}