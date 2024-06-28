using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DonViTinhManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.DonViTinhManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace JeeBeginner.Services.DonViTinhManagement
{
    public class DonViTinhManagementService : IDonViTinhManagementService
    {
        private readonly IDonViTinhManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public DonViTinhManagementService(IDonViTinhManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateDonViTinh(DonViTinhModel model, long CreatedBy)
        {
            return await _reposiory.CreateDonViTinh(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(DonViTinhModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<FileContentResult> Export(string whereStr)
        {
            return await _reposiory.Export(whereStr);
        }

        public async Task<IEnumerable<DonViTinhModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<DonViTinhModel> GetOneModelByRowID(int IdDonViTinh)
        {
            return await _reposiory.GetOneModelByRowID(IdDonViTinh);
        }

        public async Task<bool> ImportDVTFromExcel(IFormFile file, long CreatedBy)
        {
            return await _reposiory.ImportDVTFromExcel(file, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateDonViTinh(DonViTinhModel model, long CreatedBy)
        {
            return await _reposiory.UpdateDonViTinh(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusDonViTinh(DonViTinhModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
