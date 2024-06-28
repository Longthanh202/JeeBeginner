using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class Pakage
    {
        public long RowID { get; set; }
        public string Title { get; set; }
        public int LimitedNumberOfProfile { get; set; }
        public string Note { get; set; }
        public bool IsTrial { get; set; }
        public int NumberOfDayLimit { get; set; }
        public int AppID { get; set; }
    }
}