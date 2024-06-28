using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PartnerManagement;
using JeeBeginner.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.PartnerManagement
{
    public class PartnerManagementRepository : IPartnerManagementRepository
    {
        private readonly string _connectionString;

        public PartnerManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ReturnSqlModel> CreatePartner(PartnerModel partnerModel, long CreatedBy)
        {
            var result = new ReturnSqlModel();
            Hashtable val = new Hashtable();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    #region val data

                    DateTime jondate = DateTime.ParseExact(partnerModel.JoinDate, "dd/MM/yyyy", null);
                    val = InitPartnerModel(val, partnerModel, jondate, CreatedBy);

                    #endregion val data

                    cnn.BeginTransaction();
                    int x = cnn.Insert(val, "PartnerList");
                    if (x <= 0)
                    {
                        cnn.RollbackTransaction();
                        cnn.EndTransaction();
                        result = new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL);
                        return await Task.FromResult(result);
                    }
                    Hashtable val2 = new Hashtable();
                    int PartnerID = Int32.Parse(cnn.ExecuteScalar("SELECT IDENT_CURRENT ('PartnerList') AS Current_Identity;").ToString());
                    val2 = InitPartnerAccount(val2, partnerModel, PartnerID, CreatedBy);
                    int y = cnn.Insert(val2, "AccountList");
                    if (y <= 0)
                    {
                        cnn.RollbackTransaction();
                        cnn.EndTransaction();
                        result = new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL);
                        return await Task.FromResult(result);
                    }
                    cnn.EndTransaction();
                    return await Task.FromResult(result);
                }
                catch (Exception ex)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    result = new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION);
                    return await Task.FromResult(result);
                }
            }
        }

        private Hashtable InitPartnerModel(Hashtable val, PartnerModel partnerModel, DateTime jondate, long CreatedBy, bool isUpdate = false)
        {
            val.Add("PartnerName", partnerModel.PartnerName);
            val.Add("Code", partnerModel.Code);
            val.Add("ContactName", partnerModel.ContactName);
            val.Add("ContactPhone", partnerModel.ContactPhone);
            val.Add("ContactEmail", partnerModel.ContactEmail);
            val.Add("JoinDate", jondate);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
                val.Add("IsLock", 0);
            }
            if (!string.IsNullOrEmpty(partnerModel.Note))
            {
                val.Add("Note", partnerModel.Note);
            }
            return val;
        }

        private Hashtable InitPartnerAccount(Hashtable val, PartnerModel partnerModel, int PartnerID, long CreatedBy, bool isUpdate = false)
        {
            val.Add("PartnerID", PartnerID);
            val.Add("Username", partnerModel.Username);
            val.Add("Password", DpsLibs.Common.EncDec.Encrypt(partnerModel.Password, Constant.PASSWORD_ED));
            val.Add("Fullname", partnerModel.ContactName);
            val.Add("Mobile", partnerModel.ContactPhone);
            val.Add("Email", partnerModel.ContactEmail);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
            }
            val.Add("IsMasterAccount", 0);
            val.Add("IsLock", 0);
            if (!string.IsNullOrEmpty(partnerModel.Note))
            {
                val.Add("Note", partnerModel.Note);
            }
            val.Add("RoleID", 2);
            return val;
        }

        public async Task<ReturnSqlModel> UpdatePartner(PartnerModel partnerModel, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    string Username_old = cnn.ExecuteScalar(@$"select AccountList.Username from PartnerList
join AccountList on AccountList.PartnerID = PartnerList.RowID
where PartnerList.RowID = {partnerModel.RowId}").ToString();

                    conds.Add("RowID", partnerModel.RowId);

                    #region val data

                    DateTime jondate = DateTime.ParseExact(partnerModel.JoinDate, "dd/MM/yyyy", null);

                    val = InitPartnerModel(val, partnerModel, jondate, CreatedBy, true);

                    #endregion val data

                    cnn.BeginTransaction();
                    int x = cnn.Update(val, conds, "PartnerList");
                    if (x <= 0)
                    {
                        cnn.RollbackTransaction();
                        cnn.EndTransaction();
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                    }
                    Hashtable val2 = new Hashtable();
                    SqlConditions conds2 = new SqlConditions();
                    conds2.Add("Username", Username_old);
                    val2 = InitPartnerAccount(val2, partnerModel, partnerModel.RowId, CreatedBy, true);

                    int y = cnn.Update(val2, conds2, "AccountList");
                    if (y <= 0)
                    {
                        cnn.RollbackTransaction();
                        cnn.EndTransaction();
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                    }
                    cnn.EndTransaction();
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

        public async Task<IEnumerable<PartnerDTO>> GetAll(string whereSrt, string orderByStr)
        {
            DataTable dt = new DataTable();
            DataTable dtAccount = new DataTable();
            DataTable dtCustomerList = new DataTable();
            string sql = "";
            string sqlAccountCustomer = "select RowID, PartnerID from AccountList";
            string sqlCustomerList = "select RowID, PartnerID from CustomerList";
            if (string.IsNullOrEmpty(whereSrt))
            {
                sql = $@"select * from PartnerList order by {orderByStr}";
            }
            else
            {
                sql = $@"select * from PartnerList where {whereSrt} order by {orderByStr}";
            }

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                dtAccount = await cnn.CreateDataTableAsync(sqlAccountCustomer);
                dtCustomerList = await cnn.CreateDataTableAsync(sqlCustomerList);
                var result = dt.AsEnumerable().Select(row => new PartnerDTO
                {
                    Code = row["Code"].ToString(),
                    ContactEmail = row["ContactEmail"].ToString(),
                    ContactName = row["ContactName"].ToString(),
                    ContactPhone = row["ContactPhone"].ToString(),
                    IsLock = Convert.ToBoolean((bool)row["IsLock"]),
                    Note = row["Note"].ToString(),
                    ParentID = (row["ParentID"] != DBNull.Value) ? Int32.Parse(row["ParentID"].ToString()) : -1,
                    PartnerName = row["PartnerName"].ToString(),
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    JoinDate = (row["JoinDate"] != DBNull.Value) ? ((DateTime)row["JoinDate"]).ToString("dd/MM/yyyy") : "",
                    LockedNote = row["LockedNote"].ToString(),
                    NumberAccount = dtAccount.AsEnumerable().Where(r => r["PartnerID"].ToString() == row["RowID"].ToString()).ToList().Count,
                    UnLockNote = row["UnLockNote"].ToString(),
                    NumberCustomer = dtCustomerList.AsEnumerable().Where(r => r["PartnerID"].ToString() == row["RowID"].ToString()).ToList().Count
                });
                return await Task.FromResult(result);
            }
        }

        public async Task<PartnerModel> GetOneModelByRowID(int RowID)
        {
            DataTable dt = new DataTable();
            DataTable dtAccountCustomer = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("RowID", RowID);
            string sql = @"select * from PartnerList where RowID = @RowID";
            string sqlAccountCustomer = "select Username, Password from AccountList where PartnerID = @RowID";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, Conds);
                dtAccountCustomer = cnn.CreateDataTable(sqlAccountCustomer, Conds);
                string Username = dtAccountCustomer.Rows[0]["Username"].ToString();
                string Password = DpsLibs.Common.EncDec.Decrypt(dtAccountCustomer.Rows[0]["Password"].ToString(), Constant.PASSWORD_ED);
                var result = dt.AsEnumerable().Select(row => new PartnerModel
                {
                    Code = row["Code"].ToString(),
                    ContactEmail = row["ContactEmail"].ToString(),
                    ContactName = row["ContactName"].ToString(),
                    ContactPhone = row["ContactPhone"].ToString(),
                    Note = row["Note"].ToString(),
                    ParentID = (row["ParentID"] != DBNull.Value) ? Int32.Parse(row["ParentID"].ToString()) : -1,
                    PartnerName = row["PartnerName"].ToString(),
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    JoinDate = (row["JoinDate"] != DBNull.Value) ? ((DateTime)row["JoinDate"]).ToString("dd/MM/yyyy") : "",
                    Username = Username,
                    Password = Password
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        public async Task<IEnumerable<PartnerFilterDTO>> GetPartnerFilters()
        {
            DataTable dt = new DataTable();
            string sql = "select RowID, PartnerName from PartnerList where IsLock = 0";

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql);
                var result = dt.AsEnumerable().Select(row => new PartnerFilterDTO
                {
                    RowId = Int32.Parse(row["RowID"].ToString()),
                    PartnerName = row["PartnerName"].ToString(),
                });
                return await Task.FromResult(result);
            }
        }

        public async Task<ReturnSqlModel> UpdateStatus(AccountStatusModel model, long CreatedBy)
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
                        val.Add("UnlockNote", model.Note);
                        val.Add("UnlockBy", CreatedBy);
                    }
                    else
                    {
                        val.Add("IsLock", 1);
                        val.Add("LockedNote", model.Note);
                        val.Add("LockedBy", CreatedBy);
                    }

                    int x = cnn.Update(val, conds, "PartnerList");
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
                dt = cnn.CreateDataTable(sql, conds);
                bool isLock = Convert.ToBoolean(dt.Rows[0]["IsLock"]);
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
    }
}