using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DoiTacBaoHiemManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.DoiTacBaoHiemManagement
{
    public interface IDoiTacBaoHiemManagementService
    {
        Task<IEnumerable<DoiTacBaoHiemModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<DoiTacBaoHiemModel> GetOneModelByRowID(int IdDoiTacBaoHiem);
        Task<ReturnSqlModel> CreateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateDoiTacBaoHiem(DoiTacBaoHiemModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusDoiTacBaoHiem(DoiTacBaoHiemModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(DoiTacBaoHiemModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy);
        Task<FileContentResult> TaiFileMau();
    }
}
