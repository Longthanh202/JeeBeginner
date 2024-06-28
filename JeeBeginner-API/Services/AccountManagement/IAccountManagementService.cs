using DpsLibs.Data;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.AccountManagement
{
    public interface IAccountManagementService
    {
        Task<IEnumerable<AccountDTO>> GetAll(SqlConditions conds, string orderByStr);
        Task<IEnumerable<AccountDTO>> GetAllAccounts(SqlConditions conds, string orderByStr);

        Task<ReturnSqlModel> CreateAccount(AccountModel account, long CreatedBy);

        Task<ReturnSqlModel> UpdateAccount(AccountModel accountModel, long CreatedBy);

        Task<AccountModel> GetOneModelByRowID(int RowID);

        Task<string> GetNoteLock(long RowID);

        Task<ReturnSqlModel> UpdateStatusAccount(AccountStatusModel model, long CreatedBy);
    }
}