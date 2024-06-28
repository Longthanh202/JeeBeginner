using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiMatHangManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.LoaiMatHangManagement
{
    public interface ILoaiMatHangManagementRepository
    {
        Task<IEnumerable<LoaiMatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<LoaiMatHangModel> GetOneModelByRowID(int RowID);
        Task<ReturnSqlModel> CreateLoaiMatHang(LoaiMatHangModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateLoaiMatHang(LoaiMatHangModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusLoaiMatHang(LoaiMatHangModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(LoaiMatHangModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<IEnumerable<LoaiMatHangModel>> SearchLMH(string TenLMH);
        Task<IEnumerable<LoaiMatHangModel>> DM_Kho_List();
        Task<LoaiMatHangModel> GetKhoID(int IdK);
        Task<LoaiMatHangModel> GetLoaiMHChaID(int IdLMHParent);
        Task<IEnumerable<LoaiMatHangModel>> LoaiMatHangCha_List();
    }
}
