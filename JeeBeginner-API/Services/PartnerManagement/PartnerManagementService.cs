using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PartnerManagement;
using JeeBeginner.Reponsitories.PartnerManagement;
using JeeBeginner.Services.PartnerManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services
{
    public class PartnerManagementService : IPartnerManagementService
    {
        private readonly IPartnerManagementRepository _repository;

        public PartnerManagementService(IPartnerManagementRepository partnerManagementRepository)
        {
            this._repository = partnerManagementRepository;
        }

        public async Task<IEnumerable<PartnerDTO>> GetAll(string whereSrt, string orderByStr)
        {
            return await _repository.GetAll(whereSrt, orderByStr);
        }

        public async Task<ReturnSqlModel> CreatePartner(PartnerModel partnerModel, long CreatedBy)
        {
            return await _repository.CreatePartner(partnerModel, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdatePartner(PartnerModel partnerModel, long CreatedBy)
        {
            return await _repository.UpdatePartner(partnerModel, CreatedBy);
        }

        public async Task<PartnerModel> GetOneModelByRowID(int RowID)
        {
            return await _repository.GetOneModelByRowID(RowID);
        }

        public async Task<IEnumerable<PartnerFilterDTO>> GetPartnerFilters()
        {
            return await _repository.GetPartnerFilters();
        }

        public async Task<ReturnSqlModel> UpdateStatus(AccountStatusModel model, long CreatedBy)
        {
            return await _repository.UpdateStatus(model, CreatedBy);
        }

        public async Task<string> GetNoteLock(long RowID)
        {
            return await _repository.GetNoteLock(RowID);
        }
    }
}