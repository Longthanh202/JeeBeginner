using DpsLibs.Data;
using JeeBeginner.Models.AccountRoleManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Reponsitories.AccountRoleManagement;
using JeeBeginner.Reponsitories.CustomerManagement;
using JeeBeginner.Services.AccountRoleManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services
{
    public class AccountRoleManagementService : IAccountRoleManagementService
    {

        private IAccountRoleManagementRepository _reposiory;
        private readonly string _connectionString;

        public AccountRoleManagementService(IAccountRoleManagementRepository accountManagementRepository, IConfiguration configuration)
        {
            _reposiory = accountManagementRepository;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<AccountRoleDTO>> GetAll(SqlConditions conds, string orderByStr)
        {
            return await _reposiory.GetAll(conds, orderByStr);
        }

        public async Task<ReturnSqlModel> CreateAccount(AccountRoleModel account, long CreatedBy)
        {
            return await _reposiory.CreateAccount(account, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateAccount(AccountRoleModel accountModel, long CreatedBy)
        {
            return await _reposiory.UpdateAccount(accountModel, CreatedBy);
        }

        public async Task<AccountRoleModel> GetOneModelByRowID(int RowID)
        {
            return await _reposiory.GetOneModelByRowID(RowID);
        }

        public async Task<string> GetNoteLock(long RowID)
        {
            return await _reposiory.GetNoteLock(RowID);
        }

        public async Task<ReturnSqlModel> UpdateStatusAccount(AccountRoleStatusModel model, long CreatedBy)
        {
            return await _reposiory.UpdateStatusAccount(model, CreatedBy);
        }

        public async Task<IEnumerable<AccountRoleDTO>> GetAllAccounts(SqlConditions conds, string orderByStr)
        {
            return await _reposiory.GetAllAccounts(conds, orderByStr);
        }

        public async Task<IEnumerable<AccountRole>> GetAllRole(string Username)
        {
            return await _reposiory.GetAllRole(Username);
        }
        public async Task<ReturnSqlModel> CreateAccountPermission(AccountRole model, bool Edit)
        {
            return await _reposiory.CreateAccountPermission(model, Edit);
        }
        public async Task<ReturnSqlModel> UpdateAccountPermission(AccountRole model, bool edit)
        {
            return await _reposiory.UpdateAccountPermission(model, edit);
        }
        public async Task<ReturnSqlModel> DeleteAccountPermission(AccountRole model)
        {
            return await _reposiory.DeleteAccountPermission(model);
        }
        public async Task<object> Save_Quyen(List<AccountRole> arr_data)
        {
            return await _reposiory.Save_Quyen(arr_data);
        }
        public async Task<object> Save_QuyenNguoiDung(List<AccountRole> arr_data)
        {
            return await _reposiory.Save_QuyenNguoiDung(arr_data);
        }
        public async Task UpdateInsertEditRole(AccountRole account)
        {

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    cnn.BeginTransaction();

                    _reposiory.UpdateInsertEditRole(cnn, account);

                }
                catch (Exception)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    throw;
                }
            }
        }
    }
}