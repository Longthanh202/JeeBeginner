using DpsLibs.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;

namespace JeeBeginner.Services
{
    public static class GeneralService
    {
        public static string CreateListStringWhereIn(List<string> ListStringData)
        {
            string result = "";
            foreach (string data in ListStringData)
            {
                if (string.IsNullOrEmpty(result))
                {
                    result = $"'{data}'";
                }
                else
                {
                    result += $", '{data}'";
                }
            }
            return result;
        }

        public static string CreateListLongWhereIn(List<long> ListStringData)
        {
            string result = "";
            foreach (long data in ListStringData)
            {
                if (string.IsNullOrEmpty(result))
                {
                    result = $"'{data}'";
                }
                else
                {
                    result += $", '{data}'";
                }
            }
            return result;
        }

        public static string getlastname(string fullname)
        {
            if (fullname.Contains(' '))
            {
                string[] word = fullname.Split(' ');
                string lastName = word[0];
                for (var index = 1; index < word.Length - 1; index++)
                {
                    lastName += " " + word[index];
                }
                return lastName;
            }
            return fullname;
        }

        public static string getFirstname(string fullname)
        {
            if (fullname.Contains(' '))
            {
                string[] word = fullname.Split(' ');
                string firstName = word[word.Length - 1];
                return firstName;
            }
            return fullname;
        }

        public static object GetObjectDB(string sql, string connectionString)
        {
            using (DpsConnection cnn = new DpsConnection(connectionString))
            {
                return cnn.ExecuteScalar(sql);
            }
        }

        public static object GetObjectDB(string sql, SqlConditions conds, string connectionString)
        {
            using (DpsConnection cnn = new DpsConnection(connectionString))
            {
                return cnn.ExecuteScalar(sql, conds);
            }
        }

        public static bool IsExistDB(string sql, string connectionString)
        {
            DataTable dt = new DataTable();
            using (DpsConnection cnn = new DpsConnection(connectionString))
            {
                dt = cnn.CreateDataTable(sql);
            }
            if (dt.Rows.Count == 0) return false;
            return true;
        }

        public static bool IsExistDB(string sql, SqlConditions conds, string connectionString)
        {
            DataTable dt = new DataTable();
            using (DpsConnection cnn = new DpsConnection(connectionString))
            {
                dt = cnn.CreateDataTable(sql);
            }
            if (dt.Rows.Count == 0) return false;
            return true;
        }

        public static DateTime StringDateToDateTime(string dateString)
        {
            return DateTime.ParseExact(dateString, "dd/MM/yyyy", null);
        }

        public static bool SapHetHanDateTime(DateTime endDate, int SoNgay)
        {
            if (endDate >= DateTime.UtcNow && endDate <= DateTime.UtcNow.AddDays(SoNgay))
            {
                return true;
            }

            return false;
        }

        public static bool HetHanDateTime(DateTime endDate)
        {
            if (endDate < DateTime.UtcNow)
            {
                return true;
            }

            return false;
        }
    }
}