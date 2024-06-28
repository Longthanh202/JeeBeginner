using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.XuatXuManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.XuatXuManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.XuatXuManagement
{
    public class XuatXuManagementService : IXuatXuManagementService
    {
        private readonly IXuatXuManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public XuatXuManagementService(IXuatXuManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateXuatXu(XuatXuModel model, long CreatedBy)
        {
            return await _reposiory.CreateXuatXu(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(XuatXuModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<XuatXuModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<XuatXuModel> GetOneModelByRowID(int IdXuatXu)
        {
            return await _reposiory.GetOneModelByRowID(IdXuatXu);
        }

        public async Task<ReturnSqlModel> UpdateXuatXu(XuatXuModel model, long CreatedBy)
        {
            return await _reposiory.UpdateXuatXu(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusXuatXu(XuatXuModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
