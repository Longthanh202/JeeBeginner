using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DoiTacBaoHiemManagement;
using JeeBeginner.Services;
using Microsoft.AspNetCore.Mvc;
using static JeeBeginner.Models.Common.Panigator;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using JeeBeginner.Services.Authorization;
using JeeBeginner.Services.DoiTacBaoHiemManagement;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using JeeBeginner.Services.DoiTacBaoHiemManagement;
using Microsoft.AspNetCore.Http;
using System.Reflection;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/doitacbaohiemmanagement")]
    [ApiController]
    public class DoiTacBaoHiemManagementController : Controller
    {
        private readonly IDoiTacBaoHiemManagementService _service;
        private readonly ICustomAuthorizationService _authService;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;

        public DoiTacBaoHiemManagementController(IDoiTacBaoHiemManagementService doitacbaohiemManagementService, IConfiguration configuration, ICustomAuthorizationService authService)
        {
            _service = doitacbaohiemManagementService;
            _configuration = configuration;
            _authService = authService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
        }
        [HttpPost("DoiTacBaoHiemList")]
        public async Task<object> GetListDS_DoiTacBaoHiem([FromBody] QueryRequestParams query)
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
                string orderByStr = "Id_DV asc";
                string whereStr = "";
                conds.Add("DM_DoiTacBaoHiem.IsDisable", 0);
                //string partnerID = GeneralService.GetObjectDB($"select IdNhanHieu from DM_NhanHieu where IdNhanHieu = {user.Id}", _connectionString).ToString();
                if (user.IsMasterAccount)
                {
                }
                Dictionary<string, string> filter = new Dictionary<string, string>
                 {
                     {"Id_DV", "Id_DV" },
                     { "TenDonVi", "TenDonVi"},
                      { "DiaChi", "DiaChi"},
                       { "SoDT", "SoDT"},
                        { "NguoiLienHe", "NguoiLienHe"},
                         { "GhiChu", "GhiChu"},
                     { "IsDisable", "IsDisable"},
                 };
                if (query.Sort != null)
                {
                    if (!string.IsNullOrEmpty(query.Sort.ColumnName) && filter.ContainsKey(query.Sort.ColumnName))
                    {
                        ///abc
                        orderByStr = filter[query.Sort.ColumnName] + " " + (query.Sort.Direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ? "asc" : "desc");
                    }
                }
                //if (query.Filter != null)
                //{

                //    if (!string.IsNullOrEmpty(query.SearchValue))
                //    {
                //        //whereStr += $" TenNhanHieu like '%{query.SearchValue}%'";
                //        whereStr += $" (TenDonVi LIKE '%{query.SearchValue}%' OR SoDT LIKE '%{query.SearchValue}%' OR NguoiLienHe LIKE '%{query.SearchValue}%')";
                //    }
                //}
                if (query.Filter != null)
                {
                    if (!string.IsNullOrEmpty(query.SearchValue))
                    {
                        whereStr += $" (TenDonVi LIKE '%{query.SearchValue}%' OR SoDT LIKE '%{query.SearchValue}%' OR NguoiLienHe LIKE '%{query.SearchValue}%')";
                    }
                }
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
        [HttpPost("create-DoiTacBaoHiem")]
        public async Task<object> CreateDoiTacBaoHiem(DoiTacBaoHiemModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");
                var create = await _service.CreateDoiTacBaoHiem(model, user.Id);
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

        [HttpPost("update-DoiTacBaoHiem")]
        public async Task<object> UpdateDoiTacBaoHiem(DoiTacBaoHiemModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select Id_DV from DM_DoiTacBaoHiem where Id_DV = {model.Id_DV}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Loại mặt hàng");

                var update = await _service.UpdateDoiTacBaoHiem(model, user.Id);
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

        [HttpGet("GetDoiTacBaoHiemByRowID")]
        public async Task<object> GetDoiTacBaoHiemByRowID(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetOneModelByRowID(RowID);
                //if (create.Id_DV == 0)
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
        [HttpPost("delete-DoiTacBaoHiem")]
        public async Task<object> DeleteDoiTacBaoHiem(DoiTacBaoHiemModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select Id_DV from DM_DoiTacBaoHiem where Id_DV = {model.Id_DV}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Loại mặt hàng");

                var update = await _service.Delete(model, user.Id);
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

        [HttpPost("deletes-DoiTacBaoHiem")]
        public async Task<object> DeletesDoiTacBaoHiem(decimal[] ids)
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
        public async Task<object> ImportDVTFromExcel(IFormFile file)
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
