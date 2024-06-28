using JeeBeginner.Models.Common;
using System;

namespace JeeBeginner.Classes
{
    public static class JsonResultCommon
    {
        public static object KhongTonTai(string name = "")
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = string.IsNullOrEmpty(name) ? "Không tồn tại" : name + " không tồn tại",
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object Trung(string name)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = name + " đã tồn tại",
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object BatBuoc(string str_required)
        {
            if (!string.IsNullOrEmpty(str_required))
                str_required = str_required.ToLower();
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Thông tin " + str_required + " là bắt buộc",
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object Custom(string str_custom)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = str_custom,
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object PhanQuyen(string quyen = "")
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Không có quyền thực hiện chức năng " + (quyen == "" ? "này" : quyen),
                    code = Constant.ERRORCODE_ROLE
                }
            };
        }

        public static object DangNhap()
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Phiên đăng nhập hết hiệu lực. Vui lòng đăng nhập lại!",
                    code = Constant.ERRORCODE
                },
            };
        }

        public static object Exception(Exception last_error)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Lỗi truy xuất dữ liệu",
                    LastError = last_error != null ? last_error.Message : "",
                    code = Constant.ERRORCODE_EXCEPTION
                }
            };
        }

        public static object PhanTrang()
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Dữ liệu phân trang không đúng",
                    code = Constant.ERRORCODE
                },
            };
        }

        public static object ThanhCong()
        {
            return new
            {
                status = 1,
            };
        }

        public static object ThanhCong(object data)
        {
            return new
            {
                status = 1,
                data = data
            };
        }
        public static object Trung(object data)
        {
            return new
            {
                status = 2,
                data = data
            };
        }

        public static object ThanhCong(object data, PageModel pageModel)
        {
            return new
            {
                status = 1,
                data = data,
                panigator = pageModel
            };
        }

        public static object ThanhCong(object data, PageModel pageModel, bool Visible)
        {
            return new
            {
                status = 1,
                data = data,
                Visible = Visible,
                panigator = pageModel
            };
        }

        public static object ThatBai(string message, Exception last_error)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = message,
                    LastError = last_error != null ? last_error.Message : "",
                    code = Constant.ERRORCODE_EXCEPTION
                }
            };
        }

        public static object ThatBai(string message)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = message,
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object ThatBai(string message, bool Visible)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = message,
                    code = Constant.ERRORDATA
                },
                Visible = Visible,
            };
        }

        public static object KhongHopLe(string name = "")
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = string.IsNullOrEmpty(name) ? "Không hợp lệ" : name + " không hợp lệ",
                    code = Constant.ERRORDATA
                }
            };
        }

        public static object SQL(string last_error)
        {
            return new
            {
                status = 0,
                error = new ErrorModel()
                {
                    message = "Có gì đó không đúng, vui lòng thử lại sau",
                    LastError = last_error != null ? last_error : "",
                    code = Constant.ERRORCODE_SQL
                }
            };
        }
    }
}