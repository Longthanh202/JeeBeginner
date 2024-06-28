using DpsLibs.Data;
using JeeAccount.Classes;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.UserModel;
using JeeBeginner.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.Authorization
{
    public class AuthorizationRepository : IAuthorizationRepository
    {
        private readonly string _connectionString;
        public AuthorizationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<User> GetUser(string Username, string Password)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Password = DpsLibs.Common.EncDec.Encrypt(Password, Constant.PASSWORD_ED);
            Conds.Add("Username", Username);
            Conds.Add("Password", Password);
            string sql = @$"select * from AccountList 
                            where Username = '{Username}' 
                            and Password = '{Password}'";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                List<long> Rules = GetRules(Username);
                string list_rules = "";
                if (Rules.Count() > 0)
                {
                    foreach (var rule in Rules)
                    {
                        list_rules += "," + rule;
                    }
                    list_rules = list_rules.Substring(1);
                }
                if (dt.Rows.Count == 0) throw new KhongCoDuLieuException("tài khoản hoặc mật khẩu");
                var reuslt = dt.AsEnumerable().Select(row => new User
                {
                    Role = list_rules,
                    Id = Int32.Parse(row["RowID"].ToString()),
                    Username = Username,
                    IsMasterAccount = Convert.ToBoolean((bool)row["IsMasterAccount"]),
                    IsLock = (bool)row["IsLock"],
                }).SingleOrDefault();
                bool check = (bool)cnn.ExecuteScalar($"select IsLock from PartnerList where RowID = {dt.Rows[0]["PartnerID"]}");
                if (check)
                {
                    reuslt.Id = -1;
                }
                return reuslt;
            }
        }
        public async Task<ReturnSqlModel> UpdateLastLogin(long CreatedBy)
        {
            SqlConditions Conds = new SqlConditions();
            Conds.Add("RowID", CreatedBy);
            Hashtable val = new Hashtable();
            val.Add("LastLogin", DateTime.UtcNow);
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                var x = cnn.Update(val, Conds, "AccountList");
                if (x <= 0)
                {
                    return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                }
                return await Task.FromResult(new ReturnSqlModel());
            }
        }
        public void ChangePassword(ChangePasswordModel model)
        {
            SqlConditions Conds = new SqlConditions();
            Conds.Add("Username", model.Username);
            Hashtable val = new Hashtable();
            string passwordEnc = DpsLibs.Common.EncDec.Encrypt(model.PaswordNew, Constant.PASSWORD_ED);
            val.Add("Password", passwordEnc);
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                var x = cnn.Update(val, Conds, "AccountList");
                if (x <= 0)
                {
                    throw cnn.LastError;
                }
            }
        }
        /// <summary>
        /// Chỉ lấy tất cả quyền của user
        /// </summary>
        /// <param name="IdUser"></param>
        /// <returns></returns>
        public List<long> GetRules(string username)
        {
            DataTable Tb = null;
            SqlConditions Conds = new SqlConditions();
            Conds.Add("Username", username);
            var slist = new List<long>();
            using (DpsConnection Conn = new DpsConnection(_connectionString))
            {
                Tb = Conn.CreateDataTable("select * from Tbl_Account_Permit where (where)", "(where)", Conds);
                DataTable quyennhom = Conn.CreateDataTable("select Id_permit from tbl_group_permit gp inner join tbl_group_account gu on gp.id_group=gu.id_group where (where)", "(where)", Conds);
                if (Tb == null)
                    return null;
                foreach (DataRow r in Tb.Rows)
                {
                    slist.Add(long.Parse(r["Id_permit"].ToString()));
                }
                foreach (DataRow r in quyennhom.Rows)
                {
                    slist.Add(long.Parse(r["Id_permit"].ToString()));
                }
            }
            return slist;
        }
        public bool IsReadOnlyPermit(string roleName, string username)
        {
            SqlConditions Conds = new SqlConditions();
            Conds.Add("Id_permit", roleName);
            Conds.Add("Username", username);
            using (DpsConnection Conn = new DpsConnection(_connectionString))
            {
                DataTable Tb = Conn.CreateDataTable("select Edit from Tbl_Account_Permit where (where)", "(where)", Conds);
                if ((Tb.Rows.Count > 0) && (bool.FalseString.Equals(Tb.Rows[0][0].ToString())))
                {
                    return true;
                }
                Tb = Conn.CreateDataTable("select Id_permit, Edit from tbl_group_permit gp inner join tbl_group_account gu on gp.id_group=gu.id_group where (where) order by Edit desc", "(where)", Conds);
                if ((Tb.Rows.Count > 0) && (bool.FalseString.Equals(Tb.Rows[0][1].ToString())))
                {
                    return true;
                }
                return false;
            }
        }
    }
}