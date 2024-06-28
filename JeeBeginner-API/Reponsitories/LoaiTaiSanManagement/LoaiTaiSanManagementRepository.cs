using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiTaiSanManagement;
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
using OfficeOpenXml;
using System.IO;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
namespace JeeBeginner.Reponsitories.LoaiTaiSanManagement
{
    public class LoaiTaiSanManagementRepository : ILoaiTaiSanManagementRepository
    {
        private readonly string _connectionString;

        public LoaiTaiSanManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<LoaiTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {

            DataTable dt = new DataTable();
            string sql = "";

            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select IdLoaiTS,MaLoai,TenLoai,TrangThai from TS_DM_LoaiTS  order by {orderByStr}   ";
            }
            else
            {
                sql = $@"select IdLoaiTS,MaLoai,TenLoai,TrangThai from TS_DM_LoaiTS where {whereStr} order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql);
                var result = dt.AsEnumerable().Select(row => new LoaiTaiSanModel
                {
                    IdLoaiTS = Int32.Parse(row["IdLoaiTS"].ToString()),
                    MaLoai = row["MaLoai"].ToString(),
                    TenLoai = row["TenLoai"].ToString(),
                    TrangThai = Convert.ToBoolean((bool)row["TrangThai"]),
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    //PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataLoaiTaiSan(model, CreatedBy);
                    int x = cnn.Insert(val, "TS_DM_LoaiTS");
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
        public async Task<LoaiTaiSanModel> GetOneModelByRowID(int IdLoaiTS)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdLoaiTS", IdLoaiTS);
            string sql = @"select IdLoaiTS,MaLoai,TenLoai,TrangThai from TS_DM_LoaiTS where IdLoaiTS = @IdLoaiTS";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new LoaiTaiSanModel
                {
                    IdLoaiTS = Int32.Parse(row["IdLoaiTS"].ToString()),
                    MaLoai = row["MaLoai"].ToString(),
                    TenLoai = row["TenLoai"].ToString(),
                    TrangThai = Convert.ToBoolean((bool)row["TrangThai"]),

                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        private Hashtable InitDataLoaiTaiSan(LoaiTaiSanModel lmh, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("MaLoai", lmh.MaLoai);
            val.Add("TenLoai", lmh.TenLoai);
            val.Add("TrangThai", lmh.TrangThai);
            if (!isUpdate)
            {
            }
            else
            {

            }
            return val;
        }

        public async Task<ReturnSqlModel> UpdateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdLoaiTS", model.IdLoaiTS);
                    val = InitDataLoaiTaiSan(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "TS_DM_LoaiTS");
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

        public async Task<ReturnSqlModel> Delete(LoaiTaiSanModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdLoaiTS", model.IdLoaiTS);              
                    int x = cnn.Delete(conds, "TS_DM_LoaiTS");
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
                        _item.Add("TrangThai", 1);
                        cnn.BeginTransaction();
                        if (cnn.Update(_item, new SqlConditions { { "IdLoaiTS", _Id } }, "TS_DM_LoaiTS") != 1)
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
        public Task<ReturnSqlModel> UpdateStatusLoaiTaiSan(LoaiTaiSanModel model, long DeleteBy)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
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

                        // Kiểm tra số lượng cột
                        if (worksheet.Dimension.Columns != 4)
                        {
                            return false; // Số lượng cột không đúng, trả về false
                        }

                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            // Kiểm tra cột thứ nhất và thứ tư có phải toàn số hay không
                            if (!IsNumeric(worksheet.Cells[row, 1].Value?.ToString()) || !IsNumeric(worksheet.Cells[row, 4].Value?.ToString()))
                            {
                                return false; // Nếu không phải toàn số, trả về false
                            }

                            // Kiểm tra cột 4 chỉ chứa giá trị số là 0 hoặc 1
                            string trangThaiStr = worksheet.Cells[row, 4].Value?.ToString();
                            if (trangThaiStr != "0" && trangThaiStr != "1")
                            {
                                return false; // Nếu giá trị không hợp lệ, trả về false
                            }
                        }

                        for (int row = 2; row <= rowCount; row++)
                        {
                            int isEmptyRow = 0;
                            // Kiểm tra hàng đó có dữ liệu không
                            for (int col = 1; col <= 4; col++)
                            {
                                if (!string.IsNullOrEmpty(worksheet.Cells[row, col].Value?.ToString()))
                                {
                                    isEmptyRow += 1;
                                    break;
                                }
                            }

                            Hashtable val = new Hashtable();                  
                            val.Add("MaLoai", worksheet.Cells[row, 2].Value?.ToString() ?? "");
                            val.Add("TenLoai", worksheet.Cells[row, 3].Value?.ToString() ?? "");
                            val.Add("TrangThai", worksheet.Cells[row, 4].Value?.ToString() ?? "");                 
                            using (DpsConnection cnn = new DpsConnection(_connectionString))
                            {
                                int x = cnn.Insert(val, "TS_DM_LoaiTS");
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

        private bool IsNumeric(string value)
        {
            double number;
            return double.TryParse(value, out number);
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            using (var package = new ExcelPackage())
            {
                // Add a worksheet to the workbook
                var worksheet = package.Workbook.Worksheets.Add("Loai_Tai_San");
                string[] columnNames = new string[] { "STT", "Mã loai", "Tên loai", "Trạng thái"};
                double[] columnWidths = new double[] { 10, 20, 30, 20};

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

                // Create a table with 20 rows
                int rowCount = 20;
                worksheet.Cells[2, 1, rowCount + 1, columnNames.Length].Style.Font.Name = "Times New Roman";
                worksheet.Cells[2, 1, rowCount + 1, columnNames.Length].Style.Font.Size = 13;
                worksheet.Cells[2, 1, rowCount + 1, columnNames.Length].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                var tableRange = worksheet.Cells[1, 1, rowCount + 1, columnNames.Length];
                var table = worksheet.Tables.Add(tableRange, "Data"); // Create a table from the selected range
                table.TableStyle = TableStyles.Light9;

                // Auto-fit columns
                worksheet.Cells.AutoFitColumns();

                // Save the Excel package to a memory stream
                var stream = new MemoryStream(package.GetAsByteArray());

                // Return as FileContentResult
                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "Data.xlsx"
                };
            }
        }
    }
}
