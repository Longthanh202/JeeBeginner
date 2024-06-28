using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiTaiSanManagement;
using JeeBeginner.Services;
using Microsoft.AspNetCore.Mvc;
using static JeeBeginner.Models.Common.Panigator;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using JeeBeginner.Services.Authorization;
using JeeBeginner.Services.LoaiTaiSanManagement;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using JeeBeginner.Services.LoaiTaiSanManagement;
using Microsoft.AspNetCore.Http;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/loaitaisanmanagement")]
    [ApiController]
    public class LoaiTaiSanManagementController : Controller
    {
        private readonly ILoaiTaiSanManagementService _service;
        private readonly ICustomAuthorizationService _authService;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;

        public LoaiTaiSanManagementController(ILoaiTaiSanManagementService LoaiTaiSanManagementService, IConfiguration configuration, ICustomAuthorizationService authService)
        {
            _service = LoaiTaiSanManagementService;
            _configuration = configuration;
            _authService = authService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
        }
        [HttpPost("LoaiTaiSanList")]
        public async Task<object> GetListDS_LoaiTaiSan([FromBody] QueryRequestParams query)
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
                string orderByStr = "IdLoaiTS asc";
                string whereStr = "";
                conds.Add("TS_DM_LoaiTS.TrangThai", 0);
                //string partnerID = GeneralService.GetObjectDB($"select IdLoaiTS from TS_DM_LoaiTS where IdLoaiTS = {user.Id}", _connectionString).ToString();
                if (user.IsMasterAccount)
                {
                }
                Dictionary<string, string> filter = new Dictionary<string, string>
                 {
                     {"IdLoaiTS", "IdLoaiTS" },
                        { "MaLoai", "MaLoai"},
                     { "TenLoai", "TenLoai"},
                     { "TrangThai", "TrangThai"},
                  
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
                    if (!string.IsNullOrEmpty(query.SearchValue))
                    {
                        whereStr += $" (MaLoai LIKE '%{query.SearchValue}%' OR TenLoai LIKE N'%{query.SearchValue}%')";
                    }
                }
                //if (query.Filter != null)
                //{
                //    if (query.Filter.ContainsKey("keyword"))
                //    {
                //        var keyword = query.Filter["keyword"];
                //        if (!string.IsNullOrEmpty(query.Filter["keyword"]))
                //        {
                //            whereStr += @" and (TenLMH like @kw )";
                //            conds.Add("kw", "%" + query.Filter["keyword"].Trim() + "%");
                //        }
                //    }
                //    if (query.Filter.ContainsKey("TenLMH"))
                //    {
                //        if (!string.IsNullOrEmpty(query.Filter["TenLMH"]))
                //        {
                //            whereStr += $@" and (TenLMH like N'%{query.Filter["TenLMH"].Trim()}%')";
                //        }
                //    }
                //    if (query.Filter.ContainsKey("DoUuTien"))
                //    {
                //        if (!string.IsNullOrEmpty(query.Filter["DoUuTien"]))
                //        {
                //            whereStr += $@" and (DoUuTien like '%{query.Filter["DoUuTien"].Trim()}%')";
                //        }
                //    }
                //    if (query.Filter.ContainsKey("TenLMHParent"))
                //    {
                //        if (!string.IsNullOrEmpty(query.Filter["TenLMHParent"]))
                //        {
                //            whereStr += $@" and (TenLMHParent like N'%{query.Filter["TenLMHParent"].Trim()}%')";
                //        }
                //    }
                //}
                bool Visible = true;
                Visible = !_authService.IsReadOnlyPermit("1", user.Username);
                var customerlist = await _service.GetAll(conds, orderByStr, whereStr);
                if (customerlist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (customerlist is null)
                    return JsonResultCommon.KhongTonTai();
                int total = customerlist.Count();
                //pageModel.TotalCount = customerlist.Count();
                //pageModel.AllPage = (int)Math.Ceiling(total / (decimal)query.record);
                //pageModel.Size = query.record;
                //pageModel.Page = query.page;
                //customerlist = customerlist.AsEnumerable().Skip((query.Panigator.PageIndex - 1) * query.Panigator.PageSize).Take(query.Panigator.PageSize);
                //return JsonResultCommon.ThanhCong(customerlist , pageModel , Visible);



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
        [HttpPost("create-LoaiTaiSan")]
        public async Task<object> CreateLoaiTaiSan(LoaiTaiSanModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                var create = await _service.CreateLoaiTaiSan(model, user.Id);
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

        [HttpPost("update-LoaiTaiSan")]
        public async Task<object> UpdateLoaiTaiSan(LoaiTaiSanModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select IdLoaiTS from TS_DM_LoaiTS where IdLoaiTS = {model.IdLoaiTS}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Loại mặt hàng");

                var update = await _service.UpdateLoaiTaiSan(model, user.Id);
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

        [HttpGet("GetLoaiTaiSanByRowID")]
        public async Task<object> GetLoaiTaiSanByRowID(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetOneModelByRowID(RowID);
                //if (create.IdLoaiTS == 0)
                //{
                //    return JsonResultCommon.KhongTonTai("Loại mặt hàng");
                //}

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpPost("delete-LoaiTaiSan")]
        public async Task<object> DeleteLoaiTaiSan(LoaiTaiSanModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select IdLoaiTS from TS_DM_LoaiTS where IdLoaiTS = {model.IdLoaiTS}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Loại tài sản");
                if (model.TrangThai == true)
                {
                    return JsonResultCommon.Trung(model);
                }
                else
                {
                    var update = await _service.Delete(model, user.Id);
                    if (!update.Susscess)
                    {
                        return JsonResultCommon.ThatBai(update.ErrorMessgage);
                    }
                }

                return JsonResultCommon.ThanhCong(model);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("deletes-LoaiTaiSan")]
        public async Task<object> DeletesLoaiTaiSan(decimal[] ids)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var update = await _service.Deletes(ids, user.Id);
                if (!update.Susscess)
                {
                    return JsonResultCommon.ThatBai(update.ErrorMessgage);
                }
                return JsonResultCommon.ThanhCong(ids);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpPost("import")]
        public async Task<object> ImportLTSFromExcel(IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return JsonResultCommon.ThatBai("Vui lòng chọn file cần import");
                }
                bool result = await _service.ImportDoiTacBaoHiemFromExcel(file, 66621);
                if (result == false)
                {
                    return JsonResultCommon.ThatBai("Lỗi định dạng file Excel");
                }

                return JsonResultCommon.ThanhCong();
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }

        [HttpGet("tai-file-mau")]
        public async Task<object> ExportToExcel()
        {
            try
            {
                //var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                //if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var update = await _service.TaiFileMau();

                return update;
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpGet("IsReadOnlyPermitAccountRole")]
        public async Task<object> IsReadOnlyPermitAccountRole(string roleName)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                bool Visible = true;
                Visible = !_authService.IsReadOnlyPermit(roleName, user.Username);
                return Visible;
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
    }
}
