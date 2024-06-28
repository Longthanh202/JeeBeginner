using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Services.Authorization;
using JeeBeginner.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static JeeBeginner.Models.Common.Panigator;
using System.Collections.Generic;
using Microsoft.Net.Http.Headers;
using System.Threading.Tasks;
using System;
using JeeBeginner.Services.LoaiMatHangManagement;
using Microsoft.AspNetCore.Cors;
using System.Linq;
using JeeBeginner.Models.LoaiMatHangManagement;
using JeeBeginner.Models.XuatXuManagement;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Aspose.Imaging;
using DPSinfra.UploadFile;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/loaimathangmanagement")]
    [ApiController]
    public class LoaiMatHangManagementController : ControllerBase
    {
        private readonly ILoaiMatHangManagementService _service;
        private readonly ICustomAuthorizationService _authService;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _jwtSecret;

        public LoaiMatHangManagementController(ILoaiMatHangManagementService loaimathangManagementService, IConfiguration configuration, ICustomAuthorizationService authService)
        {
            _service = loaimathangManagementService;
            _configuration = configuration;
            _authService = authService;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
        }

        //[HttpPost("LoaiMatHangList")]
        //public async Task<object> GetListDS_LoaiMatHang([FromBody] QueryRequestParams query)
        //{
        //    try
        //    {
        //        var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
        //        if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

        //        query = query == null ? new QueryRequestParams() : query;
        //        BaseModel<object> model = new BaseModel<object>();
        //        PageModel pageModel = new PageModel();
        //        ErrorModel error = new ErrorModel();
        //        SqlConditions conds = new SqlConditions();
        //        string orderByStr = " TenLMH asc";
        //        string whereStr = "";
        //        conds.Add("PartnerList.IsLock", 0);
        //        string partnerID = GeneralService.GetObjectDB($"select PartnerID from AccountList where RowID = {user.Id}", _connectionString).ToString();
        //        if (user.IsMasterAccount)
        //        {
        //        }
        //        else
        //        {
        //            conds.Add("AccountList.IsLock", partnerID);
        //        }


        //        Dictionary<string, string> _sortableFields = new Dictionary<string, string>
        //            {
        //                { "TenLMH", "TenLMH"},
        //                 { "MaLMH", "MaLMH"},
        //                { "IdLMHParent", "IdLMHParent"},
        //                 { "TenLMH", "TenLMH"},
        //                     { "TenLMHParent", "TenLMHParent"},
        //                { "DoUuTien", "DoUuTien"},
        //                { "IdKho", "IdKho"},
        //            };

        //        if (query.Sort != null)
        //        {
        //            if (!string.IsNullOrEmpty(query.Sort.ColumnName) && _sortableFields.ContainsKey(query.Sort.ColumnName))
        //            {
        //                orderByStr = _sortableFields[query.Sort.ColumnName] + " " + (query.Sort.Direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ? "asc" : "desc");
        //            }
        //        }
        //        //if (!string.IsNullOrEmpty(query.Filter["keyword"]))
        //        //{
        //        //    whereStr += @" and (TenLMH like @kw )";
        //        //    conds.Add("kw", "%" + query.Filter["keyword"].Trim() + "%");
        //        //}
        //        //if (query.Filter != null)
        //        //{
        //        //    if (query.Filter.ContainsKey("keyword"))
        //        //    {
        //        //        var keyword = query.Filter["keyword"];
        //        //        if (!string.IsNullOrEmpty(query.Filter["keyword"]))
        //        //        {
        //        //            whereStr += @" and (TenLMH like @kw )";
        //        //            conds.Add("kw", "%" + query.Filter["keyword"].Trim() + "%");
        //        //        }
        //        //    }
        //        //    if (query.Filter.ContainsKey("TenLMH"))
        //        //    {
        //        //        if (!string.IsNullOrEmpty(query.Filter["TenLMH"]))
        //        //        {
        //        //            whereStr += $@" and (TenLMH like N'%{query.Filter["TenLMH"].Trim()}%')";
        //        //        }
        //        //    }
        //        //    if (query.Filter.ContainsKey("DoUuTien"))
        //        //    {
        //        //        if (!string.IsNullOrEmpty(query.Filter["DoUuTien"]))
        //        //        {
        //        //            whereStr += $@" and (DoUuTien like '%{query.Filter["DoUuTien"].Trim()}%')";
        //        //        }
        //        //    }
        //        //    if (query.Filter.ContainsKey("TenLMHParent"))
        //        //    {
        //        //        if (!string.IsNullOrEmpty(query.Filter["TenLMHParent"]))
        //        //        {
        //        //            whereStr += $@" and (TenLMHParent like N'%{query.Filter["TenLMHParent"].Trim()}%')";
        //        //        }
        //        //    }
        //        //}




        //        bool Visible = true;
        //        Visible = !_authService.IsReadOnlyPermit("1", user.Username);
        //        var customerlist = await _service.GetAll(conds, orderByStr, whereStr);
        //        if (customerlist.Count() == 0)
        //            return JsonResultCommon.ThatBai("Không có dữ liệu");
        //        if (customerlist is null)
        //            return JsonResultCommon.KhongTonTai();


        //        pageModel.TotalCount = customerlist.Count();
        //        pageModel.AllPage = (int)Math.Ceiling(customerlist.Count() / (decimal)query.Panigator.PageSize);
        //        pageModel.Size = query.Panigator.PageSize;
        //        pageModel.Page = query.Panigator.PageIndex;
        //        customerlist = customerlist.AsEnumerable().Skip((query.Panigator.PageIndex - 1) * query.Panigator.PageSize).Take(query.Panigator.PageSize);
        //        return JsonResultCommon.ThanhCong(customerlist, pageModel, Visible);
        //    }
        //    catch (Exception ex)
        //    {
        //        return JsonResultCommon.Exception(ex);
        //    }
        //}

        [HttpPost("LoaiMatHangList")]
        public async Task<object> GetListDS_LoaiMatHang([FromBody] QueryRequestParams query)
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
                string orderByStr = "a.IdLMH asc";
                string whereStr = "";
                //conds.Add("DM_LoaiMatHang.isDel", 0);
                //string partnerID = GeneralService.GetObjectDB($"select idLMH from DM_LoaiMatHang where idLMH = {user.Id}", _connectionString).ToString();
                if (user.IsMasterAccount)
                {
                }
                Dictionary<string, string> filter = new Dictionary<string, string>
                 {
                     {"IdLMH", "IdLMH" },
                     { "TenLMH", "TenLMH"},
                     { "DoUuTien", "DoUuTien"},
                     { "Mota", "Mota"},
                     {"IdKho", "IdKho" },
                      {"TenLMHParent", "TenLMHParent" },
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
                        whereStr += $" (a.TenLMH LIKE '%{query.SearchValue}%' OR a.DoUuTien LIKE N'%{query.SearchValue}%' OR a.Mota LIKE N'%{query.SearchValue}%'OR b.TenLMH LIKE N'%{query.SearchValue}%')";
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
                var customerlist = await  _service.GetAll(conds, orderByStr, whereStr);
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

        [HttpPost("create-loaimathang")]
        public async Task<object> CreateLoaiMatHang(LoaiMatHangModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                
                                           
                var create = await _service.CreateLoaiMatHang(model, user.Id);
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

        [HttpPost("update-loaimathang")]
        public async Task<object> UpdateLoaiMatHang(LoaiMatHangModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                string sqlCheckCode = $"select IdLMH from DM_LoaiMatHang where IdLMH = {model.IdLMH}";
                bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                if (!isExist)
                    if (!isExist) return JsonResultCommon.KhongTonTai("Loại mặt hàng");

                var update = await _service.UpdateLoaiMatHang(model, user.Id);
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

        [HttpGet("GetLoaiMatHangByRowID")]
        public async Task<object> GetTaiKhoanByRowID(int RowID)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetOneModelByRowID(RowID);
                //if (create.IdLMH == 0)
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
        [HttpGet("GetKhoID")]
        public async Task<object> GetKhoID(int IdK)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetKhoID(IdK);
                if (create.IdKho == 0)
                {
                    return JsonResultCommon.KhongTonTai("Loại mặt hàng");
                }

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpGet("GetLoaiMHChaID")]
        public async Task<object> GetLoaiMHChaID(int IdLMHParent)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var create = await _service.GetLoaiMHChaID(IdLMHParent);
                if (create.IdLMHParent == 0)
                {
                    return JsonResultCommon.KhongTonTai("Loại mặt hàng");
                }

                return JsonResultCommon.ThanhCong(create);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpGet("DM_Kho_List")]
        public async Task<object> DM_Kho_List()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var dmKholist = await _service.DM_Kho_List();
                if (dmKholist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (dmKholist is null)
                    return JsonResultCommon.KhongTonTai();
                return JsonResultCommon.ThanhCong(dmKholist);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        [HttpGet("LoaiMatHangCha_List")]
        public async Task<object> LoaiMatHangCha_List()
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                var lmhclist = await _service.LoaiMatHangCha_List();
                if (lmhclist.Count() == 0)
                    return JsonResultCommon.ThatBai("Không có dữ liệu");
                if (lmhclist is null)
                    return JsonResultCommon.KhongTonTai();
                return JsonResultCommon.ThanhCong(lmhclist);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }


        [HttpPost("delete-LoaiMatHang")]
        public async Task<object> DeleteLoaiMatHang(LoaiMatHangModel model)
        {
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null) return JsonResultCommon.BatBuoc("Đăng nhập");

                //string sqlCheckCode = $"select IdXuatXu from DM_XuatXu where IdXuatXu = {model.IdXuatXu}";
                //bool isExist = GeneralService.IsExistDB(sqlCheckCode, _connectionString);
                //if (!isExist)
                //    if (!isExist) return JsonResultCommon.KhongTonTai("Loại mặt hàng");

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

        [HttpPost("deletes-LoaiMatHang")]
        public async Task<object> DeletesLoaiMatHang(decimal[] ids)
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
        [HttpPost("Upload")]
        public async Task<object> Upload(IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    //var filePath = Path.Combine(@"D:\Thực tập\3-5-xuatfile\JeeBeginner-main\JeeBeginner-BE\JeeBeginner\src\assets\media\Img\", file.FileName);

                    var currentDirectory = Directory.GetCurrentDirectory();
                    var parentDirectory = Directory.GetParent(currentDirectory)?.FullName;
                    if (parentDirectory == null)
                    {
                        return JsonResultCommon.ThatBai("Failed to get parent directory.");
                    }

                    //var uploadsFolder = Path.Combine(parentDirectory, "JeeBeginner-BE", "JeeBeginner", "src", "assets", "media", "Img");
                    var uploadsFolder = Path.Combine(parentDirectory, "JeeBeginner-API", "img");
                    var filePath = Path.Combine(uploadsFolder, file.FileName);
                    if (System.IO.File.Exists(filePath))
                    {
                        return JsonResultCommon.ThatBai("File with the same name already exists.");
                    }
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    return JsonResultCommon.ThanhCong(filePath);
                }
                else
                {
                    return BadRequest("No file uploaded.");
                }
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
