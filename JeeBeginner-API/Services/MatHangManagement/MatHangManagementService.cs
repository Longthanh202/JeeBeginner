using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.MatHangManagement;
using JeeBeginner.Reponsitories.MatHangManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.MatHangManagement
{
    public class MatHangManagementService : IMatHangManagementService
    {
        private readonly IMatHangManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;
        public MatHangManagementService(IMatHangManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateMatHang(MatHangModel model, long CreatedBy)
        {
            return await _reposiory.CreateMatHang(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(MatHangModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<MatHangModel>> DM_DVT_List()
        {
            return await _reposiory.DM_DVT_List();
        }

        public async Task<IEnumerable<MatHangModel>> DM_Kho_List()
        {
            return await _reposiory.DM_Kho_List();
        }

        public async Task<IEnumerable<MatHangModel>> DM_LoaiMatHang_List()
        {
            return await _reposiory.DM_LoaiMatHang_List();
        }

        public async Task<IEnumerable<MatHangModel>> DM_MatHang_List()
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<MatHangModel>> DM_NhanHieu_List()
        {
            return await _reposiory.DM_NhanHieu_List();
        }

        public async Task<IEnumerable<MatHangModel>> DM_XuatXu_List()
        {
            return await _reposiory.DM_XuatXu_List();
        }

        public async Task<IEnumerable<MatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<MatHangModel> GetKhoID(int IdK)
        {
            throw new System.NotImplementedException();
        }

        public async Task<MatHangModel> GetOneModelByRowID(int RowID)
        {
            return await _reposiory.GetOneModelByRowID(RowID);
        
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
            return await _reposiory.ImportDoiTacBaoHiemFromExcel(file, CreatedBy);
        }

        public Task<IEnumerable<MatHangModel>> SearchLMH(string TenLMH)
        {
            throw new System.NotImplementedException();
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            return await _reposiory.TaiFileMau();
        }

        public async Task<ReturnSqlModel> UpdateMatHang(MatHangModel model, long CreatedBy)
        {
            return await _reposiory.UpdateMatHang(model,CreatedBy);
        }

        public Task<ReturnSqlModel> UpdateStatusMatHang(MatHangModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
