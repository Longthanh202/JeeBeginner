using DpsLibs.Data;
using JeeAccount.Classes;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountRoleManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Services;
using JeeBeginner.Services.AccountRoleManagement;
using JeeBeginner.Services.Authorization;
using JeeBeginner.Services.PartnerManagement;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static JeeBeginner.Models.Common.Panigator;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/accountrolemanagement")]
    [ApiController]
    public class AccountRoleManagementController : ControllerBase
    {
        private readonly IAccountRoleManagementService _service;
        private readonly IPartnerManagementService _partnerService;
        private readonly ICustomAuthorizationService _authService;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;

        public AccountRoleManagementController(IAccountRoleManagementService accountManagementService, IPartnerManagementService partner, IConfiguration configuration, ICustomAuthorizationService authService)
        {
            _service = accountManagementService;
            _configuration = configuration;
            _authService = authService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _partnerService = partner;
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
        }

        [HttpPost("Get_DS")]
        public async Task<object> GetListDS([FromBody] QueryRequestParams query)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                query = query == null ? new QueryRequestParams() : query;
                BaseModel<object> model = new BaseModel<object>();
                PageModel pageModel = new PageModel();
                ErrorModel error = new ErrorModel();
                SqlConditions conds = new SqlConditions();
                string orderByStr = "AccountList.RowID asc";
                string whereStr = "PartnerList.IsLock = 0";
                conds.Add("PartnerList.IsLock", 0);
                string partnerID = GeneralService.GetObjectDB($"select PartnerID from AccountList where RowID = {user.Id}", _connectionString).ToString();
                if (user.IsMasterAccount)
                {
                }
                else
                {
                    conds.Add("AccountList.IsLock", partnerID);
                }
                Dictionary<string, string> filter = new Dictionary<string, string>
                        {
                            {"stt", "AccountList.RowID" },
                            { "username", "AccountList.Username"},
                            { "tendoitac", "PartnerList.PartnerName"},
                            { "tinhtrang", "AccountList.IsLock"},
                        };
                if (query.Sort != null)
                {
                    if (!string.IsNullOrEmpty(query.Sort.ColumnName) && filter.ContainsKey(query.Sort.ColumnName))
                    {
                        ///abc
                        orderByStr = filter[query.Sort.ColumnName] + " " + (query.Sort.Direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ? "asc" : "desc");
                    }
                }
                if (query.Filter != null)
                {
                    if (query.Filter.ContainsKey("status"))
                    {
                        var status = query.Filter["status"];
                        if (!status.Equals("-1"))
                        {
                            if (!string.IsNullOrEmpty(whereStr))
                            {
                                conds.Add("AccountList.IsLock", status);
                            }
                        }
                    }
                    if (query.Filter.ContainsKey("doitac"))
                    {
                        var doitac = query.Filter["doitac"];
                        if (!doitac.Equals("-1"))
                        {
                            if (!string.IsNullOrEmpty(whereStr))
                            {
                                conds.Add("AccountList.PartnerID", doitac);
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(query.SearchValue))
                    {
                        if (!string.IsNullOrEmpty(whereStr)) whereStr += " and ";
                        conds.Add("AccountList.Fullname", $"%{partnerID}%");
                    }
                }
                bool Visible = true;
                Visible = !_authService.IsReadOnlyPermit("1", user.Username);
                var customerlist = await _service.GetAll(conds, orderByStr);
                if (customerlist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (customerlist is null)
                    return JsonResultCommon.KhongTonTai();
                pageModel.TotalCount = customerlist.Count();
                pageModel.AllPage = (int)Math.Ceiling(customerlist.Count() / (decimal)query.Panigator.PageSize);
                pageModel.Size = query.Panigator.PageSize;
                pageModel.Page = query.Panigator.PageIndex;
                customerlist = customerlist.AsEnumerable().Skip((query.Panigator.PageIndex - 1) * query.Panigator.PageSize).Take(query.Panigator.PageSize);
                return JsonResultCommon.ThanhCong(customerlist, pageModel, Visible);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("Get_AllAccount")]
        public async Task<object> GetAllAccount([FromBody] QueryRequestParams query)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                query = query == null ? new QueryRequestParams() : query;
                BaseModel<object> model = new BaseModel<object>();
                PageModel pageModel = new PageModel();
                ErrorModel error = new ErrorModel();
                SqlConditions conds = new SqlConditions();
                string orderByStr = "AccountList.RowID asc";
                string whereStr = "PartnerList.IsLock = 0";
                conds.Add("PartnerList.IsLock", 0);
                string partnerID = GeneralService.GetObjectDB($"select PartnerID from AccountList where RowID = {user.Id}", _connectionString).ToString();
                if (user.IsMasterAccount)
                {
                }
                else
                {
                    //conds.Add("AccountList.IsLock", partnerID);
                }
                Dictionary<string, string> filter = new Dictionary<string, string>
                        {
                            {"stt", "AccountList.RowID" },
                            { "username", "AccountList.Username"},
                            { "tendoitac", "PartnerList.PartnerName"},
                            { "tinhtrang", "AccountList.IsLock"},
                        };
                if (query.Sort != null)
                {
                    if (!string.IsNullOrEmpty(query.Sort.ColumnName) && filter.ContainsKey(query.Sort.ColumnName))
                    {
                        ///abc
                        orderByStr = filter[query.Sort.ColumnName] + " " + (query.Sort.Direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ? "asc" : "desc");
                    }
                }
                if (query.Filter != null)
                {
                    //if (query.Filter.ContainsKey("status"))
                    //{
                    //    var status = query.Filter["status"];
                    //    if (!status.Equals("-1"))
                    //    {
                    //        if (!string.IsNullOrEmpty(whereStr))
                    //        {
                    //            conds.Add("AccountList.IsLock", status);
                    //        }
                    //    }
                    //}
                    if (query.Filter.ContainsKey("doitac"))
                    {
                        var doitac = query.Filter["doitac"];
                        if (!doitac.Equals("-1"))
                        {
                            if (!string.IsNullOrEmpty(whereStr))
                            {
                                conds.Add("AccountList.PartnerID", doitac);
                            }
                        }
                    }
                    //if (!string.IsNullOrEmpty(query.SearchValue))
                    //{
                    //    if (!string.IsNullOrEmpty(whereStr)) whereStr += " and ";
                    //    conds.Add("AccountList.Fullname", $"%{partnerID}%");
                    //}
                }
                bool Visible = true;
                Visible = !_authService.IsReadOnlyPermit("1", user.Username);
                var customerlist = await _service.GetAllAccounts(conds, orderByStr);
                if (customerlist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (customerlist is null)
                    return JsonResultCommon.KhongTonTai();
                //pageModel.TotalCount = customerlist.Count();
                //pageModel.AllPage = (int)Math.Ceiling(customerlist.Count() / (decimal)query.Panigator.PageSize);
                //pageModel.Size = query.Panigator.PageSize;
                //pageModel.Page = query.Panigator.PageIndex;
                //customerlist = customerlist.AsEnumerable().Skip((query.Panigator.PageIndex - 1) * query.Panigator.PageSize).Take(query.Panigator.PageSize);
                //return JsonResultCommon.ThanhCong(customerlist, pageModel, Visible);
                return Ok(customerlist);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("createAccount")]
        public async Task<object> CreateAccount(AccountRoleModel accountModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                if (accountModel.PartnerId == 0)
                {
                    long PartnerId = long.Parse(GeneralService.GetObjectDB($"select PartnerID from AccountList where RowID = {user.Id}", _connectionString).ToString());
                    accountModel.PartnerId = PartnerId;
                }

                string sqlCheckUsername = $"select Username from AccountList where Username = '{accountModel.Username}'";
                bool isExistUsername = GeneralService.IsExistDB(sqlCheckUsername, _connectionString);
                if (isExistUsername) return JsonResultCommon.Trung("Username");

                var create = await _service.CreateAccount(accountModel, user.Id);
                if (!create.Susscess)
                {
                    return JsonResultCommon.ThatBai(create.ErrorMessgage);
                }

                return JsonResultCommon.ThanhCong(accountModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("updateAccount")]
        public async Task<object> UpdateAccount(AccountRoleModel accountModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select RowId from AccountList where RowId = {accountModel.RowId}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("account");

                var update = await _service.UpdateAccount(accountModel, user.Id);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(accountModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateStatusAccount")]
        public async Task<object> UpdateStatusAccount(AccountRoleStatusModel accountModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select RowId from AccountList where RowId = {accountModel.RowID}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Username");

                var update = await _service.UpdateStatusAccount(accountModel, user.Id);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(accountModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetAccountByRowID")]
        public async Task<object> GetAccountByRowID(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetOneModelByRowID(RowID);
                if (create.RowId == 0)
                {
                    return JsonResultCommon.KhongTonTai("Account");
                }

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("Save_QuyenNguoiDung")]
        public async Task<object> Save_QuyenNguoiDung(List<AccountRole> arr_data)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                if (!user.IsMasterAccount) return JsonResultCommon.BatBuoc("User phải là isMasterAccount");

                var list = await _service.Save_QuyenNguoiDung(arr_data);
                if (list is null)
                {
                    return JsonResultCommon.ThatBai("Danh sách rỗng");
                }
                return JsonResultCommon.ThanhCong();
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("UpdateEditRole")]
        public async Task<object> UpdateInsertEditRole(AccountRole accountModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                await _service.UpdateInsertEditRole(accountModel);


                return JsonResultCommon.ThanhCong();
            }
            catch (Exception ex)
            {
                return BadRequest(MessageReturnHelper.Exception(ex));
            }
        }
        [HttpPost("IsReadOnlyPermitAccountRole")]
        public async Task<object> IsReadOnlyPermitAccountRole(string roleName)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                if (!user.IsMasterAccount) return JsonResultCommon.BatBuoc("User phải là isMasterAccount");

                bool Visible = true;
                Visible = !_authService.IsReadOnlyPermit(roleName, user.Username);
                return Visible;
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("GetRoleUsername")]
        public async Task<object> GetAllRole(string Username)
        {
            try
            {
                //var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                //if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetAllRole(Username);
                //if (string.IsNullOrEmpty(create.Username))
                //{
                //    return JsonResultCommon.KhongTonTai("Account");
                //}

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("Save_Quyen")]
        public async Task<object> Save_Quyen(List<AccountRole> arr_data)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                if (!user.IsMasterAccount) return JsonResultCommon.BatBuoc("User phải là isMasterAccount");

                var list = await _service.Save_Quyen(arr_data);
                if (list is null)
                {
                    return JsonResultCommon.ThatBai("Lỗi");
                }
                return JsonResultCommon.ThanhCong();
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("CreateAccountPermission")]
        public async Task<object> CreateAccountPermission(AccountRole model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");


                string sqlCheckIdPermit_Username = $"select Username,Id_Permit from tbl_account_permit " +
                    $"where Username = '{model.Username}' and Id_Permit = '{model.Id_Permit}'";
                bool isExistIdPermit_Username = GeneralService.IsExistDB(sqlCheckIdPermit_Username, _connectionString);
                if (isExistIdPermit_Username) return JsonResultCommon.Trung("Username, Id_permit");

                var create = await _service.CreateAccountPermission(model, model.Edit);
                if (!create.Susscess)
                {
                    return JsonResultCommon.ThatBai(create.ErrorMessgage);
                }

                return JsonResultCommon.ThanhCong(model);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("UpdateAccountPermission")]
        public async Task<object> UpdateAccountPermssion(AccountRole model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select Username,Id_Permit from tbl_account_permit" +
                    $" where Username = '{model.Username}' and Id_Permit = '{model.Id_Permit}'";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Username, Id_Permit");

                var update = await _service.UpdateAccountPermission(model, model.Edit);
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
        [HttpPost("DeleteAccountPermssion")]
        public async Task<object> DeleteAccountPermssion(AccountRole model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select Username,Id_Permit from tbl_account_permit" +
                    $" where Username = '{model.Username}' and Id_Permit = '{model.Id_Permit}'";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Username, Id_Permit");

                var update = await _service.DeleteAccountPermission(model);
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
        public async Task<object> GetNoteLock(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var note = await _service.GetNoteLock(RowID);
                return JsonResultCommon.ThanhCong(note);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetFilterPartner")]
        public async Task<object> GetFilterPartner()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                if (!user.IsMasterAccount) return JsonResultCommon.BatBuoc("User phải là isMasterAccount");

                var list = await _partnerService.GetPartnerFilters();
                if (list is null)
                {
                    return JsonResultCommon.ThatBai("Danh sách rỗng");
                }
                return JsonResultCommon.ThanhCong(list);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
    }
}