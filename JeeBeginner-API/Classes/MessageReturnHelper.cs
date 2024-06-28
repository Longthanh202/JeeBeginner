using JeeBeginner.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeAccount.Classes
{
    public static class MessageReturnHelper
    {
        public const int ERRORCODE = 101;                                              //lỗi token
        public const int ERRORDATA = 106;                                              //lỗi Data
        public const int ERRORCODETIME = 102;                                          //lỗi về time
        public const int ERRORCODE_SQL = 103;                                          //lỗi sql
        public const int ERRORCODE_FORM = 104;                                         //lỗi về dữ liệu khi post thiếu dl
        public const int ERRORCODE_ROLE = 105;                                         //lỗi về quyền truy cập chức năng
        public const int ERRORCODE_EXCEPTION = 0;                                      //lỗi exception
        public const int ERRORCODE_BADREQEST = 400;                                    //lỗi cú pháp không hợp lệ
        public const int ERRORCODE_UNAUTHORIZED = 401;                                 //lỗi không có quyền

        public static object Ok(object data, PageModel pageModel)
        {
            return new
            {
                data = data,
                panigator = pageModel
            };
        }

        public static object ThanhCong(string message = "")
        {
            return new
            {
                statusCode = 1,
                message = string.IsNullOrEmpty(message) ? "Thành công" : message + " thành công",
            };
        }

        public static object Ok(object data, PageModel pageModel, bool Visible)
        {
            return new
            {
                data = data,
                Visible = Visible,
                panigator = pageModel
            };
        }

        public static object CustomDataKhongTonTai()
        {
            return new
            {
                statusCode = ERRORCODE_UNAUTHORIZED,
                message = "Tài khoản không hợp lệ hoặc thiếu hiệu lực. Vui lòng đăng nhập lại!",
            };
        }

        public static object KhongTonTai(string message = "")
        {
            return new
            {
                statusCode = ERRORDATA,
                message = string.IsNullOrEmpty(message) ? "Không tồn tại" : message + " không tồn tại",
            };
        }

        public static object KhongCoDuLieu(string message = "")
        {
            return new
            {
                statusCode = ERRORDATA,
                message = string.IsNullOrEmpty(message) ? "không có dữ liệu" : message + " không có dữ liệu",
            };
        }

        public static object KhongCoDuLieuException(KhongCoDuLieuException ex)
        {
            return new
            {
                statusCode = ERRORDATA,
                message = string.IsNullOrEmpty(ex.Message) ? "không có dữ liệu" : ex.Message + " không có dữ liệu",
            };
        }

        public static object Trung(string message)
        {
            return new
            {
                statusCode = ERRORDATA,
                message = message + "đã tồn tại",
            };
        }

        public static object Trung(TrungDuLieuExceoption ex)
        {
            return new
            {
                statusCode = ERRORDATA,
                message = string.IsNullOrEmpty(ex.Message) ? "Dữ liệu đã tồn tại" : ex.Message + " đã tồn tại",
            };
        }

        public static object BatBuoc(string str_required)
        {
            return new
            {
                statusCode = ERRORDATA,
                message = str_required + "là bắt buộc",
            };
        }

        public static object Custom(string str_custom)
        {
            return new
            {
                statusCode = ERRORDATA,
                message = str_custom
            };
        }

        public static object PhanQuyen(string quyen = "")
        {
            return new
            {
                statusCode = ERRORCODE_ROLE,
                message = "Không có quyền thực hiện chức năng " + (quyen.ToLower()?.Length == 0 ? "này" : quyen.ToLower()),
            };
        }

        public static object DangNhap()
        {
            return new
            {
                statusCode = ERRORCODE,
                message = "Phiên đăng nhập hết hiệu lực. Vui lòng đăng nhập lại!"
            };
        }

        public static object Exception(Exception last_error)
        {
            return new
            {
                message = "Lỗi truy xuất dữ liệu",
                statusCode = ERRORCODE_EXCEPTION,
                error = last_error != null ? last_error.Message : "",
            };
        }

        public static object KhongDuocXoaException(KhongDuocXoaException last_error)
        {
            return new
            {
                message = string.IsNullOrEmpty(last_error.Message) ? "Đối tượng đang được sử dụng. Không thể xoá!" : last_error.Message,
                statusCode = ERRORCODE_BADREQEST,
                error = last_error != null ? last_error.Message : "",
            };
        }

        public static object PhanTrang()
        {
            return new
            {
                statusCode = ERRORCODE,
                message = "Dữ liệu phân trang không đúng",
            };
        }
    }
}