using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.TaikhoanManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.TaikhoanManagement
{
    public class TaikhoanManagementRepository : ITaikhoanManagementRepository
    {
        private readonly string _connectionString;

        public TaikhoanManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ReturnSqlModel> CreateTaikhoan(TaikhoanModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataTaikhoan(model, CreatedBy);
                    int x = cnn.Insert(val, "TaikhoanList");
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

        private Hashtable InitDataTaikhoan(TaikhoanModel Taikhoan, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("PartnerID", Taikhoan.PartnerId);
            val.Add("Fullname", Taikhoan.Fullname);
            val.Add("Mobile", Taikhoan.Mobile);
            val.Add("Email", Taikhoan.Email);
            val.Add("Username", Taikhoan.Username);
            val.Add("Password", DpsLibs.Common.EncDec.Encrypt(Taikhoan.Password, Constant.PASSWORD_ED));
            val.Add("IsLock", 0);
            val.Add("Gender", Taikhoan.Gender);
            val.Add("Note", Taikhoan.Note);
            val.Add("IsMasterAccount", 0);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
            }
            return val;
        }


        public async Task<TaikhoanModel> GetOneModelByRowID(int RowID)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("RowID", RowID);
            string sql = @"select * from TaikhoanList where RowID = @RowID";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                string Username = dt.Rows[0]["Username"].ToString();
                string Password = DpsLibs.Common.EncDec.Decrypt(dt.Rows[0]["Password"].ToString(), Constant.PASSWORD_ED);
                var result = dt.AsEnumerable().Select(row => new TaikhoanModel
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

        public async Task<ReturnSqlModel> UpdateTaikhoan(TaikhoanModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("RowID", model.RowId);
                    val = InitDataTaikhoan(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "TaikhoanList");
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
                string sql = "select LockedNote, UnlockedNote, IsLock from TaikhoanList where RowID = @RowID";
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
        public async Task<ReturnSqlModel> UpdateStatusTaikhoan(TaikhoanStatusModel model, long CreatedBy)
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
                    int x = cnn.Update(val, conds, "TaikhoanList");
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

        public async Task<IEnumerable<TaikhoanDTO>> GetAll(SqlConditions conds, string orderByStr)
        {
            DataTable dt = new DataTable();
            string sql = "";
            if (conds.Count == 0)
            {
                sql = $@"select TaikhoanList.*, PartnerList.PartnerName 
                        from TaikhoanList
                        join PartnerList 
                        on TaikhoanList.PartnerID = PartnerList.RowID 
                        order by {orderByStr}";
            }
            else
            {
                sql = $@"select TaikhoanList.*, PartnerList.PartnerName 
                        from TaikhoanList
                        join PartnerList 
                        on TaikhoanList.PartnerID = PartnerList.RowID 
                        where (where) order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new TaikhoanDTO
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
    }
}