using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.NhanHieuManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.NhanHieuManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.NhanHieuManagement
{
    public class NhanHieuManagementService : INhanHieuManagementService
    {
        private readonly INhanHieuManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public NhanHieuManagementService(INhanHieuManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateNhanHieu(NhanHieuModel model, long CreatedBy)
        {
            return await _reposiory.CreateNhanHieu(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(NhanHieuModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<NhanHieuModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<NhanHieuModel> GetOneModelByRowID(int IdNhanHieu)
        {
            return await _reposiory.GetOneModelByRowID(IdNhanHieu);
        }

        public async Task<ReturnSqlModel> UpdateNhanHieu(NhanHieuModel model, long CreatedBy)
        {
            return await _reposiory.UpdateNhanHieu(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusNhanHieu(NhanHieuModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
