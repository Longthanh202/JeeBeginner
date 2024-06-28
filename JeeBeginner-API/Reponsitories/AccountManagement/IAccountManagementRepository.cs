using DpsLibs.Data;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.AccountManagement
{
    public interface IAccountManagementRepository
    {
        Task<IEnumerable<AccountDTO>> GetAll(SqlConditions conds, string orderByStr);
        Task<IEnumerable<AccountDTO>> GetAllAccounts(SqlConditions conds, string orderByStr);
        Task<string> GetNoteLock(long RowID);
        Task<AccountModel> GetOneModelByRowID(int RowID);
        Task<ReturnSqlModel> CreateAccount(AccountModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateAccount(AccountModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusAccount(AccountStatusModel model, long CreatedBy);
    }
}