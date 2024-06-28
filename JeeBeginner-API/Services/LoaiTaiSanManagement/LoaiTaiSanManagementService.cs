using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiTaiSanManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.LoaiTaiSanManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.LoaiTaiSanManagement
{
    public class LoaiTaiSanManagementService : ILoaiTaiSanManagementService
    {
        private readonly ILoaiTaiSanManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public LoaiTaiSanManagementService(ILoaiTaiSanManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.CreateLoaiTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(LoaiTaiSanModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<LoaiTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<LoaiTaiSanModel> GetOneModelByRowID(int IdLoaiTaiSan)
        {
            return await _reposiory.GetOneModelByRowID(IdLoaiTaiSan);
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
            return await _reposiory.ImportDoiTacBaoHiemFromExcel(file, CreatedBy);
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            return await _reposiory.TaiFileMau();
        }

        public async Task<ReturnSqlModel> UpdateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.UpdateLoaiTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusLoaiTaiSan(LoaiTaiSanModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
