using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.AccountManagement
{
    public class AccountManagementRepository : IAccountManagementRepository
    {
        private readonly string _connectionString;

        public AccountManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ReturnSqlModel> CreateAccount(AccountModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataAccount(model, CreatedBy);
                    int x = cnn.Insert(val, "AccountList");
                    if (x <= 0)
                    {
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION));
                    }
                }
                catch (Exception ex)
                {
                    return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
                }
            }
            return await Task.FromResult(new ReturnSqlModel());
        }

        private Hashtable InitDataAccount(AccountModel account, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("PartnerID", account.PartnerId);
            val.Add("Fullname", account.Fullname);
            val.Add("Mobile", account.Mobile);
            val.Add("Email", account.Email);
            val.Add("Username", account.Username);
            val.Add("Password", DpsLibs.Common.EncDec.Encrypt(account.Password, Constant.PASSWORD_ED));
            val.Add("IsLock", 0);
            //val.Add("Edit", 0);
            val.Add("Gender", account.Gender);
            val.Add("Note", account.Note);
            val.Add("IsMasterAccount", 0);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
            }
            return val;
        }

        public async Task<IEnumerable<AccountDTO>> GetAll(SqlConditions conds, string orderByStr)
        {
            DataTable dt = new DataTable();
            string sql = "";
            if (conds.Count == 0)
            {
                sql = $@"select AccountList.*, PartnerList.PartnerName 
                        from AccountList
                        join PartnerList 
                        on AccountList.PartnerID = PartnerList.RowID 
                        order by {orderByStr}";
            }
            else
            {
                sql = $@"select AccountList.*, PartnerList.PartnerName 
                        from AccountList
                        join PartnerList 
                        on AccountList.PartnerID = PartnerList.RowID 
                        where (where) order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new AccountDTO
                {
                    Username = row["Username"].ToString(),
                    Fullname = row["Fullname"].ToString(),
                    Mobile = row["Mobile"].ToString(),
                    IsLock = Convert.ToBoolean((bool)row["IsLock"]),
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    PartnerName = row["PartnerName"].ToString(),
                    LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<IEnumerable<AccountDTO>> GetAllAccounts(SqlConditions conds, string orderByStr)
        {
            DataTable dt = new DataTable();
            string sql = "";
            if (conds.Count == 0)
            {
                sql = $@"select AccountList.*, PartnerList.PartnerName 
                        from AccountList
                        join PartnerList 
                        on AccountList.PartnerID = PartnerList.RowID 
                        order by {orderByStr}";
            }
            else
            {
                sql = $@"select AccountList.*, PartnerList.PartnerName 
                        from AccountList
                        join PartnerList 
                        on AccountList.PartnerID = PartnerList.RowID 
                        where (where) order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new AccountDTO
                {
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    Fullname = row["Fullname"].ToString(),
                    Mobile = row["Mobile"].ToString(),
                    Email = row["Email"].ToString(),
                    Username = row["Username"].ToString(),                                  
                    //IsLock = Convert.ToBoolean((bool)row["IsLock"]),                   
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<AccountModel> GetOneModelByRowID(int RowID)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("RowID", RowID);
            string sql = @"select * from AccountList where RowID = @RowID";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                string Username = dt.Rows[0]["Username"].ToString();
                string Password = DpsLibs.Common.EncDec.Decrypt(dt.Rows[0]["Password"].ToString(), Constant.PASSWORD_ED);
                var result = dt.AsEnumerable().Select(row => new AccountModel
                {
                    Gender = row["Gender"].ToString(),
                    Fullname = row["Fullname"].ToString(),
                    Email = row["Email"].ToString(),
                    Mobile = row["Mobile"].ToString(),
                    Note = row["Note"].ToString(),
                    PartnerId = Int32.Parse(row["PartnerId"].ToString()),
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    Username = Username,
                    Password = Password
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        public async Task<ReturnSqlModel> UpdateAccount(AccountModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("RowID", model.RowId);
                    val = InitDataAccount(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "AccountList");
                    if (x <= 0)
                    {
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                    }
                }
                catch (Exception ex)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
                }
            }
            return await Task.FromResult(new ReturnSqlModel());
        }
        public async Task<string> GetNoteLock(long RowID)
        {
            DataTable dt = new DataTable();
            SqlConditions conds = new SqlConditions();
            conds.Add("RowID", RowID);
            string result = "";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                string sql = "select LockedNote, UnlockedNote, IsLock from AccountList where RowID = @RowID";
                dt = await cnn.CreateDataTableAsync(sql, conds);
                bool isLock = (bool)dt.Rows[0]["IsLock"];
                if (isLock)
                {
                    result = dt.Rows[0]["UnlockedNote"].ToString();
                }
                else
                {
                    result = dt.Rows[0]["LockedNote"].ToString();
                }
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> UpdateStatusAccount(AccountStatusModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("RowID", model.RowID);
                    if (model.IsLock)
                    {
                        val.Add("IsLock", 0);
                        val.Add("UnlockedNote", model.Note);
                        val.Add("UnlockedBy", CreatedBy);
                        val.Add("UnlockedDate", DateTime.UtcNow);
                    }
                    else
                    {
                        val.Add("IsLock", 1);
                        val.Add("LockedNote", model.Note);
                        val.Add("LockedBy", CreatedBy);
                        val.Add("LockedDate", DateTime.UtcNow);
                    }
                    int x = cnn.Update(val, conds, "AccountList");
                    if (x <= 0)
                    {
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                    }
                }
                catch (Exception ex)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
                }
            }
            return await Task.FromResult(new ReturnSqlModel());
        }
    }
}