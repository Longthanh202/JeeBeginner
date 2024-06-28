namespace JeeBeginner.Models
{
    public class WidgetDashBoardModel
    {
        public long Id_row { get; set; }
        public long Id_nv { get; set; }
        public long Id { get; set; }
        public string Name { get; set; }
        public string ComponentName { get; set; }
        public int Cols { get; set; }
        public int Rows { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }

    public class Widget
    {
        public long id { get; set; }
        public string name { get; set; }
        public string componentName { get; set; }
        public int cols { get; set; }
        public int rows { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }
}