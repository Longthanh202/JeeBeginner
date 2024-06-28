using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.Common
{
    public class ChangePasswordModel
    {
        public string Username { get; set; }
        public string PasswordOld { get; set; }
        public string PaswordNew { get; set; }
    }
}