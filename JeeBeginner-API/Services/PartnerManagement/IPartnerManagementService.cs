using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PartnerManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.PartnerManagement
{
    public interface IPartnerManagementService
    {
        Task<IEnumerable<PartnerDTO>> GetAll(string whereSrt, string orderByStr);

        Task<IEnumerable<PartnerFilterDTO>> GetPartnerFilters();

        Task<ReturnSqlModel> CreatePartner(PartnerModel partnerModel, long CreatedBy);

        Task<ReturnSqlModel> UpdatePartner(PartnerModel partnerModel, long CreatedBy);

        Task<PartnerModel> GetOneModelByRowID(int RowID);

        Task<ReturnSqlModel> UpdateStatus(AccountStatusModel model, long CreatedBy);

        Task<string> GetNoteLock(long RowID);
    }
}