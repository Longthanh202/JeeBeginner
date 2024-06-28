using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.LoaiMatHangManagement
{
    public class LoaiMatHangManagementService : ILoaiMatHangManagementService
    {
        private readonly ILoaiMatHangManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public LoaiMatHangManagementService(ILoaiMatHangManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<LoaiMatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }
        public async Task<ReturnSqlModel> CreateLoaiMatHang(LoaiMatHangModel account, long CreatedBy)
        {
            return await _reposiory.CreateLoaiMatHang(account, CreatedBy);
        }
        public Task<string> GetNoteLock(long RowID)
        {
            throw new System.NotImplementedException();
        }

        public async Task<LoaiMatHangModel> GetOneModelByRowID(int RowID)
        {
            return await _reposiory.GetOneModelByRowID(RowID);
        }

        public async Task<ReturnSqlModel> UpdateLoaiMatHang(LoaiMatHangModel model, long CreatedBy)
        {
            return await _reposiory.UpdateLoaiMatHang(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(LoaiMatHangModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusLoaiMatHang(LoaiMatHangModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<LoaiMatHangModel>> SearchLMH(string TenLMH)
        {
            return await _reposiory.SearchLMH(TenLMH);
        }

        public async Task<IEnumerable<LoaiMatHangModel>> DM_Kho_List()
        {
            return await _reposiory.DM_Kho_List();
        }

        public async Task<LoaiMatHangModel> GetKhoID(int IdK)
        {
            return await _reposiory.GetKhoID(IdK);
        }

        public async Task<LoaiMatHangModel> GetLoaiMHChaID(int IdLMHParent)
        {
            return await _reposiory.GetLoaiMHChaID(IdLMHParent);
        }

        public async Task<IEnumerable<LoaiMatHangModel>> LoaiMatHangCha_List()
        {
            return await _reposiory.LoaiMatHangCha_List();
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }
    }
}
