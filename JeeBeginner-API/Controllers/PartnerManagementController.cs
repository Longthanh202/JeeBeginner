using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PartnerManagement;
using JeeBeginner.Services;
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
    [Route("api/partnermanagement")]
    [ApiController]
    public class PartnerManagementController : ControllerBase
    {
        private IPartnerManagementService _service;
        private string _connectionString;
        private readonly string _jwtSecret;

        public PartnerManagementController(IPartnerManagementService service, IConfiguration configuration)
        {
            _service = service;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
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
                string orderByStr = "PartnerList.RowID asc";
                string whereStr = "";
                Dictionary<string, string> filter = new Dictionary<string, string>
                        {
                            {"stt", "PartnerList.RowID" },
                            { "code", "PartnerList.Code"},
                            { "tendoitac", "PartnerList.PartnerName"},
                            { "tinhtrang", "PartnerList.IsLock"},
                        };
                if (query.Sort != null)
                {
                    if (!string.IsNullOrEmpty(query.Sort.ColumnName) && filter.ContainsKey(query.Sort.ColumnName))
                    {
                        orderByStr = filter[query.Sort.ColumnName] + " " + (query.Sort.Direction.ToLower().Equals("asc") ? "asc" : "desc");
                    }
                }
                if (query.Filter != null)
                {
                    if (query.Filter.ContainsKey("status"))
                    {
                        var status = query.Filter["status"];
                        if (!status.Equals("-1"))
                        {
                            if (!string.IsNullOrEmpty(whereStr)) whereStr += " and ";
                            whereStr += $" PartnerList.IsLock = {status}";
                        }
                    }

                    if (!string.IsNullOrEmpty(query.SearchValue))
                    {
                        if (!string.IsNullOrEmpty(whereStr)) whereStr += " and ";
                        whereStr += $" PartnerList.PartnerName like '%{query.SearchValue}%'";
                    }
                }

                var customerlist = await _service.GetAll(whereStr, orderByStr);
                if (customerlist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (customerlist is null)
                    return JsonResultCommon.KhongTonTai();
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

        [HttpPost("createPartner")]
        public async Task<object> CreatePartner(PartnerModel partnerModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select Code from PartnerList where code = '{partnerModel.Code}'";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (isExist)
                    return JsonResultCommon.Trung("Code");
                string sqlCheckUsername = $"select Username from AccountList where Username = '{partnerModel.Username}'";
                bool isExistUsername = GeneralService.IsExistDB(sqlCheckUsername, _connectionString);
                if (isExistUsername)
                    return JsonResultCommon.Trung("Username");

                var create = await _service.CreatePartner(partnerModel, user.Id);
                if (!create.Susscess)
                {
                    return JsonResultCommon.ThatBai(create.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(partnerModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("updatePartner")]
        public async Task<object> UpdatePartner(PartnerModel partnerModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select RowId from PartnerList where RowId = {partnerModel.RowId}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return JsonResultCommon.KhongTonTai("Partner");

                var update = await _service.UpdatePartner(partnerModel, user.Id);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(partnerModel);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("GetPartnerByRowID")]
        public async Task<object> GetPartnerByRowID(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetOneModelByRowID(RowID);
                if (create.ParentID == 0)
                {
                    return JsonResultCommon.KhongTonTai("Partner RowID");
                }
                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("UpdateStatus")]
        public async Task<object> UpdateStatus(AccountStatusModel accountModel)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select RowId from PartnerList where RowId = {accountModel.RowID}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    return JsonResultCommon.KhongTonTai("Partner");

                var update = await _service.UpdateStatus(accountModel, user.Id);
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
    }
}