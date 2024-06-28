using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LyDoTangGiamTaiSanManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.LyDoTangGiamTaiSanManagement
{
    public interface ILyDoTangGiamTaiSanManagementRepository
    {
        Task<IEnumerable<LyDoTangGiamTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<LyDoTangGiamTaiSanModel> GetOneModelByRowID(int IdLyDoTangGiamTaiSan);
        Task<ReturnSqlModel> CreateLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusLyDoTangGiamTaiSan(LyDoTangGiamTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(LyDoTangGiamTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy);
        Task<FileContentResult> TaiFileMau();
    }
}
