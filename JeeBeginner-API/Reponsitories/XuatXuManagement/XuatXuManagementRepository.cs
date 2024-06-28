using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.XuatXuManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Collections;
using System.Data;
using System.Threading.Tasks;
using System;
using Confluent.Kafka;
using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using JeeBeginner.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Principal;
namespace JeeBeginner.Reponsitories.XuatXuManagement
{
    public class XuatXuManagementRepository : IXuatXuManagementRepository
    {
        private readonly string _connectionString;

        public XuatXuManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<XuatXuModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {

            DataTable dt = new DataTable();
            string sql = "";

            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select DM_XuatXu.* from DM_XuatXu where (where) order by {orderByStr}   ";
            }
            else
            {
                sql = $@"select DM_XuatXu.* from DM_XuatXu where (where) and {whereStr} order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new XuatXuModel
                {
                    IdXuatXu = Int32.Parse(row["IdXuatXu"].ToString()),
                    TenXuatXu = row["TenXuatXu"].ToString(),
                    IdCustomer = Int32.Parse(row["IdCustomer"].ToString()),
                    isDel = Convert.ToBoolean((bool)row["isDel"]),
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    //PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateXuatXu(XuatXuModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataXuatXu(model, CreatedBy);
                    int x = cnn.Insert(val, "DM_XuatXu");
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
        public async Task<XuatXuModel> GetOneModelByRowID(int IdXuatXu)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdXuatXu", IdXuatXu);
            string sql = @"select * from DM_XuatXu where IdXuatXu = @IdXuatXu";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new XuatXuModel
                {
                    IdXuatXu = Int32.Parse(row["IdXuatXu"].ToString()),
                    TenXuatXu = row["TenXuatXu"].ToString(),
                    IdCustomer = Int32.Parse(row["IdCustomer"].ToString()),
                    isDel = Convert.ToBoolean((bool)row["isDel"]),

                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        private Hashtable InitDataXuatXu(XuatXuModel lmh, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("TenXuatXu", lmh.TenXuatXu);
            val.Add("IdCustomer", lmh.IdCustomer);
            val.Add("isDel", 0);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
            }
            else
            {
                val.Add("ModifiedDate", DateTime.UtcNow);
                val.Add("ModifiedBy", CreatedBy);

            }
            return val;
        }

        public async Task<ReturnSqlModel> UpdateXuatXu(XuatXuModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdXuatXu", model.IdXuatXu);
                    val = InitDataXuatXu(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "DM_XuatXu");
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

        public async Task<ReturnSqlModel> Delete(XuatXuModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdXuatXu", model.IdXuatXu);
                    if (model.isDel)
                    {
                        val.Add("isDel", 0);
                        val.Add("DeletedBy", "NULL");
                        val.Add("DeletedDate", "NULL");
                    }
                    else
                    {
                        val.Add("isDel", 1);
                        val.Add("DeletedBy", DeleteBy);
                        val.Add("DeletedDate", DateTime.UtcNow);
                    }
                    int x = cnn.Update(val, conds, "DM_XuatXu");
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
        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    foreach (long _Id in ids)
                    {
                        Hashtable _item = new Hashtable();
                        _item.Add("isDel", 1);
                        _item.Add("DeletedBy", DeleteBy);
                        _item.Add("DeletedDate", DateTime.Now);
                        cnn.BeginTransaction();
                        if (cnn.Update(_item, new SqlConditions { { "IdXuatXu", _Id } }, "DM_XuatXu") != 1)
                        {
                            cnn.RollbackTransaction();
                        }
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

        public Task<ReturnSqlModel> UpdateStatusXuatXu(XuatXuModel model, long DeleteBy)
        {
            throw new NotImplementedException();
        }
    }
}
