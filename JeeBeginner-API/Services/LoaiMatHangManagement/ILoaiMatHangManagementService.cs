using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.LoaiMatHangManagement;
using JeeBeginner.Models.XuatXuManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.LoaiMatHangManagement
{
    public interface ILoaiMatHangManagementService
    {
        Task<IEnumerable<LoaiMatHangModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<ReturnSqlModel> CreateLoaiMatHang(LoaiMatHangModel account, long CreatedBy);

        Task<ReturnSqlModel> UpdateLoaiMatHang(LoaiMatHangModel accountModel, long CreatedBy);

        Task<LoaiMatHangModel> GetOneModelByRowID(int RowID);

        Task<string> GetNoteLock(long RowID);

        Task<ReturnSqlModel> UpdateStatusLoaiMatHang(LoaiMatHangModel model, long DeleteBy);
        Task<IEnumerable<LoaiMatHangModel>> SearchLMH(string TenLMH);
        Task<IEnumerable<LoaiMatHangModel>> DM_Kho_List();
        Task<LoaiMatHangModel> GetKhoID(int IdK);
        Task<LoaiMatHangModel> GetLoaiMHChaID(int IdLMHParent);
        Task<IEnumerable<LoaiMatHangModel>> LoaiMatHangCha_List();
        Task<ReturnSqlModel> Delete(LoaiMatHangModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
    }
}
