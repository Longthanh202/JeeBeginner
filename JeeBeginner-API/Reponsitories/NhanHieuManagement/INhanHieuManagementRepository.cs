using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.NhanHieuManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.NhanHieuManagement
{
    public interface INhanHieuManagementRepository
    {
        Task<IEnumerable<NhanHieuModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<NhanHieuModel> GetOneModelByRowID(int IdNhanHieu);
        Task<ReturnSqlModel> CreateNhanHieu(NhanHieuModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateNhanHieu(NhanHieuModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusNhanHieu(NhanHieuModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(NhanHieuModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
    }
}
