using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DonViTinhManagement;
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
using System.IO;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using OfficeOpenXml.Style;
using System.Data.SqlClient;
namespace JeeBeginner.Reponsitories.DonViTinhManagement
{
    public class DonViTinhManagementRepository : IDonViTinhManagementRepository
    {
        private readonly string _connectionString;

        public DonViTinhManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<DonViTinhModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {

            DataTable dt = new DataTable();
            string sql = "";

            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select DM_DVT.* from DM_DVT where (where) order by {orderByStr}   ";
            }
            else
            {
                sql = $@"select DM_DVT.* from DM_DVT where (where) and {whereStr} order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new DonViTinhModel
                {
                    IdDVT = Int32.Parse(row["IdDVT"].ToString()),
                    TenDVT = row["TenDVT"].ToString(),
                    IdCustomer = Int32.Parse(row["IdCustomer"].ToString()),
                    isDel = Convert.ToBoolean((bool)row["isDel"]),
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    //PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateDonViTinh(DonViTinhModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataDonViTinh(model, CreatedBy);
                    int x = cnn.Insert(val, "DM_DVT");
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
        public async Task<DonViTinhModel> GetOneModelByRowID(int IdDonViTinh)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdDVT", IdDonViTinh);
            string sql = @"select * from DM_DVT where IdDVT = @IdDVT";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new DonViTinhModel
                {
                    IdDVT = Int32.Parse(row["IdDVT"].ToString()),
                    TenDVT = row["TenDVT"].ToString(),
                    IdCustomer = Int32.Parse(row["IdCustomer"].ToString()),
                    isDel = Convert.ToBoolean((bool)row["isDel"]),

                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        private Hashtable InitDataDonViTinh(DonViTinhModel lmh, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("TenDVT", lmh.TenDVT);
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

        public async Task<ReturnSqlModel> UpdateDonViTinh(DonViTinhModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdDVT", model.IdDVT);
                    val = InitDataDonViTinh(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "DM_DVT");
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

        public async Task<ReturnSqlModel> Delete(DonViTinhModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdDVT", model.IdDVT);
                    if (model.isDel)
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
                    int x = cnn.Update(val, conds, "DM_DVT");
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
                        if (cnn.Update(_item, new SqlConditions { { "IdDVT", _Id } }, "DM_DVT") != 1)
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
        public Task<ReturnSqlModel> UpdateStatusDonViTinh(DonViTinhModel model, long DeleteBy)
        {
            throw new NotImplementedException();
        }

        public async Task<FileContentResult> Export(string? whereStr)
        {
            DataTable dt = new DataTable();
            SqlConditions conds = new SqlConditions();
            string sql = $@"select IdDVT, TenDVT from DM_DVT where isDel != 1";

            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select IdDVT, TenDVT from DM_DVT where isDel != 1";
            }
            else
            {
                sql = $@"select DM_DVT.* from DM_DVT where {whereStr} and isDel != 1";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, conds);
                var result = dt.AsEnumerable().Select(row => new DonViTinhModel
                {
                    IdDVT = Int32.Parse(row["IdDVT"].ToString()),
                    TenDVT = row["TenDVT"].ToString(),
                });
                using (var package = new ExcelPackage())
                {
                    // Add a worksheet to the workbook
                    var worksheet = package.Workbook.Worksheets.Add("Don_Vi_Tinh");
                    string[] columnNames = new string[] { "STT", "ID Đơn Vị Tính", "Tên đơn vị tính" };
                    double[] columnWidths = new double[] { 10, 20, 30 };
                    int stt = 1;

                    // Add column headers
                    for (int i = 0; i < columnNames.Length; i++)
                    {
                        worksheet.Cells[1, i + 1].Value = columnNames[i];
                        worksheet.Column(i + 1).Width = columnWidths[i];

                        // Set font style for column headers
                        worksheet.Cells[1, i + 1].Style.Font.Name = "Times New Roman";
                        worksheet.Cells[1, i + 1].Style.Font.Size = 13;

                        worksheet.Cells[1, i + 1, worksheet.Dimension.End.Row, i + 1].Style.HorizontalAlignment =
                            ExcelHorizontalAlignment.Center;
                    }
                    int row = 2;
                    // Add data from result
                    foreach (var item in result)
                    {
                        worksheet.Cells[row, 1].Value = stt++;
                        worksheet.Cells[row, 2].Value = item.IdDVT;
                        worksheet.Cells[row, 3].Value = item.TenDVT;

                        // Set font style for data cells
                        for (int i = 1; i <= 3; i++) // Loop through columns
                        {
                            worksheet.Cells[row, i].Style.Font.Name = "Times New Roman";
                            worksheet.Cells[row, i].Style.Font.Size = 13;
                            worksheet.Cells[row, i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }
                        row++;
                    }

                    // Auto-fit columns
                    var tableRange = worksheet.Cells[1, 1, row - 1, columnNames.Length];
                    var table = worksheet.Tables.Add(tableRange, "Data"); // Tạo bảng từ dải ô đã chọn
                    table.TableStyle = TableStyles.Light9;

                    // Lưu trữ dữ liệu trong bộ nhớ đệm
                    var stream = new MemoryStream(package.GetAsByteArray());

                    // Return as FileContentResult
                    return new FileContentResult(stream.ToArray(),
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    {
                        FileDownloadName = "Data.xlsx"
                    };
                }
            }
        }



        public async Task<bool> ImportDVTFromExcel(IFormFile file, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            val.Add("CreatedDate", DateTime.UtcNow);
            val.Add("CreatedBy", CreatedBy);
            val.Add("isDel", 0);
            if (file == null || file.Length <= 0)
                return false;
            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            string tenDVT = worksheet.Cells[row, 3].Value?.ToString();

                            // Tạo kết nối đến cơ sở dữ liệu
                            using (DpsConnection cnn = new DpsConnection(_connectionString))
                            {
                                val.Add("TenDVT", tenDVT);
                                int x = cnn.Insert(val, "DM_DVT");
                                if (x <= 0)
                                {
                                    return false;
                                }
                            }
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
