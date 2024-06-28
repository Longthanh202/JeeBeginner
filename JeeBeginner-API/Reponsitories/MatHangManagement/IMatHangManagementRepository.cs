using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.MatHangManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.MatHangManagement
{
    public interface IMatHangManagementRepository
    {
        Task<IEnumerable<MatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<MatHangModel> GetOneModelByRowID(int RowID);
        Task<ReturnSqlModel> CreateMatHang(MatHangModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateMatHang(MatHangModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusMatHang(MatHangModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(MatHangModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<IEnumerable<MatHangModel>> SearchLMH(string TenLMH);
        Task<IEnumerable<MatHangModel>> DM_Kho_List();
        Task<IEnumerable<MatHangModel>> DM_XuatXu_List();
        Task<IEnumerable<MatHangModel>> DM_LoaiMatHang_List();
        Task<IEnumerable<MatHangModel>> DM_NhanHieu_List();
        Task<IEnumerable<MatHangModel>> DM_DVT_List();
        Task<MatHangModel> GetKhoID(int IdK);
        Task<bool> ImportDoiTacBaoHiemFromExcel(IFormFile file, long CreatedBy);
        Task<FileContentResult> TaiFileMau();
    }
}
