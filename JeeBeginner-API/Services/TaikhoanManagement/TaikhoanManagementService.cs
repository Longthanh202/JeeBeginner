using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.TaikhoanManagement;
using JeeBeginner.Reponsitories.TaikhoanManagement;
using JeeBeginner.Services.TaikhoanManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.TaikhoanManagement
{
    public class TaikhoanManagementService : ITaikhoanManagementService
    {
        private readonly ITaikhoanManagementRepository _repository;
        public TaikhoanManagementService(ITaikhoanManagementRepository taikhoanManagementRepository)
        {
            _repository = taikhoanManagementRepository;
        }
        public async Task<ReturnSqlModel> CreateTaikhoan(TaikhoanModel taikhoan, long CreatedBy)
        {
            return await _repository.CreateTaikhoan(taikhoan, CreatedBy);
        }

        public async Task<IEnumerable<TaikhoanDTO>> GetAll(SqlConditions conds, string orderByStr)
        {
            return await _repository.GetAll(conds, orderByStr);
        }

        public async Task<string> GetNoteLock(long RowId)
        {
            return await _repository.GetNoteLock(RowId);
        }

        public async Task<TaikhoanModel> GetOneModelByRowID(int RowID)
        {
            return await _repository.GetOneModelByRowID(RowID);
        }

        public async Task<ReturnSqlModel> UpdateStatusTaikhoan(TaikhoanStatusModel model, long CreatedBy)
        {
            return await _repository.UpdateStatusTaikhoan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateTaikhoan(TaikhoanModel taikhoanmodel, long CreatedBy)
        {
            return await _repository.UpdateTaikhoan(taikhoanmodel, CreatedBy);
        }
    }
}
