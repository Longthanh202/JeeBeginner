using JeeBeginner.Models.Common;
using JeeBeginner.Models.UserModel;
using JeeBeginner.Reponsitories.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace JeeBeginner.Services.Authorization
{
    public class CustomAuthorizationService : ICustomAuthorizationService
    {
        private readonly IAuthorizationRepository _repository;
        private readonly IConfiguration _config;

        public CustomAuthorizationService(IAuthorizationRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _config = configuration;
        }

        public async Task<User> GetUser(string Username, string Password)
        {
            return await _repository.GetUser(Username, Password);
        }

        public async Task<string> CreateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetValue<string>("JWT:Secret")));
            var EXPIRE_HOURS = _config.GetValue<string>("JWT:JwtExpireHours");
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>{
                new Claim(type: "User", value: Newtonsoft.Json.JsonConvert.SerializeObject(user)),
                };
            //List<long> Rules = _repository.GetRules("huytran");
            //foreach (var Role in Rules)
            //{
            //    //claims.Add(new Claim(ClaimTypes.Role, user.Role));
            //    claims.Add(new Claim(ClaimTypes.Role, Role.ToString()));
            //}
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims.ToArray()),
                Expires = DateTime.UtcNow.AddHours(Int32.Parse(EXPIRE_HOURS)),
                SigningCredentials = credentials
            };
            var token = tokenHandler.CreateToken(descriptor);
             return await Task.FromResult(tokenHandler.WriteToken(token));
        }

        public async Task<ReturnSqlModel> UpdateLastLogin(long CreatedBy)
        {
            return await _repository.UpdateLastLogin(CreatedBy);
        }

        public void ChangePassword(ChangePasswordModel model)
        {
            try
            {
                _repository.ChangePassword(model);
            }
            catch (Exception)
            {
                throw;
            }
        }
       public bool IsReadOnlyPermit(string roleName, string username)
        {
               return _repository.IsReadOnlyPermit(roleName, username);
        }
        public List<long> GetRules(string username)
        {
               return _repository.GetRules(username);
        }
    }
}