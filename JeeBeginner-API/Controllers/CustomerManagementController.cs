using JeeAccount.Classes;
using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using JeeBeginner.Services;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using static JeeBeginner.Models.Common.Panigator;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/customermanagement")]
    [ApiController]
    public class CustomerManagementController : ControllerBase
    {
        private readonly ICustomerManagementService _service;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;

        public CustomerManagementController(ICustomerManagementService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
        }

        [HttpGet("Get_DSCustomer")]
        public async Task<ActionResult> GetListUsernameByCustormerID([FromQuery] QueryParams query)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());

                query = query == null ? new QueryParams() : query;
                BaseModel<object> model = new BaseModel<object>();
                PageModel pageModel = new PageModel();
                ErrorModel error = new ErrorModel();
                string orderByStr = "RowID asc";
                string whereStr = "Status = 1";
                Dictionary<string, string> sortableFields = new Dictionary<string, string>
                        {
                            { "thongtinkhachhang", "CompanyName"},
                            { "dienthoainguoidaidien", "Phone"},
                        };

                if (!string.IsNullOrEmpty(query.sortField) && sortableFields.ContainsKey(query.sortField))
                {
                    orderByStr = sortableFields[query.sortField] + ("desc".Equals(query.sortOrder) ? " desc" : " asc");
                }
                if (!string.IsNullOrEmpty(query.filter["keyword"]))
                {
                    whereStr += $@" and (CustomerList.CompanyName like N'%{query.filter["keyword"]}%'
                                    or CustomerList.Code like N'%{query.filter["keyword"]}%')";
                }

                if (!string.IsNullOrEmpty(query.filter["dakhoa"]))
                {
                    whereStr = $"Status = 0";
                }

                if (!string.IsNullOrEmpty(query.filter["dangsudung"]))
                {
                    if (!string.IsNullOrEmpty(query.filter["ListCustomerIDSDangSuDung"]))
                    {
                        var lstCustomerId = query.filter["ListCustomerIDSDangSuDung"];
                        whereStr += $" and RowID in ({lstCustomerId})";
                    }
                }

                if (!string.IsNullOrEmpty(query.filter["saphethan"]))
                {
                    if (!string.IsNullOrEmpty(query.filter["ListCustomerIDSapHetHan"]))
                    {
                        var lstCustomerId = query.filter["ListCustomerIDSapHetHan"];
                        whereStr += $" and RowID in ({lstCustomerId})";
                    }
                }

                if (!string.IsNullOrEmpty(query.filter["dahethan"]))
                {
                    if (!string.IsNullOrEmpty(query.filter["ListCustomerIDHetHan"]))
                    {
                        var lstCustomerId = query.filter["ListCustomerIDHetHan"];
                        whereStr += $" and RowID in ({lstCustomerId})";
                    }
                }

                var customerlist = await _service.GetListCustomer(whereStr, orderByStr);
                if (customerlist is null)
                    return BadRequest(MessageReturnHelper.KhongCoDuLieu("data"));

                if (customerlist.Count() == 0)
                    return BadRequest(MessageReturnHelper.KhongCoDuLieu("data"));

                int total = customerlist.Count();
                pageModel.TotalCount = customerlist.Count();
                pageModel.AllPage = (int)Math.Ceiling(total / (decimal)query.record);
                pageModel.Size = query.record;
                pageModel.Page = query.page;
                if (query.more)
                {
                    query.page = 1;
                    query.record = pageModel.TotalCount;
                }
                var list = customerlist.Skip((query.page - 1) * query.record).Take(query.record);

                return Ok(MessageReturnHelper.Ok(list, pageModel));
            }
            catch (KhongCoDuLieuException ex)
            {
                return BadRequest(MessageReturnHelper.KhongCoDuLieuException(ex));
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }

        [HttpPost("CreateCustomer")]
        public async Task<object> CreateCustomer(CustomerModel customerModel)
        {
            try
            {

                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheck = $"select Code from CustomerList where Code = '{customerModel.Code}'";
                bool isExist = GeneralService.IsExistDB(sqlCheck, _connectionString);

                if (isExist) return JsonResultCommon.Trung("Code");
                var create = await _service.CreateCustomer(customerModel, user.Id, user.Username, false);
                if (!create.Susscess)
                {
                    return JsonResultCommon.ThatBai(create.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(customerModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("ImportCustomer")]
        public async Task<object> ImportCustomer(CustomerModel customerModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheck = $"select Code from CustomerList where Code = '{customerModel.Code}'";
                bool isExist = GeneralService.IsExistDB(sqlCheck, _connectionString);

                string sqlCheckCustomer = $"select RowID from CustomerList where RowID = {customerModel.RowID}";
                bool isExistCustomerID = GeneralService.IsExistDB(sqlCheck, _connectionString);

                if (isExist) return JsonResultCommon.Trung("Code");

                if (isExistCustomerID) return JsonResultCommon.Trung("CustomerID");

                var create = await _service.CreateCustomer(customerModel, user.Id, user.Username, true);
                if (!create.Susscess)
                {
                    return JsonResultCommon.ThatBai(create.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(customerModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetCustomerByCustomerID")]
        public async Task<object> GetCustomerByCustomerID(long CustomerID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetCustomerByCustomerID(CustomerID);

                if (create is null)
                    return JsonResultCommon.KhongTonTai(CustomerID.ToString());

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPost("GetCustomerByIDs3")]
        public async Task<object> GetCustomerByIDs3(CustomerIDsModel IDs)
        {
            try
            {
                //var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                //if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetCustomerByCustomerIDs(IDs.Ids);

                if (create is null)
                    return JsonResultCommon.KhongTonTai("abc");

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "2")]
        [HttpPost("GetCustomerByIDs2")]
        public async Task<object> GetCustomerByIDs2(CustomerIDsModel IDs)
        {
            try
            {
                //var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                //if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetCustomerByCustomerIDs(IDs.Ids);

                if (create is null)
                    return JsonResultCommon.KhongTonTai("abc");

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("GetCustomerByIDs")]
        public async Task<object> GetCustomerByIDs(CustomerIDsModel IDs)
        {
            try
            {
                //var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                //if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetCustomerByCustomerIDs(IDs.Ids);

                if (create is null)
                    return JsonResultCommon.KhongTonTai("abc");

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("DateFilter")]
        public async Task<object> DateFilter()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                string orderByStr = "RowID asc";
                var customerlist = await _service.GetListCustomer("", orderByStr);

                var IsLock = customerlist.Where(item => item.Status == 0);

                var dict = await _service.GetAllCustomerHetHan();

                var t1 = _service.GetAllCustomerHetHan();
                var t2 = _service.GetAllCustomerSapHetHan(30);
                await Task.WhenAll(t1, t2);
                var ListCustomerIDHetHan = t1.Result;
                var ListCustomerIDSapHetHan = t2.Result;
                var ListCustomerIDSDangSuDung = customerlist.Where(item => item.Status == 1).Select(item => item.RowID.ToString());

                var All = customerlist.Count();

                var IsUsed = customerlist.Count() - IsLock.Count();

                return Ok(new { IsLock = IsLock.Count(), HetHan = ListCustomerIDHetHan.Count(), SapHetHan = ListCustomerIDSapHetHan.Count(), All = All, IsUsed = IsUsed, ListCustomerIDSapHetHan = ListCustomerIDSapHetHan, ListCustomerIDHetHan = ListCustomerIDHetHan, ListCustomerIDSDangSuDung = ListCustomerIDSDangSuDung });
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetListApp")]
        public async Task<object> GetListApp()
        {
            try
            {
                var list = await _service.GetListApp();

                if (list is null) return JsonResultCommon.KhongTonTai();
                return JsonResultCommon.ThanhCong(list);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("GetDS_InfoAppByCustomerID")]
        public async Task<object> GetDS_InfoAppByCustomerID([FromBody] QueryRequestParams query)
        {
            try
            {
                long customerID;
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                if (query.Filter.ContainsKey("CustomerID"))
                {
                    customerID = Int32.Parse(query.Filter["CustomerID"]);
                }
                else
                {
                    return JsonResultCommon.BatBuoc("CustomerID");
                }

                query = query == null ? new QueryRequestParams() : query;
                BaseModel<object> model = new BaseModel<object>();
                PageModel pageModel = new PageModel();
                ErrorModel error = new ErrorModel();

                string orderByStr = "AppID asc";
                string whereStr = $"CustomerID = {customerID}";

                Dictionary<string, string> filter = new Dictionary<string, string>
                        {
                            { "tenungdung", "AppName"},
                            { "ngayhethan", "EndDate"},
                            { "tinhtrang", "Status"},
                        };

                if (query.Sort != null)
                {
                    if (!string.IsNullOrEmpty(query.Sort.ColumnName) && filter.ContainsKey(query.Sort.ColumnName))
                    {
                        orderByStr = filter[query.Sort.ColumnName] + " " + (query.Sort.Direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ? "asc" : "desc");
                    }
                }

                var customerlist = await _service.GetDS_InfoAppByCustomerID(whereStr, orderByStr);
                if (customerlist is null || customerlist.Count() == 0)
                    return JsonResultCommon.KhongTonTai("Danh sách");

                pageModel.TotalCount = customerlist.Count();
                pageModel.AllPage = (int)Math.Ceiling(customerlist.Count() / (decimal)query.Panigator.PageSize);
                pageModel.Size = query.Panigator.PageSize;
                pageModel.Page = query.Panigator.PageIndex;
                customerlist = customerlist.AsEnumerable().Skip((query.Panigator.PageIndex - 1) * query.Panigator.PageSize).Take(query.Panigator.PageSize);
                return JsonResultCommon.ThanhCong(customerlist, pageModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetInfoAppByCustomerID")]
        public async Task<object> GetInfoAppByCustomerID(long CustomerID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                var list = await _service.GetInfoAppByCustomerID(CustomerID);

                if (list is null)
                    return JsonResultCommon.KhongTonTai("ListApp của CustomerID");

                return JsonResultCommon.ThanhCong(list);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateStatus")]
        public async Task<object> UpdateStatus(CustomerAppStatusModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select AppID from Customer_App where CustomerID = {model.CustomerID} and AppID = {model.AppID}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return JsonResultCommon.KhongTonTai("App");

                var update = await _service.UpdateStatus(model);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(model);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetNoteLock")]
        public async Task<object> GetNoteLock(long CustomerID, long AppID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var note = await _service.GetNoteLock(CustomerID, AppID);
                return JsonResultCommon.ThanhCong(note);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateCustomerAppGiaHanModel")]
        public async Task<object> UpdateCustomerAppGiaHanModel(CustomerAppGiaHanModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select RowID from CustomerList where RowID = {model.CustomerID}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return JsonResultCommon.KhongTonTai("Customer");

                var update = await _service.UpdateCustomerAppGiaHanModel(model);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(model);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("getListAppFromJeeAccount")]
        public async Task<object> getListAppFromJeeAccount(long CustomerID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var list = await _service.GetListCustomerAppByCustomerIDFromAccount(CustomerID);
                if (list != null)
                    return JsonResultCommon.ThanhCong(list);
                return JsonResultCommon.ThatBai("Lấy AppList");
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateCustomerAppAddNumberStaff")]
        public async Task<object> UpdateCustomerAppAddNumberStaff(CustomerAppAddNumberStaffModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var update = await _service.UpdateCustomerAppAddNumberStaff(model);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(model);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateCustomerResetPassword")]
        public async Task<HttpResponseMessage> UpdateCustomerResetPassword(CustomerResetPasswordModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return new HttpResponseMessage(HttpStatusCode.Unauthorized);

                var update = await _service.UpdateCustomerResetPassword(model);
                return update;
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new StringContent(ex.Message, System.Text.Encoding.UTF8, "application/json") };
            }
        }

        [HttpGet("UpdateLock/{customerid}")]
        public async Task<IActionResult> UpdateLock(int customerid)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());

                string sqlCheckCode = $"select RowID from CustomerList where RowID = {customerid}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return BadRequest(MessageReturnHelper.KhongTonTai("customerid"));

                var update = await _service.UpdateLock(customerid);
                if (!update.IsSuccessStatusCode)
                {
                    string returnValue = update.Content.ReadAsStringAsync().Result;
                    if (string.IsNullOrEmpty(returnValue))
                    {
                        return StatusCode((int)update.StatusCode, update.ReasonPhrase);
                    }
                    return BadRequest(returnValue);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }

        [HttpGet("UpdateUnLock/{customerid}")]
        public async Task<IActionResult> UpdateUnLock(int customerid)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());

                string sqlCheckCode = $"select RowID from CustomerList where RowID = {customerid}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return BadRequest(MessageReturnHelper.KhongTonTai("customerid"));

                var update = await _service.UpdateUnLock(customerid);
                if (!update.IsSuccessStatusCode)
                {
                    string returnValue = update.Content.ReadAsStringAsync().Result;
                    return BadRequest(returnValue);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }

        [HttpGet("GetPakageListApp")]
        public async Task<IActionResult> GetPakageListApp()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());

                var lst = await _service.GetPakageListApp();
                return Ok(lst);
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }

        [HttpPost("UpdateCustomerAddDeletAppModel")]
        public async Task<IActionResult> UpdateCustomerAddDeletAppModel(CustomerAddDeletAppModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());

                await _service.UpdateCustomerAddDeletAppModelCnn(model, user.Username);
                return Ok(MessageReturnHelper.ThanhCong());
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }

        [HttpGet("GetListDBFromJeeAccount")]
        public async Task<IActionResult> GetListDBFromJeeAccount()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return Unauthorized(MessageReturnHelper.DangNhap());
                var jeeaccountController = new JeeAccountCustomerService(_configuration);
                var lst = await jeeaccountController.GetListDBFromAccount();
                if (lst.IsSuccessStatusCode)
                {
                    return Ok(lst.Content.ReadAsStringAsync().Result);
                }
                else
                {
                    return BadRequest(lst.ReasonPhrase);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }
    }
}