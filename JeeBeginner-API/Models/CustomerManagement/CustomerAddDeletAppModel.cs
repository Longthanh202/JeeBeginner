using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Models.CustomerManagement
{
    public class CustomerAddDeletAppModel
    {
        public string EndDate { get; set; }
        public int CustomerID { get; set; }
        public List<int> LstAddAppID { get; set; }
        public List<int> LstDeleteAppID { get; set; }
        public List<int> CurrentDBID { get; set; }
        public List<int> SoLuongNhanSu { get; set; }
        public List<int> GoiSuDung { get; set; }
    }
}