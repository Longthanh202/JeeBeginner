using Confluent.Kafka;
using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models.MatHangManagement;
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
using JeeBeginner.Models.LoaiMatHangManagement;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using OfficeOpenXml;
using System.IO;

namespace JeeBeginner.Reponsitories.MatHangManagement
{
    public class MatHangManagementRepository : IMatHangManagementRepository
    {
        private readonly string _connectionString;

        public MatHangManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<IEnumerable<MatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {

            DataTable dt = new DataTable();
            string sql = "";

            sql = $@"SELECT  IdMH, MaHang, TenMatHang,
                                                IdLMH,
                                                IdDVT,
                                                Mota, GiaMua, GiaBan, VAT, Barcode, NgungKinhDoanh,
                                                IdDVTCap2, QuyDoiDVTCap2,
                                                IdDVTCap3, QuyDoiDVTCap3,
                                                TenOnSite, ChiTietMoTa,
                                                IdNhanHieu,
                                                IdXuatXu,
                                                MaPhu, ThongSo, TheoDoiTonKho, TheodoiLo,
                                                MaLuuKho, MaViTriKho,
                                                ISNULL(HinhAnh, '') as HinhAnh,SoKyTinhKhauHaoToiThieu,SoKyTinhKhauHaoToiDa
                                    FROM        DM_MatHang
                    where 1=1 {whereStr} and isDel =0 order by {orderByStr}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = cnn.CreateDataTable(sql, conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdMH = Int32.Parse(row["IdMH"].ToString()),
                    MaHang = row["MaHang"].ToString(),
                    TenMatHang = row["TenMatHang"].ToString(),
                    SoKyTinhKhauHaoToiThieu = Int32.Parse(row["SoKyTinhKhauHaoToiThieu"].ToString()),
                    SoKyTinhKhauHaoToiDa = Int32.Parse(row["SoKyTinhKhauHaoToiDa"].ToString()),
                    HinhAnh = row["HinhAnh"].ToString(),
                    //IsDel = Convert.ToBoolean((bool)row["isDel"]),
                  
                });
                return await Task.FromResult(result);
            }
        }
        public async Task<ReturnSqlModel> CreateMatHang(MatHangModel model, long CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    var val = InitDataDM_MatHang(model, CreatedBy);
                    int x = cnn.Insert(val, "DM_MatHang");
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
        public async Task<MatHangModel> GetOneModelByRowID(int RowID)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdMH", RowID);
            string sql = @"select IdMH,MaHang,TenMatHang,IdLMH,IdDVT,Mota,ChiTietMoTa,VAT,TenOnSite,GiaMua,GiaBan,
                         LowerLimit,UpperLimit,IdDVTCap2,QuyDoiDVTCap2,IdDVTCap3,QuyDoiDVTCap3,TheodoiLo,IsTaiSan,
		                 SoKyTinhKhauHaoToiThieu,SoKyTinhKhauHaoToiDa,MaPhu,Barcode,ThongSo,IdNhanHieu,IdXuatXu,ISNULL(HinhAnh, '') as HinhAnh 
		                 from DM_MatHang where IdMH = @IdMH";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdMH = Int32.Parse(row["IdMH"].ToString()),
                    HinhAnh = row["HinhAnh"].ToString() != "" ? row["HinhAnh"].ToString() : "",
                    MaHang = row["MaHang"].ToString() != "" ? row["MaHang"].ToString() : "",
                    TenMatHang = row["TenMatHang"].ToString() != "" ? row["TenMatHang"].ToString() : "",
                    IdLMH = Int32.Parse(row["IdLMH"].ToString()),
                    IdDVT = Int32.Parse(row["IdDVT"].ToString()),
                    Mota = row["Mota"].ToString() != "" ? row["Mota"].ToString() : "",
                    ChiTietMoTa = row["ChiTietMoTa"].ToString() != "" ? row["ChiTietMoTa"].ToString() : "",
                    VAT = float.Parse(row["VAT"].ToString()),
                    TenOnSite = row["TenOnSite"].ToString() != "" ? row["TenOnSite"].ToString() : "",
                    GiaMua = float.Parse(row["GiaMua"].ToString()),
                    GiaBan = float.Parse(row["GiaBan"].ToString()),
                    LowerLimit = !string.IsNullOrEmpty(row["LowerLimit"].ToString()) ? int.Parse(row["LowerLimit"].ToString()) : 0,
                    UpperLimit = !string.IsNullOrEmpty(row["UpperLimit"].ToString()) ? int.Parse(row["UpperLimit"].ToString()) : 0,
                    IdDVTCap2 = Int32.Parse(row["IdDVTCap2"].ToString()),
                    QuyDoiDVTCap2 = float.Parse(row["QuyDoiDVTCap2"].ToString()),
                    IdDVTCap3 = Int32.Parse(row["IdDVTCap3"].ToString()),
                    QuyDoiDVTCap3 = float.Parse(row["QuyDoiDVTCap3"].ToString()),
                    TheodoiLo = bool.Parse(row["TheodoiLo"].ToString()),
                    IsTaiSan = bool.Parse(row["IsTaiSan"].ToString()),
                    SoKyTinhKhauHaoToiThieu = Int32.Parse(row["SoKyTinhKhauHaoToiThieu"].ToString()),
                    SoKyTinhKhauHaoToiDa = Int32.Parse(row["SoKyTinhKhauHaoToiDa"].ToString()),
                    MaPhu = row["MaPhu"].ToString() != "" ? row["MaPhu"].ToString() : "",
                    Barcode = row["Barcode"].ToString() != "" ? row["Barcode"].ToString() : "",
                    ThongSo = row["ThongSo"].ToString() != "" ? row["ThongSo"].ToString() : "",
                    IdNhanHieu = Int32.Parse(row["IdNhanHieu"].ToString()),
                    IdXuatXu = Int32.Parse(row["IdXuatXu"].ToString()),
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }
        //MaLuuKho = !string.IsNullOrEmpty(row["MaLuuKho"].ToString()) ? int.Parse(row["MaLuuKho"].ToString()) : 0,
        ////MaLuuKho = row["MaLuuKho"] != null ? int.Parse(row["MaLuuKho"].ToString()) : 0,

        //UpperLimit = (!string.IsNullOrEmpty(row["UpperLimit"].ToString()) && int.TryParse(row["UpperLimit"].ToString(), out int upperLimit)) ? upperLimit : 0,
        //LowerLimit = (!string.IsNullOrEmpty(row["LowerLimit"].ToString()) && int.TryParse(row["LowerLimit"].ToString(), out int lowerLimit)) ? lowerLimit : 0,
        //public async Task<MatHangModel> GetOneModelByRowID(int RowID)
        //{
        //    DataTable dt = new DataTable();
        //    SqlConditions Conds = new SqlConditions();
        //    Conds.Add("IdMH", RowID);
        //    string sql = @"select * from DM_MatHang where IdMH = @IdMH";
        //    using (DpsConnection cnn = new DpsConnection(_connectionString))
        //    {
        //        dt = await cnn.CreateDataTableAsync(sql, Conds);
        //        var result = dt.AsEnumerable().Select(row => new MatHangModel
        //        {
        //            IdMH = int.Parse(row["IdMH"].ToString()),
        //            MaHang = row["MaHang"].ToString(),
        //            TenMatHang = row["TenMatHang"].ToString(),
        //            IdLMH = int.Parse(row["IdLMH"].ToString()),
        //            IdDVT = int.Parse(row["IdDVT"].ToString()),
        //            Mota = row["Mota"].ToString(),
        //            GiaMua = float.Parse(row["GiaMua"].ToString()),
        //            GiaBan = float.Parse(row["GiaBan"].ToString()),
        //            VAT = float.Parse(row["VAT"].ToString()),
        //            Barcode = row["Barcode"].ToString(),
        //            NgungKinhDoanh = Convert.ToBoolean((bool)row["NgungKinhDoanh"]),
        //            IdDVTCap2 = int.Parse(row["IdDVTCap2"].ToString()),
        //            QuyDoiDVTCap2 = float.Parse(row["QuyDoiDVTCap2"].ToString()),
        //            IdDVTCap3 = int.Parse(row["IdDVTCap3"].ToString()),
        //            QuyDoiDVTCap3 = float.Parse(row["QuyDoiDVTCap3"].ToString()),
        //            TenOnSite = row["TenOnSite"].ToString(),
        //            IdNhanHieu = int.Parse(row["IdNhanHieu"].ToString()),
        //            IdXuatXu = int.Parse(row["IdXuatXu"].ToString()),
        //            ChiTietMoTa = row["ChiTietMoTa"].ToString(),
        //            MaPhu = row["MaPhu"].ToString(),
        //            ThongSo = row["ThongSo"].ToString(),
        //            TheoDoiTonKho = Convert.ToBoolean((bool)row["TheoDoiTonKho"]),
        //            TheodoiLo = Convert.ToBoolean((bool)row["TheodoiLo"]),
        //            IsTaiSan = Convert.ToBoolean((bool)row["IsTaiSan"]),
        //            SoKyTinhKhauHaoToiThieu = int.Parse(row["SoKyTinhKhauHaoToiThieu"].ToString()),
        //            SoKyTinhKhauHaoToiDa = int.Parse(row["SoKyTinhKhauHaoToiDa"].ToString()),
        //            //MaLuuKho = int.Parse(row["MaLuuKho"].ToString()),
        //            //MaLuuKho = row["MaLuuKho"] != null ? int.Parse(row["MaLuuKho"].ToString()) : 0,
        //            MaViTriKho = row["MaViTriKho"].ToString(),
        //            UpperLimit = int.Parse(row["UpperLimit"].ToString()),
        //            LowerLimit = int.Parse(row["LowerLimit"].ToString()),
        //            SoNamDeNghi = int.Parse(row["SoNamDeNghi"].ToString()),
        //            TiLeHaoMon = float.Parse(row["TiLeHaoMon"].ToString()),
        //        }).SingleOrDefault();
        //        return await Task.FromResult(result);
        //    }
        //}
        //private Hashtable InitDataMatHang(MatHangModel lmh, long CreatedBy, bool isUpdate = false)
        //{
        //    Hashtable _item = new Hashtable();
        //    _item.Add("MaHang", string.IsNullOrEmpty(lmh.MaHang) ? "" : lmh.MaHang.ToString().Trim());
        //    _item.Add("TenMatHang", string.IsNullOrEmpty(lmh.TenMatHang) ? "" : lmh.TenMatHang.ToString().Trim());
        //    _item.Add("IdLMH", lmh.IdLMH);
        //    _item.Add("IdDVT", lmh.IdDVT);
        //    _item.Add("Mota", string.IsNullOrEmpty(lmh.Mota) ? "" : lmh.Mota.ToString().Trim());
        //    _item.Add("GiaMua", lmh.GiaMua);
        //    _item.Add("GiaBan", lmh.GiaBan);
        //    _item.Add("VAT", lmh.VAT);
        //    _item.Add("Barcode", string.IsNullOrEmpty(lmh.Barcode) ? "" : lmh.Barcode.ToString().Trim());
        //    _item.Add("NgungKinhDoanh", lmh.NgungKinhDoanh);
        //    _item.Add("IdDVTCap2", lmh.IdDVTCap2);
        //    _item.Add("QuyDoiDVTCap2", lmh.QuyDoiDVTCap2);
        //    _item.Add("IdDVTCap3", lmh.IdDVTCap3);
        //    _item.Add("QuyDoiDVTCap3", lmh.QuyDoiDVTCap3);
        //    _item.Add("TenOnSite", string.IsNullOrEmpty(lmh.TenOnSite) ? "" : lmh.TenOnSite.ToString().Trim());
        //    _item.Add("IdNhanHieu", lmh.IdNhanHieu);
        //    _item.Add("IdXuatXu", lmh.IdXuatXu);
        //    _item.Add("ChiTietMoTa", string.IsNullOrEmpty(lmh.ChiTietMoTa) ? "" : lmh.ChiTietMoTa.ToString().Trim());
        //    _item.Add("MaPhu", string.IsNullOrEmpty(lmh.MaPhu) ? "" : lmh.MaPhu.ToString().Trim());
        //    _item.Add("ThongSo", string.IsNullOrEmpty(lmh.ThongSo) ? "" : lmh.ThongSo.ToString().Trim());
        //    _item.Add("TheoDoiTonKho", lmh.TheoDoiTonKho);
        //    _item.Add("TheodoiLo", lmh.TheodoiLo);
        //    _item.Add("IsTaiSan", lmh.IsTaiSan);
        //    _item.Add("SoKyTinhKhauHaoToiThieu", lmh.SoKyTinhKhauHaoToiThieu);
        //    _item.Add("SoKyTinhKhauHaoToiDa", lmh.SoKyTinhKhauHaoToiDa);
        //    if (lmh.MaLuuKho != 0 && lmh.MaLuuKho != null)
        //        _item.Add("MaLuuKho", lmh.MaLuuKho);
        //    _item.Add("MaViTriKho", string.IsNullOrEmpty(lmh.MaViTriKho) ? "" : lmh.MaViTriKho.ToString().Trim());
        //    if (lmh.UpperLimit != 0)
        //        _item.Add("UpperLimit", lmh.UpperLimit);
        //    if (lmh.LowerLimit != 0)
        //        _item.Add("LowerLimit", lmh.LowerLimit);
        //    _item.Add("SoNamDeNghi", lmh.SoNamDeNghi);
        //    _item.Add("TiLeHaoMon", lmh.TiLeHaoMon);
        //    //_item.Add("TenLMH", lmh.TenLMH);
        //    //val.Add("IdCustomer", lmh.IdCustomer);
        //    //val.Add("IdLMHParent", lmh.IdLMHParent);
        //    //val.Add("Mota", lmh.Mota);
        //    //val.Add("IdKho", lmh.IdKho);
        //    //val.Add("DoUuTien", lmh.DoUuTien);
        //    //val.Add("HinhAnh", lmh.HinhAnh);
        //    _item.Add("isDel", 0);
        //    if (!isUpdate)
        //    {
        //        _item.Add("CreatedDate", DateTime.UtcNow);
        //        _item.Add("CreatedBy", CreatedBy);
        //    }
        //    else
        //    {
        //        _item.Add("ModifiedDate", DateTime.UtcNow);
        //        _item.Add("ModifiedBy", CreatedBy);

        //    }
        //    return _item;
        //}


        private Hashtable InitDataDM_MatHang(MatHangModel dmMatHang, long CreatedBy, bool isUpdate = false)
        {
            Hashtable val = new Hashtable();
            val.Add("HinhAnh", dmMatHang.HinhAnh);
            val.Add("MaHang", dmMatHang.MaHang);
            val.Add("TenMatHang", dmMatHang.TenMatHang);
            val.Add("IdLMH", dmMatHang.IdLMH);
            val.Add("IdDVT", dmMatHang.IdDVT);
            val.Add("Mota", dmMatHang.Mota);
            val.Add("ChiTietMoTa", dmMatHang.ChiTietMoTa);
            val.Add("VAT", dmMatHang.VAT);
            val.Add("TenOnSite", dmMatHang.TenOnSite);
            val.Add("GiaMua", dmMatHang.GiaMua);
            val.Add("GiaBan", dmMatHang.GiaBan);
            val.Add("LowerLimit", dmMatHang.LowerLimit);
            val.Add("UpperLimit", dmMatHang.UpperLimit);
            val.Add("IdDVTCap2", dmMatHang.IdDVTCap2);
            val.Add("QuyDoiDVTCap2", dmMatHang.QuyDoiDVTCap2);
            val.Add("IdDVTCap3", dmMatHang.IdDVTCap3);
            val.Add("QuyDoiDVTCap3", dmMatHang.QuyDoiDVTCap3);
            val.Add("TheodoiLo", dmMatHang.TheodoiLo);
            val.Add("IsTaiSan", dmMatHang.IsTaiSan);
            val.Add("SoKyTinhKhauHaoToiThieu", dmMatHang.SoKyTinhKhauHaoToiThieu);
            val.Add("SoKyTinhKhauHaoToiDa", dmMatHang.SoKyTinhKhauHaoToiDa);
            val.Add("MaPhu", dmMatHang.MaPhu);
            val.Add("Barcode", dmMatHang.Barcode);
            val.Add("TheoDoiTonKho", true);
            val.Add("ThongSo", dmMatHang.ThongSo);
            val.Add("IdNhanHieu", dmMatHang.IdNhanHieu);
            val.Add("IdXuatXu", dmMatHang.IdXuatXu);
            val.Add("IsDel", 0);
            if (!isUpdate)
            {
                val.Add("CreatedDate", DateTime.UtcNow);
                val.Add("CreatedBy", CreatedBy);
            }
            return val;
        }

        public async Task<ReturnSqlModel> UpdateMatHang(MatHangModel model, long CreatedBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdMH", model.IdMH);
                    val = InitDataDM_MatHang(model, CreatedBy, true);
                    int x = cnn.Update(val, conds, "DM_MatHang");
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

        public async Task<ReturnSqlModel> Delete(MatHangModel model, long DeleteBy)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("IdMH", model.IdMH);
                    if (model.IsDel)
                    {
                        val.Add("isDel", 0);
                        val.Add("DeletedBy", DeleteBy);
                        val.Add("DeletedDate", DateTime.UtcNow);
                    }
                    else
                    {
                        val.Add("isDel", 1);
                        val.Add("DeletedBy", DeleteBy);
                        val.Add("DeletedDate", DateTime.UtcNow);
                    }
                    int x = cnn.Update(val, conds, "DM_MatHang");
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
                        if (cnn.Update(_item, new SqlConditions { { "IdMH", _Id } }, "DM_MatHang") != 1)
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
        public Task<ReturnSqlModel> UpdateStatusMatHang(MatHangModel model, long DeleteBy)
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
                        if (worksheet.Dimension.Columns != 17)
                        {
                            return false; // Số lượng cột không đúng, trả về false
                        }

                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            int isEmptyRow = 0;
                            // Kiểm tra hàng đó có dữ liệu không
                            for (int col = 1; col <= 17; col++)
                            {
                                if (!string.IsNullOrEmpty(worksheet.Cells[row, col].Value?.ToString()))
                                {
                                    isEmptyRow += 1;
                                    break;
                                }
                            }
                            Hashtable val = new Hashtable();
                            val.Add("CreatedDate", DateTime.UtcNow);
                            val.Add("CreatedBy", CreatedBy);
                            val.Add("IsDel", 0);
                            val.Add("MaHang", worksheet.Cells[row, 2].Value?.ToString() ?? "");
                            val.Add("TenMatHang", worksheet.Cells[row, 3].Value?.ToString() ?? "");
                            val.Add("IdLMH", worksheet.Cells[row, 4].Value ?? "");
                            val.Add("IdDVT", worksheet.Cells[row, 5].Value ?? "");
                            val.Add("Mota", worksheet.Cells[row, 6].Value?.ToString() ?? "");
                            val.Add("GiaMua", worksheet.Cells[row, 7].Value ?? "");
                            val.Add("GiaBan", worksheet.Cells[row, 8].Value ?? "");
                            val.Add("VAT", worksheet.Cells[row, 9].Value ?? "");
                            val.Add("IdDVTCap2", worksheet.Cells[row, 10].Value ?? "");
                            val.Add("IdDVTCap3", worksheet.Cells[row, 11].Value ?? "");
                            val.Add("TenOnSite", worksheet.Cells[row, 12].Value?.ToString() ?? "");
                            val.Add("ChiTietMoTa", worksheet.Cells[row, 13].Value?.ToString() ?? "");
                            val.Add("TheoDoiTonKho", worksheet.Cells[row, 14].Value ?? "");
                            val.Add("IsTaiSan", worksheet.Cells[row, 15].Value ?? "");
                            val.Add("SoKyTinhKhauHaoToiThieu", worksheet.Cells[row, 16].Value ?? "");
                            val.Add("SoKyTinhKhauHaoToiDa", worksheet.Cells[row, 17].Value ?? "");
                            using (DpsConnection cnn = new DpsConnection(_connectionString))
                            {
                                int x = cnn.Insert(val, "DM_MatHang");
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
                var worksheet = package.Workbook.Worksheets.Add("Mat_Hang");
                string[] columnNames = new string[] { "STT", "MaHang", "TenHang", "IdLMH", "IdDVT",
                "MoTa", "GiaMua", "GiaBan", "VAT", "IdDVTCap2", "IdDVTCap3", "TenOnSite",
                "ChiTietMoTa", "TheoDoiTonKho", "IsTaiSan", "SoKyTinhKhauHaoToiThieu", "SoKyTinhKhauHaoToiDa"};
                double[] columnWidths = new double[] { 10, 20, 50, 20, 20, 20, 30, 20, 20,
                20, 30, 20, 20, 20, 30, 20, 20, 20};

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
                int rowCount = 3;
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


        #region Tìm kiếm loại mặt hàng
        public async Task<IEnumerable<MatHangModel>> SearchLMH(string TenLMH)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("TenLMH", TenLMH);
            string sql = @"select TenLMH, 
                        COALESCE((select TenLMH from DM_MatHang where IdLMH = LMH.IdLMHParent),' ') 
                        as 'TenLMHParent', Mota, DoUuTien from DM_MatHang LMH where TenLMH like N'%' + @TenLMH + '%' and DeleteDate is null";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    TenLMH = row["TenLMH"].ToString(),
                    Mota = row["Mota"].ToString(),
                });
                return await Task.FromResult(result);
            }
        }
        #endregion
        #region Danh sách kho

        public async Task<IEnumerable<MatHangModel>> DM_LoaiMatHang_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdLMH,TenLMH from DM_LoaiMatHang where isDel !=1";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdLMH = Int32.Parse(row["IdLMH"].ToString()),
                    TenLMH = row["TenLMH"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        #endregion
        #region Danh sách loại mặt hàng cha

        public async Task<IEnumerable<MatHangModel>> DM_DVT_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdDVT,TenDVT from DM_DVT where isDel =0";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdDVT = Int32.Parse(row["IdDVT"].ToString()),
                    TenDVT = row["TenDVT"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        public async Task<IEnumerable<MatHangModel>> DM_NhanHieu_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdNhanHieu,TenNhanHieu from DM_NhanHieu  where isDel=0";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdNhanHieu = Int32.Parse(row["IdNhanHieu"].ToString()),
                    TenNhanHieu = row["TenNhanHieu"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        public async Task<IEnumerable<MatHangModel>> DM_XuatXu_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdXuatXu,TenXuatXu from DM_XuatXu where isDel=0";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    IdXuatXu = Int32.Parse(row["IdXuatXu"].ToString()),
                    TenXuatXu = row["TenXuatXu"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        public async Task<IEnumerable<MatHangModel>> DM_Kho_List()
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            string sql = $@"select IdK as IdKho, TenK from DM_Kho where DeleteDate is null";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    MaLuuKho = Int32.Parse(row["IdKho"].ToString()),
                    TenK = row["TenK"].ToString()
                });
                return await Task.FromResult(result);

            }

        }
        #endregion
        #region Tìm mã kho
        public async Task<MatHangModel> GetKhoID(int IdK)
        {
            DataTable dt = new DataTable();
            SqlConditions Conds = new SqlConditions();
            Conds.Add("IdK", IdK);
            string sql = @"select IdK as IdKho, TenK from DM_Kho where IdK = @IdK";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, Conds);
                var result = dt.AsEnumerable().Select(row => new MatHangModel
                {
                    MaLuuKho = Int32.Parse(row["IdKho"].ToString()),
                    TenK = row["TenK"].ToString(),
                }).SingleOrDefault();
                return await Task.FromResult(result);
            }
        }

        #endregion
        #region Tìm kiếm mã loại mặt hàng cha
        //public async Task<MatHangModel> GetLoaiMHChaID(int IdLMHParent)
        //{
        //    DataTable dt = new DataTable();
        //    SqlConditions Conds = new SqlConditions();
        //    Conds.Add("IdLMHParent", IdLMHParent);
        //    string sql = @"select LMH.IdLMHParent,COALESCE((select TenLMH from DM_MatHang 
        //                    where IdLMH = LMH.IdLMHParent),' ') 
        //                    as 'TenLMHParent' from DM_MatHang LMH where IdLMHParent = @IdLMHParent";
        //    using (DpsConnection cnn = new DpsConnection(_connectionString))
        //    {
        //        dt = await cnn.CreateDataTableAsync(sql, Conds);
        //        var result = dt.AsEnumerable().Select(row => new MatHangModel
        //        {
        //            IdLMHParent = Int32.Parse(row["IdLMHParent"].ToString()),
        //            TenLMHParent = row["TenLMHParent"].ToString(),
        //        }).SingleOrDefault();
        //        return await Task.FromResult(result);
        //    }
        //}
        #endregion
    }

}
