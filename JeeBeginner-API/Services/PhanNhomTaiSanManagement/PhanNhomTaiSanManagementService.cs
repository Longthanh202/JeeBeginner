using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PhanNhomTaiSanManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.PhanNhomTaiSanManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.PhanNhomTaiSanManagement
{
    public class PhanNhomTaiSanManagementService : IPhanNhomTaiSanManagementService
    {
        private readonly IPhanNhomTaiSanManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public PhanNhomTaiSanManagementService(IPhanNhomTaiSanManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreatePhanNhomTaiSan(PhanNhomTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.CreatePhanNhomTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(PhanNhomTaiSanModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<PhanNhomTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<PhanNhomTaiSanModel> GetOneModelByRowID(int IdPhanNhomTaiSan)
        {
            return await _reposiory.GetOneModelByRowID(IdPhanNhomTaiSan);
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
            return await _reposiory.ImportDoiTacBaoHiemFromExcel(file, CreatedBy);
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            return await _reposiory.TaiFileMau();
        }

        public async Task<ReturnSqlModel> UpdatePhanNhomTaiSan(PhanNhomTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.UpdatePhanNhomTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusPhanNhomTaiSan(PhanNhomTaiSanModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
