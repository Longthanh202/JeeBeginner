using System;
using System.Text.RegularExpressions;

namespace JeeBeginner.Classes
{
    public class Common
    {
        public static string Format_DateHD_ExportExcel(string str = "", bool filename = false)
        {
            try
            {
                if (str.Trim() == "") return "";

                var t = str;
                var pattern1 = @"^(\d{4})(-)(\d{2})(-)(\d{2})";
                if (!filename)
                    t = Regex.Replace(str, pattern1, "$5/$3/$1");
                else
                    t = Regex.Replace(str, pattern1, "$5$3$1");
                return t;
            }
            catch
            {
                return str;
            }
        }

        public static string Format_Currency(string str)//truyền 1 chuỗi dãy số vào
        {
            var t = "";
            if (str.Trim().Replace(" ", "").Length > 0)
            {
                var pattern1 = @"(\d)(?=(\d{3})+(?!\d))";
                t = Regex.Replace(str, pattern1, "$1,");
            }
            return t;
        }

        public static double Format_Double(string str)//truyền 1 chuỗi dãy số vào
        {
            var t = 0.0;
            if (str.Trim().Replace(" ", "").Length > 0)
                t = double.Parse(str);
            return t;
        }

        public static string Filter_SoDienThoai(string p_Input = "")
        {
            try
            {
                Match m = Regex.Match(p_Input.Trim(), @"^([0-9]{1,20})$");
                if (m.Length == 0) return "";
                return p_Input.Trim();
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string FormatDate_UTC(string p_Input = "")
        {
            try
            {
                if (p_Input.Trim() == "") return "";
                if (p_Input.Contains("01/01/00")) return "";
                Match m;
                var t = p_Input;
                var pattern1 = @"^(\d{2}|\d{1})(\/)(\d{2}|\d{1})(\/)(\d{2}) (\d{1}|\d{2})(:)(\d{1}|\d{2})(:)(\d{1}|\d{2}) (AM|PM)$";
                m = Regex.Match(p_Input.Trim(), pattern1);
                if (m.Length == 0)
                {
                    pattern1 = @"^(\d{2}|\d{1})(\/)(\d{2}|\d{1})(\/)(\d{4}) (\d{1}|\d{2})(:)(\d{1}|\d{2})(:)(\d{1}|\d{2}) (AM|PM)$";
                    t = Regex.Replace(t, pattern1, "$3/$1/$5");
                }
                else
                {
                    t = Regex.Replace(t, pattern1, "$3/$1/20$5");
                }

                if (t.Contains("/1900")) return "";

                return t;
            }
            catch
            {
                return "";
            }
        }

        public static string Remove_Last_Phay(string p_Input = "")
        {
            try
            {
                p_Input = p_Input.Trim();
                var pattern1 = @",$";
                p_Input = Regex.Replace(p_Input, pattern1, "");
                return p_Input;
            }
            catch (Exception ex)
            {
                return p_Input;
            }
        }

        public static string ConvertDateTimeToString(object obj, bool cothoigian = false, bool hiennamtruoc = false)
        {
            if (obj == null || string.IsNullOrEmpty(obj.ToString()))
                return "";
            try
            {
                if (hiennamtruoc)
                {
                    if (cothoigian)
                        return ((DateTime)obj).ToString("yyyy/MM/dd HH:mm:ss");
                    else
                        return ((DateTime)obj).ToString("yyyy/MM/dd");
                }
                else
                {
                    if (cothoigian)
                        return ((DateTime)obj).ToString("dd/MM/yyyy HH:mm:ss");
                    else
                        return ((DateTime)obj).ToString("dd/MM/yyyy");
                }
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string GetFormatDate(DateTime tungay, DateTime denngay, string tugio, string dengio)
        {
            if (denngay.Date.Equals(DateTime.MinValue))
                return $"{GetDayOfWeek(tungay)} {(tungay.Year.Equals(DateTime.UtcNow.Year) ? string.Format("{0:dd/MM}", tungay) : string.Format("{0:dd/MM/yyyy}", tungay))}";
            if (tungay.Date.Equals(denngay.Date))
                return $"{GetDayOfWeek(tungay)} {(tungay.Year.Equals(DateTime.UtcNow.Year) ? string.Format("{0:dd/MM}", tungay) : string.Format("{0:dd/MM/yyyy}", tungay))} {tugio} - {dengio}";
            return $"{GetDayOfWeek(tungay)} {(tungay.Year.Equals(DateTime.UtcNow.Year) ? string.Format("{0:dd/MM}", tungay) : string.Format("{0:dd/MM/yyyy}", tungay))} {tugio} - {GetDayOfWeek(denngay)} {(denngay.Year.Equals(DateTime.UtcNow.Year) ? string.Format("{0:dd/MM}", denngay) : string.Format("{0:dd/MM/yyyy}", denngay))} { dengio}";
        }

        public static string GetFormatDate(DateTime ngay, string format)
        {
            return string.Format("{0:" + format + "}", ngay).Replace("77622", GetDayOfWeek(ngay));
        }

        public static string GetDayOfWeek(DateTime date)
        {
            switch (date.DayOfWeek)
            {
                case DayOfWeek.Friday: return "T6";
                case DayOfWeek.Monday: return "T2";
                case DayOfWeek.Saturday: return "T7";
                case DayOfWeek.Sunday: return "CN";
                case DayOfWeek.Thursday: return "T5";
                case DayOfWeek.Tuesday: return "T3";
                case DayOfWeek.Wednesday: return "T4";
            }
            return "";
        }
    }
}