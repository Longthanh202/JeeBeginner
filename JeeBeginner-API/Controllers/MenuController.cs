using DpsLibs.Data;
using JeeAccount.Classes;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Reponsitories.Authorization;
using JeeBeginner.Services.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace JeeBeginner.Controllers
{
    [EnableCors("AllowOrigin")]
    [Route("api/menu")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _jwtSecret;
        private readonly string _connectionString;
        private readonly ICustomAuthorizationService _authService;

        public MenuController(IConfiguration configuration, ICustomAuthorizationService authService)
        {
            _authService = authService;
            _config = configuration;
            _jwtSecret = configuration.GetValue<string>("JWT:Secret");
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        #region Load menu

        /// <summary>
        /// Load menu
        /// </summary>
        /// <returns></returns>

        [Route("LayMenuChucNang")]
        [HttpGet]
        public object LayMenuChucNang()
        {
            ErrorModel error = new ErrorModel();
            //string Token = lc.GetHeader(Request);
            DataSet ds = new DataSet();
            string sql = ""; ;
            try
            {
                var user = Ulities.GetUserByHeader(HttpContext.Request.Headers, _jwtSecret);
                if (user is null)
                {
                    return Unauthorized(MessageReturnHelper.DangNhap());
                }
                string select_MainMenu = "", select_Menu = "", sql_listRole = "";
                SqlConditions cond = new SqlConditions();
                cond.Add("HienThi", 1);
                List<long> listrole = _authService.GetRules(user.Username);
                for (int i = 0; i < listrole.Count(); i++)
                {
                    sql_listRole += ",@IDRole" + i;
                    cond.Add("IDRole" + i, listrole[i]);
                }
                if (!"".Equals(sql_listRole)) sql_listRole = sql_listRole.Substring(1);
                if (listrole.Count() == 0)
                {
                    sql_listRole = "0";
                }
                //select menu
                //sql = $@"select title, Target, Summary, ALink, ISNULL(Icon, 'flaticon-interface-7') as Icon, '' as title_, position, Code
                //from Mainmenu  order by position
                //select title, AllowPermit, Target, Tbl_submenu.id_row, GroupName, ALink, Summary, AppLink, AppIcon, '' as title_ from Tbl_submenu  order by position";
                select_MainMenu = $@"
                            select code --,title, PermissionID, Target, Summary, isNULL(ALink, '#') as ALink, ISNULL(Icon, 'flaticon-interface-7') as Icon, '' as title_, position
                            from MainMenu 
                            where (PermissionID is not null and PermissionID in ({sql_listRole})) or  
                            (Hienthi is NULL
                            and code in (select distinct groupname from tbl_submenu where 
                             AllowPermit in ({sql_listRole}) or AllowPermit is NULL)) 
                            and Hienthi=@HienThi
                            --order by position  
                            ";
                //select menu sub
                select_Menu = $@"
select title, AllowPermit, Target, tbl_submenu.id_row,
GroupName, ALink, Summary, AppLink, AppIcon, '' as title_
from tbl_submenu 
where (AllowPermit IN ({sql_listRole}) or (AllowPermit is NULL))
and GroupName IN ({select_MainMenu})
and hienthi=@HienThi and ((CustemerID is null)) order by position 
";
                select_MainMenu = select_MainMenu
                    .Replace("--,title, PermissionID, Target, Summary, isNULL(ALink, '#') as ALink, ISNULL(Icon, 'flaticon-interface-7') as Icon", ",title, PermissionID, Target, Summary, isNULL(ALink, '#') as ALink, ISNULL(Icon, 'flaticon-interface-7') as Icon")
                    .Replace("--order by position", " order by position ");
                select_MainMenu += select_Menu;
                using (DpsConnection cnn = new DpsConnection(_connectionString))
                {
                    ds = cnn.CreateDataSet(select_MainMenu, cond);
                    if (ds.Tables.Count == 0) return JsonResultCommon.ThatBai("Không có dữ liệu", cnn.LastError);
                }
                var data = from r in ds.Tables[0].AsEnumerable()
                           select new
                           {
                               Code = r["Code"].ToString(),
                               Title = r["title"].ToString(),
                               Target = r["Target"],
                               Summary = r["Summary"].ToString(),
                               Icon = r["Icon"].ToString(),
                               ALink = r["ALink"].ToString(),
                               Child = from c in ds.Tables[1].AsEnumerable()
                                       where c["groupname"].ToString().Trim().ToLower().Equals(r["Code"].ToString().Trim().ToLower())
                                       select new
                                       {
                                           Title = c["title"].ToString(),
                                           Summary = c["Summary"].ToString(),
                                           AllowPermit = c["AllowPermit"].ToString(),
                                           Target = c["Target"].ToString(),
                                           GroupName = c["GroupName"].ToString(),
                                           ALink = c["ALink"].ToString(),
                                       },
                           };
                return JsonResultCommon.ThanhCong(data);
            }
            catch (Exception ex)
            {
                return JsonResultCommon.Exception(ex);
            }
        }
        #endregion Load menu
    }
}