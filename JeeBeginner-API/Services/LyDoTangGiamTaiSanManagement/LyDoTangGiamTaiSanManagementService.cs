using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LyDoTangGiamTaiSanManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.LyDoTangGiamTaiSanManagement;
using JeeBeginner.Services.CustomerManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace JeeBeginner.Services.LyDoTangGiamTaiSanManagement
{
    public class LyDoTangGiamTaiSanManagementService : ILyDoTangGiamTaiSanManagementService
    {
        private readonly ILyDoTangGiamTaiSanManagementRepository _reposiory;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public LyDoTangGiamTaiSanManagementService(ILyDoTangGiamTaiSanManagementRepository reposiory, IConfiguration configuration)
        {
            _reposiory = reposiory;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<ReturnSqlModel> CreateLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.CreateLyDoTangGiamTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> Delete(LyDoTangGiamTaiSanModel model, long DeleteBy)
        {
            return await _reposiory.Delete(model, DeleteBy);
        }

        public async Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy)
        {
            return await _reposiory.Deletes(ids, DeleteBy);
        }

        public async Task<IEnumerable<LyDoTangGiamTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr)
        {
            return await _reposiory.GetAll(conds, orderByStr, whereStr);
        }

        public async Task<LyDoTangGiamTaiSanModel> GetOneModelByRowID(int IdLyDoTangGiamTaiSan)
        {
            return await _reposiory.GetOneModelByRowID(IdLyDoTangGiamTaiSan);
        }

        public async Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy)
        {
            return await _reposiory.ImportDoiTacBaoHiemFromExcel(file, CreatedBy);
        }

        public async Task<FileContentResult> TaiFileMau()
        {
            return await TaiFileMau();
        }

        public async Task<ReturnSqlModel> UpdateLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long CreatedBy)
        {
            return await _reposiory.UpdateLyDoTangGiamTaiSan(model, CreatedBy);
        }

        public async Task<ReturnSqlModel> UpdateStatusLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long DeleteBy)
        {
            throw new System.NotImplementedException();
        }
    }
}
