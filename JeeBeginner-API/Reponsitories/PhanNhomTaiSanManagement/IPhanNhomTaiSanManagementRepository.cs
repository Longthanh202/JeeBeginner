using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.PhanNhomTaiSanManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.PhanNhomTaiSanManagement
{
    public interface IPhanNhomTaiSanManagementRepository
    {
        Task<IEnumerable<PhanNhomTaiSanModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<PhanNhomTaiSanModel> GetOneModelByRowID(int IdPhanNhomTaiSan);
        Task<ReturnSqlModel> CreatePhanNhomTaiSan(PhanNhomTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdatePhanNhomTaiSan(PhanNhomTaiSanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusPhanNhomTaiSan(PhanNhomTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(PhanNhomTaiSanModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy);
        Task<FileContentResult> TaiFileMau();
    }
}
