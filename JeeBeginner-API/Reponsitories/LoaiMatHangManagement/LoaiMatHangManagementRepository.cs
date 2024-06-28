using Confluent.Kafka;
using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.LoaiMatHangManagement;
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
using System.Threading.Tasks;
using RestSharp;
using Azure.Core;

namespace JeeBeginner.Reponsitories.LoaiMatHangManagement
{
    public class LoaiMatHangManagementRepository:ILoaiMatHangManagementRepository
    {
        private readonly string _connectionString;

        public LoaiMatHangManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<LoaiMatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            
            DataTable dt = new DataTable();
            string sql = "";


            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select a.IdLMH,a.HinhAnh ,a.MaLMH ,a.TenLMH,a.IdLMHParent, b.TenLMH as TenLMHParent, a.Mota, a.DoUuTien ,a.IdKho 
                    from DM_LoaiMatHang a left join DM_LoaiMatHang as b on a.IdLMHParent = b.IdLMH 
                    where 1=1 and a.isDel != 1 order by {orderByStr}";
            }
            else
            {
                sql = $@"select a.IdLMH,a.HinhAnh ,a.MaLMH ,a.TenLMH,a.IdLMHParent, b.TenLMH as TenLMHParent, a.Mota, a.DoUuTien ,a.IdKho 
                    from DM_LoaiMatHang a left join DM_LoaiMatHang as b on a.IdLMHParent = b.IdLMH 
                    where 1=1 and {whereStr} and a.isDel != 1 order by {orderByStr}";
            }

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdLMH = Int32.Parse(row["IdLMH"].ToString()),
                    MaLMH = row["MaLMH"].ToString(),
                    TenLMH = row["TenLMH"].ToString(),
                    //IdCustomer = Int32.Parse(row["IdCustomer"].ToString()),
                    IdLMHParent = Int32.Parse(row["IdLMHParent"].ToString()),
                    TenLMHParent = row["TenLMHParent"].ToString(),
                    Mota = row["Mota"].ToString(),
                    HinhAnh = row["HinhAnh"].ToString(),
                    DoUuTien = Int32.Parse(row["DoUuTien"].ToString()),
                    //IsDel = Convert.ToBoolean((bool)row["isDel"]),
                    IdKho = Int32.Parse(row["IdKho"].ToString()),
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    //PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateLoaiMatHang(LoaiMatHangModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataLoaiMatHang(model, CreatedBy);
                    int x = cnn.Insert(val, "DM_LoaiMatHang");
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
        public async Task<LoaiMatHangModel> GetOneModelByRowID(int RowID)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdLMH", RowID);
            string sql = @"select * from DM_LoaiMatHang where IdLMH = @IdLMH";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdLMH = int.Parse(row["IdLMH"].ToString()),
                    IdKho = int.Parse(row["IdKho"].ToString()),
                    HinhAnh = row["HinhAnh"].ToString(),
                    TenLMH = row["TenLMH"].ToString(),
                    IdLMHParent = int.Parse(row["IdLMHParent"].ToString()),
                    Mota = row["Mota"].ToString(),
                    DoUuTien = int.Parse(row["DoUuTien"].ToString()),
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        private Hashtable InitDataLoaiMatHang(LoaiMatHangModel? lmh, long CreatedBy, bool isUpdate = false)
        {
            try
            {
                Hashtable val = new Hashtable();
                val.Add("TenLMH", lmh.TenLMH);
                val.Add("IdCustomer", lmh.IdCustomer);
                val.Add("IdLMHParent", lmh.IdLMHParent);
                val.Add("Mota", lmh.Mota);
                val.Add("IdKho", lmh.IdKho);
                val.Add("DoUuTien", lmh.DoUuTien);          
                val.Add("isDel", 0);
                val.Add("HinhAnh", lmh.HinhAnh);
                if (!isUpdate)
                {
                    val.Add("CreatedDate", DateTime.UtcNow);
                    val.Add("CreatedBy", CreatedBy);
                    //val.Add("HinhAnh", "../../../../../../assets/media/Img/" + lmh.HinhAnh);
                    //val.Add("HinhAnh", "../../../../../../../../../JeeBeginner-API/img/" + lmh.HinhAnh);
                }
                else
                {
                    val.Add("ModifiedDate", DateTime.UtcNow);
                    val.Add("ModifiedBy", CreatedBy);
                    //val.Add("HinhAnh", lmh.HinhAnh);

                }
                return val;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnSqlModel> UpdateLoaiMatHang(LoaiMatHangModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdLMH", model.IdLMH);
                    val = InitDataLoaiMatHang(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "DM_LoaiMatHang");
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

        public async Task<ReturnSqlModel> Delete(LoaiMatHangModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdLMH", model.IdLMH);
                    if (model.IsDel)
                    {
                        val.Add("isDel", 0);
                        val.Add("DeleteBy", DeleteBy);
                        val.Add("DeleteDate", DateTime.UtcNow);
                    }
                    else
                    {
                        val.Add("isDel", 1);
                        val.Add("DeleteBy", DeleteBy);
                        val.Add("DeleteDate", DateTime.UtcNow);
                    }
                    int x = cnn.Update(val, conds, "DM_LoaiMatHang");
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
                        _item.Add("DeleteBy", DeleteBy);
                        _item.Add("DeleteDate", DateTime.Now);
                        cnn.BeginTransaction();
                        if (cnn.Update(_item, new SqlConditions { { "IdLMH", _Id } }, "DM_LoaiMatHang") != 1)
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
        public Task<ReturnSqlModel> UpdateStatusLoaiMatHang(LoaiMatHangModel model, long DeleteBy)
        {
            throw new NotImplementedException();
        }


        #region Tìm kiếm loại mặt hàng
        public async Task<IEnumerable<LoaiMatHangModel>> SearchLMH(string TenLMH)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("TenLMH", TenLMH);
            string sql = @"select TenLMH, 
                        COALESCE((select TenLMH from DM_LoaiMatHang where IdLMH = LMH.IdLMHParent),' ') 
                        as 'TenLMHParent', Mota, DoUuTien from DM_LoaiMatHang LMH where TenLMH like N'%' + @TenLMH + '%' and DeleteDate is null";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    TenLMH = row["TenLMH"].ToString(),
                    TenLMHParent = row["TenLMHParent"].ToString(),
                    Mota = row["Mota"].ToString(),
                    DoUuTien = Int32.Parse(row["DoUuTien"].ToString())
                });
                return await Task.FromResult(result);
            }
        }
        #endregion
        #region Danh sách kho

