using System.Collections.Generic;

namespace JeeBeginner.Models.CustomerManagement
{
    public class AppListDTO
    {
        public int AppID { get; set; }
        public string AppCode { get; set; }
        public string AppName { get; set; }
        public string Description { get; set; }
        public string BackendURL { get; set; }
        public string APIUrl { get; set; }
        public string ReleaseDate { get; set; }
        public string Note { get; set; }
        public string CurrentVersion { get; set; }
        public string LastUpdate { get; set; }
        public bool IsDefaultApp { get; set; }
        public int Position { get; set; }
        public string Icon { get; set; }
    }
}