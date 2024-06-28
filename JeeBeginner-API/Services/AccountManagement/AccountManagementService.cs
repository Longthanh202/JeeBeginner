using DpsLibs.Data;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Reponsitories.AccountManagement;
using JeeBeginner.Services.AccountManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services
{
    public class AccountManagementService : IAccountManagementService
    {
        private IAccountManagementRepository _reposiory;

        public AccountManagementService(IAccountManagementRepository accountManagementRepository)
        {
            _reposiory = accountManagementRepository;
        }

        public async Task<IEnumerable<AccountDTO>> GetAll(SqlConditions conds, string orderByStr)
        {
            return await _reposiory.GetAll(conds, orderByStr);
        }

        public async Task<ReturnSqlModel> CreateAccount(AccountModel account, long CreatedBy)
        {
            return await _reposiory.CreateAccount(account, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateAccount(AccountModel accountModel, long CreatedBy)
        {
            return await _reposiory.UpdateAccount(accountModel, CreatedBy);
        }

        public async Task<AccountModel> GetOneModelByRowID(int RowID)
        {
            return await _reposiory.GetOneModelByRowID(RowID);
        }

        public async Task<string> GetNoteLock(long RowID)
        {
            return await _reposiory.GetNoteLock(RowID);
        }

        public async Task<ReturnSqlModel> UpdateStatusAccount(AccountStatusModel model, long CreatedBy)
        {
            return await _reposiory.UpdateStatusAccount(model, CreatedBy);
        }

        public async Task<IEnumerable<AccountDTO>> GetAllAccounts(SqlConditions conds, string orderByStr)
        {
            return await _reposiory.GetAllAccounts(conds, orderByStr);
        }

    }
}