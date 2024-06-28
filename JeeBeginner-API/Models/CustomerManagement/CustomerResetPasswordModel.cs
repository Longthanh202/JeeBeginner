using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerResetPasswordModel
    {
        public long CustomerID { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}