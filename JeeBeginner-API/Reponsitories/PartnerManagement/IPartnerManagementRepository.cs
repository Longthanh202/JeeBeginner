using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PartnerManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.PartnerManagement
{
    public interface IPartnerManagementRepository
    {
        Task<IEnumerable<PartnerDTO>> GetAll(string whereSrt, string orderByStr);
        Task<IEnumerable<PartnerFilterDTO>> GetPartnerFilters();
        Task<PartnerModel> GetOneModelByRowID(int RowID);
        Task<ReturnSqlModel> CreatePartner(PartnerModel pernerModel, long CreatedBy);
        Task<ReturnSqlModel> UpdatePartner(PartnerModel pernerModel, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatus(AccountStatusModel model, long CreatedBy);
        Task<string> GetNoteLock(long RowID);
    }
}