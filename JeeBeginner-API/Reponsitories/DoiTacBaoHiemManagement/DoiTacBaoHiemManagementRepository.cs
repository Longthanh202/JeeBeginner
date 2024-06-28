using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DoiTacBaoHiemManagement;
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
namespace JeeBeginner.Reponsitories.DoiTacBaoHiemManagement
{
    public class DoiTacBaoHiemManagementRepository : IDoiTacBaoHiemManagementRepository
    {
        private readonly string _connectionString;

        public DoiTacBaoHiemManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<DoiTacBaoHiemModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {

            DataTable dt = new DataTable();
            string sql = "";

            if (string.IsNullOrEmpty(whereStr))
            {
                sql = $@"select Id_DV,TenDonVi,DiaChi,SoDT,NguoiLienHe,GhiChu,IsDisable from DM_DoiTacBaoHiem where (where) order by {orderByStr}   ";
            }
            else
            {
                sql = $@"select Id_DV,TenDonVi,DiaChi,SoDT,NguoiLienHe,GhiChu,IsDisable from DM_DoiTacBaoHiem where (where) and {whereStr} order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, "(where)", conds);
                var result = dt.AsEnumerable().Select(row => new DoiTacBaoHiemModel
                {
                    Id_DV = Int32.Parse(row["Id_DV"].ToString()),
                    TenDonVi = row["TenDonVi"].ToString(),
                    DiaChi = row["DiaChi"].ToString(),
                    SoDT = row["SoDT"].ToString(),
                    NguoiLienHe = row["NguoiLienHe"].ToString(),
                    GhiChu = row["GhiChu"].ToString(),
                    IsDisable = Convert.ToBoolean((bool)row["IsDisable"]),
                    //CreatedDate = (row["CreatedDate"] != DBNull.Value) ? ((DateTime)row["CreatedDate"]).ToString("dd/MM/yyyy") : "",
                    //PartnerName = row["PartnerName"].ToString(),
                    //LastLogin = (row["LastLogin"] != DBNull.Value) ? ((DateTime)row["LastLogin"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataDoiTacBaoHiem(model, CreatedBy);
                    int x = cnn.Insert(val, "DM_DoiTacBaoHiem");
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
        public async Task<DoiTacBaoHiemModel> GetOneModelByRowID(int Id_DV)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("Id_DV", Id_DV);
            string sql = @"select * from DM_DoiTacBaoHiem where Id_DV = @Id_DV";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new DoiTacBaoHiemModel
                {
                    Id_DV = Int32.Parse(row["Id_DV"].ToString()),
                    TenDonVi = row["TenDonVi"].ToString(),
                    DiaChi = row["DiaChi"].ToString(),
                    SoDT = row["SoDT"].ToString(),
                    NguoiLienHe = row["NguoiLienHe"].ToString(),
                    GhiChu = row["GhiChu"].ToString(),
                    IsDisable = Convert.ToBoolean((bool)row["IsDisable"]),

                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        private Hashtable InitDataDoiTacBaoHiem(DoiTacBaoHiemModel lmh, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("TenDonVi", lmh.TenDonVi);
            val.Add("DiaChi", lmh.DiaChi);
            val.Add("SoDT", lmh.SoDT);
            val.Add("NguoiLienHe", lmh.NguoiLienHe);
            val.Add("GhiChu", lmh.GhiChu);
            val.Add("IsDisable", 0);
            if (!isUpdate)
            {
                val.Add("NgayTao", DateTime.UtcNow);
                val.Add("NguoiTao", CreatedBy);
            }
            else
            {
                val.Add("NgaySua", DateTime.UtcNow);
                val.Add("NguoiSua", CreatedBy);

            }
            return val;
        }

        public async Task<ReturnSqlModel> UpdateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("Id_DV", model.Id_DV);
                    val = InitDataDoiTacBaoHiem(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "DM_DoiTacBaoHiem");
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

        public async Task<ReturnSqlModel> Delete(DoiTacBaoHiemModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("Id_DV", model.Id_DV);
                    if (model.IsDisable)
                    {
                        val.Add("IsDisable", 0);
                        //val.Add("DeletedBy", DeleteBy);
                        //val.Add("DeletedDate", DateTime.UtcNow);
                    }
                    else
                    {
                        val.Add("IsDisable", 1);
                        //val.Add("DeletedBy", DeleteBy);
                        //val.Add("DeletedDate", DateTime.UtcNow);
                    }
                    int x = cnn.Update(val, conds, "DM_DoiTacBaoHiem");
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
                        _item.Add("IsDisable", 1);
                        //_item.Add("DeletedBy", DeleteBy);
                        //_item.Add("DeletedDate", DateTime.Now);
                        cnn.BeginTransaction();
                        if (cnn.Update(_item, new SqlConditions { { "Id_DV", _Id } }, "DM_DoiTacBaoHiem") != 1)
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
        public Task<ReturnSqlModel> UpdateStatusDoiTacBaoHiem(DoiTacBaoHiemModel model, long DeleteBy)
        {
            throw new NotImplementedException();
        }
        private object GetValueOrDefault(object value)
        {
            // Kiểm tra nếu giá trị là null thì trả về DBNull.Value, ngược lại trả về giá trị của ô Excel
            return value ?? DBNull.Value;
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
                        if (worksheet.Dimension.Columns != 6)
                        {
                            return false; // Số lượng cột không đúng, trả về false
                        }

                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            int isEmptyRow = 0;
                            // Kiểm tra hàng đó có dữ liệu không
                            for (int col = 1; col <= 6; col++)
                            {
                                if (!string.IsNullOrEmpty(worksheet.Cells[row, col].Value?.ToString()))
                                {
                                    isEmptyRow += 1;
                                    break;
                                }
                            }
                            // Kiểm tra cột thứ nhất và thứ tư có phải toàn số hay không
                            if (!IsNumeric(worksheet.Cells[row, 1].Value?.ToString()) || !IsNumeric(worksheet.Cells[row, 4].Value?.ToString()))
                            {
                                return false; // Nếu không phải toàn số, trả về false
                            }

                            Hashtable val = new Hashtable();
                            val.Add("NgayTao", DateTime.UtcNow);
                            val.Add("NguoiTao", CreatedBy);
                            val.Add("isDisable", 0);
                            val.Add("TenDonVi", worksheet.Cells[row, 2].Value?.ToString() ?? "");
                            val.Add("DiaChi", worksheet.Cells[row, 3].Value?.ToString() ?? "");
                            val.Add("SoDT", worksheet.Cells[row, 4].Value?.ToString() ?? "");
                            val.Add("NguoiLienHe", worksheet.Cells[row, 5].Value?.ToString() ?? "");
                            val.Add("GhiChu", worksheet.Cells[row, 6].Value?.ToString() ?? "");
                            // Tạo kết nối đến cơ sở dữ liệu
                            using (DpsConnection cnn = new DpsConnection(_connectionString))
                            {
                                int x = cnn.Insert(val, "DM_DoiTacBaoHiem");
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
                var worksheet = package.Workbook.Worksheets.Add("Doi_Tac_Bao_Hiem");
                string[] columnNames = new string[] { "STT", "Tên đơn vị", "Đia chỉ", "Số điện thoại", "Người liên hệ", "Ghi chú" };
                double[] columnWidths = new double[] { 10, 20, 30, 20, 20, 20 };

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
