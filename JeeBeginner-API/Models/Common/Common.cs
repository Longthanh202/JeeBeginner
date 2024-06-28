using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace JeeBeginner.Models.Common
{
    public class Common
    {
        public static string GetHeader(HttpRequest request)
        {
            try
            {
                Microsoft.Extensions.Primitives.StringValues headerValues;
                //request.Headers.TryGetValue("Authorization", out headerValues);
                request.Headers.TryGetValue("Token", out headerValues);
                return headerValues.FirstOrDefault();
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }

        public class NhanVienMatchip
        {
            public string Username { get; set; }

            public string Fullname { get; set; }
            public string Display { get; set; }
            public long UserId { get; set; }
        }

        public class DepartmentSelection
        {
            public string RowID { get; set; }
            public string DeparmentName { get; set; }
        }
    }
}