        public async Task<IEnumerable<LoaiMatHangModel>> DM_Kho_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdK as IdKho, TenK from DM_Kho where DeleteDate is null";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdKho = Int32.Parse(row["IdKho"].ToString()),
                    TenK = row["TenK"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        #endregion
        #region Danh sách loại mặt hàng cha

        public async Task<IEnumerable<LoaiMatHangModel>> LoaiMatHangCha_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select DISTINCT LMH.IdLMHParent,COALESCE((select TenLMH from DM_LoaiMatHang 
                            where IdLMH = LMH.IdLMHParent),' ') 
                            as 'TenLMHParent' from DM_LoaiMatHang LMH
							where COALESCE((select TenLMH from DM_LoaiMatHang 
                            where IdLMH = LMH.IdLMHParent),' ') <> ' '";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdLMHParent = Int32.Parse(row["IdLMHParent"].ToString()),
                    TenLMHParent = row["TenLMHParent"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        #endregion
        #region Tìm mã kho
        public async Task<LoaiMatHangModel> GetKhoID(int IdK)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdK", IdK);
            string sql = @"select IdK as IdKho, TenK from DM_Kho where IdK = @IdK";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdKho = Int32.Parse(row["IdKho"].ToString()),
                    TenK = row["TenK"].ToString(),
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }
        #endregion
        #region Tìm kiếm mã loại mặt hàng cha
        public async Task<LoaiMatHangModel> GetLoaiMHChaID(int IdLMHParent)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdLMHParent", IdLMHParent);
            string sql = @"select LMH.IdLMHParent,COALESCE((select TenLMH from DM_LoaiMatHang 
                            where IdLMH = LMH.IdLMHParent),' ') 
                            as 'TenLMHParent' from DM_LoaiMatHang LMH where IdLMHParent = @IdLMHParent";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiMatHangModel
                {
                    IdLMHParent = Int32.Parse(row["IdLMHParent"].ToString()),
                    TenLMHParent = row["TenLMHParent"].ToString(),
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        public Task<bool> ImportLoaiTaiSanFromExcel(IFormFile file, long CreatedBy)
        {
            throw new NotImplementedException();
        }

        public Task<FileContentResult> TaiFileMau()
        {
            throw new NotImplementedException();
        }
        #endregion
    }

}
