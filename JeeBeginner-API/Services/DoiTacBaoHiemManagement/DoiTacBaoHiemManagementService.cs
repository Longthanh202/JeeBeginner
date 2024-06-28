using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DoiTacBaoHiemManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.DoiTacBaoHiemManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JeeBeginner.Services.DoiTacBaoHiemManagement
{
    public class DoiTacBaoHiemManagementService : IDoiTacBaoHiemManagementService
    {
        private readonly IDoiTacBaoHiemManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public DoiTacBaoHiemManagementService(IDoiTacBaoHiemManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy)
        {
            return await _reposiory.CreateDoiTacBaoHiem(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(DoiTacBaoHiemModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<DoiTacBaoHiemModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<DoiTacBaoHiemModel> GetOneModelByRowID(int IdDoiTacBaoHiem)
        {
            return await _reposiory.GetOneModelByRowID(IdDoiTacBaoHiem);
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
           return await _reposiory.ImportDoiTacBaoHiemFromExcel(file, CreatedBy);
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            return await _reposiory.TaiFileMau();
        }

        public async Task<ReturnSqlModel> UpdateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy)
        {
            return await _reposiory.UpdateDoiTacBaoHiem(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusDoiTacBaoHiem(DoiTacBaoHiemModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
