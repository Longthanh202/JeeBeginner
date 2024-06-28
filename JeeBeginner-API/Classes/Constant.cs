using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace JeeBeginner.Classes
{
    public class Constant
    {
        /// <summary>
        /// Variable for JWT type
        /// </summary>
        //public static string _User = "user";

        public static string _User = "customdata"; //test

        public const string ERRORCODE = "101";                                              //lỗi token
        public const string ERRORDATA = "106";                                              //lỗi Data
        public const string ERRORCODETIME = "102";                                          //lỗi về time
        public const string ERRORCODE_SQL = "103";                                          //lỗi sql
        public const string ERRORCODE_FORM = "104";                                         //lỗi về dữ liệu khi post thiếu dl
        public const string ERRORCODE_ROLE = "105";                                         //lỗi về quyền truy cập chức năng
        public const string ERRORCODE_EXCEPTION = "0000";                                   //EXCEPTION
        public const string ERRORCODE_EXIST = "107";                                        //lỗi dữ liệu đã tồn tại
        public const string ERRORCODE_NOTEXIST = "108";                                     //lỗi dữ liệu không tồn tại
        public const string ERRORCODE_CALLAPI = "109";                                      // lỗi không gọi được api
        public static string RootUpload { get { return "/Avatar/"; } }

        public static string RootUploadFile { get { return "/File/"; } }
        public static int MaxSize { get { return 30000000; } }//maximum file size 30MB

        public static string PASSWORD_ED = "JeeHR_DPSSecurity435";

        //public const string TEMPLATE_IMPORT_FOLDER = "dulieu/Template";
        //public const string ATTACHFILE_YKIEN_FOLDER = "dulieu/dinhkem/YKienXuLy";

        private static Random random = new Random(); // gen mật khẩu mặc định  (đang theo chuẩn của Viettel)

        public static string RandomString(int length)
        {
            string chars1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var Str1 = new string(Enumerable.Repeat(chars1, 1)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            string chars2 = "0123456789";
            var Str2 = new string(Enumerable.Repeat(chars2, 1)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            string chars3 = "!@#$%";
            var Str3 = new string(Enumerable.Repeat(chars3, 1)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            string chars4 = "abcdefghijklmnopqrstvwxyz";
            var Str4 = new string(Enumerable.Repeat(chars4, 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            return Str1 + Str2 + Str3 + Str4;
        }

        public static IConfigurationRoot getConfig()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            return root;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="code">ex: JeeWorkConfig:HRConnectionString</param>
        /// <returns></returns>
        public static string getConfig(string code)
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            var value = root[code];
            return value;
        }
    }

    public enum StateCode
    {
        NoPermit,
        CannotGetData
    }

    public static class ErrCode_Const
    {
        public static int SUCCESS = 0;
        public static int KEY_FILTER_NOT_EXISTS = 1;
        public static int EXCEPTION_API = 2;
        public static int PROPERTY_IS_NULL_OR_EMPTY = 3;

        /// <summary>
        /// Cannot find data form id
        /// </summary>
        public static int CANNOT_FIND_DATA_BY_QUERY = 4;

        public static int PROPERTY_IS_REQUIRED = 5;
        public static int PROPERTY_IS_INVALID = 6;
        public static int KEY_PROPS_NOT_FOUND = 7;
        public static int TYPE_OF_FILE_UPLOAD_INVALID = 8;
        public static int SIZE_FILE_TOO_BIG = 9;
        public static int NO_FILE_TO_UPLOAD = 10;
        public static int FILE_FORMAT_INVALID = 11;
        public static int LOGIN_SESSION_EXPIRED = 12;
        public static int FILE_READ_EXCEPTION = 14;
        public static int USER_NOT_FOUND = 15;
        public static int JWT_CANNOT_REFRESH_TOKEN = 16;
        public static int JWT_EXCEPTION_ERROR = 17;
        public static int JWT_INVALID_TOKEN = 18;
        public static int JWT_TOKEN_IS_REQUIRED = 19;
        public static int SQL_QUERY_HAS_ERROR = 20;
        public static int SQL_QUERY_NO_ROW = 21;
        public static int REQUEST_PARAMS_NULL = 22;
        public static int SQL_QUERY_ERROR_RETURN_TBL = 23;
        public static int SQL_QUERY_CANNOT_PAGINATE = 24;
        public static int SQL_INSERT_FAILED = 25;
        public static int PROPERTY_IS_ENOUGH_COUT = 26;
    }

    public static class ErrMsg_Const
    {
        private static Dictionary<int, string> Dic_Error =
             new Dictionary<int, string>
             {
                { ErrCode_Const.SUCCESS, String.Empty}//query search not has in api
                ,{ ErrCode_Const.KEY_FILTER_NOT_EXISTS, "Key filter is not exists" }//query search not has in api
                ,{ ErrCode_Const.EXCEPTION_API, "Error Exception! cannot do this action" }//query search not has in api
                ,{ ErrCode_Const.PROPERTY_IS_NULL_OR_EMPTY, "Property cannot be null or empty" }//query search not has in api
                ,{ ErrCode_Const.CANNOT_FIND_DATA_BY_QUERY, "Data is empty" }//query search not has in api
                ,{ ErrCode_Const.PROPERTY_IS_REQUIRED, "Property is required" }//query search not has in api
                ,{ ErrCode_Const.PROPERTY_IS_INVALID, "Property is invalid" }//query search not has in api
                ,{ ErrCode_Const.KEY_PROPS_NOT_FOUND, "Data not found" }//query search not has in api
                ,{ ErrCode_Const.TYPE_OF_FILE_UPLOAD_INVALID, "Type of file upload invalid" }//query search not has in api
                ,{ ErrCode_Const.SIZE_FILE_TOO_BIG, "Size of file is too big" }//query search not has in api
                ,{ ErrCode_Const.NO_FILE_TO_UPLOAD, "No file to upload" }//query search not has in api
                ,{ ErrCode_Const.FILE_FORMAT_INVALID, "Format file is invalid" }//query search not has in api
                ,{ ErrCode_Const.LOGIN_SESSION_EXPIRED, "Login session is expired" }//query search not has in api
                ,{ ErrCode_Const.FILE_READ_EXCEPTION, "Read file on server has exceptions" }//query search not has in api
                ,{ ErrCode_Const.USER_NOT_FOUND, "User not found" }//query search not has in api
                ,{ ErrCode_Const.JWT_CANNOT_REFRESH_TOKEN, "Cannot get refresh token" }//query search not has in api
                ,{ ErrCode_Const.JWT_EXCEPTION_ERROR, "Error Exception when get token" }//query search not has in api
                ,{ ErrCode_Const.JWT_INVALID_TOKEN, "Token base is invalid" }//query search not has in api
                ,{ ErrCode_Const.JWT_TOKEN_IS_REQUIRED, "Token is required" }//query search not has in api
                ,{ ErrCode_Const.SQL_QUERY_HAS_ERROR, "Cannot get data" }//query search not has in api
                ,{ ErrCode_Const.SQL_QUERY_NO_ROW, "Data is empty" }//query search not has in api
                ,{ ErrCode_Const.REQUEST_PARAMS_NULL, "Request param is empty" }//query search not has in api
                ,{ ErrCode_Const.SQL_QUERY_ERROR_RETURN_TBL, "Data is not enough to query" }//query search not has in api
                ,{ ErrCode_Const.SQL_QUERY_CANNOT_PAGINATE, "Data cannot paginate" }//query search not has in api
                ,{ ErrCode_Const.SQL_INSERT_FAILED, "Cannot save data" }//query search not has in api
                ,{ ErrCode_Const.PROPERTY_IS_ENOUGH_COUT, "Code to remove cannot enough" }//query search not has in api
             };

        /// <summary>
        /// Get error message from error
        /// </summary>
        /// <param name="pErrorCode">From ErrCode_Constant </param>
        /// <returns></returns>
        public static string GetMsg(int pErrorCode)
        {
            try
            {
                return Dic_Error.ContainsKey(pErrorCode) ? Dic_Error[pErrorCode] : "Error has been not defined";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Get error msg with leghth of string
        /// Example: error is asdasdasd asdasdas dasd asdiejforeng rgerogijeoijerf neroifnerofnsdv oijsdoisd
        /// We want to return a message with lenght is 50 character
        /// </summary>
        /// <param name="pErrorCode">Code error</param>
        /// <param name="pExtraMsg">Message extra we want to show</param>
        /// <param name="pLength">Length of message</param>
        /// <returns></returns>
        public static string GetMsgWithLength(int pErrorCode, string pExtraMsg = "", int pLength = 200)
        {
            try
            {
                return pErrorCode.ToString() + " - " + Ulities.TruncateString(pExtraMsg, pLength);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}