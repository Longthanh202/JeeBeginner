using JeeBeginner.Models.Common;
using JeeBeginner.Models.UserModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.Authorization
{
    public interface ICustomAuthorizationService
    {
        Task<User> GetUser(string Username, string Password);

        Task<string> CreateToken(User user);

        Task<ReturnSqlModel> UpdateLastLogin(long CreatedBy);

        void ChangePassword(ChangePasswordModel model);
        List<long> GetRules(string username);
        bool IsReadOnlyPermit(string roleName, string username);
    }
}