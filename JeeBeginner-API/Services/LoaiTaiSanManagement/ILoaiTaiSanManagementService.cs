using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiTaiSanManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.LoaiTaiSanManagement
{
    public interface ILoaiTaiSanManagementService
    {
        Task<IEnumerable<LoaiTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<LoaiTaiSanModel> GetOneModelByRowID(int IdLoaiTaiSan);
        Task<ReturnSqlModel> CreateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateLoaiTaiSan(LoaiTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusLoaiTaiSan(LoaiTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(LoaiTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy);
        Task<FileContentResult> TaiFileMau();
    }
}
