using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.XuatXuManagement;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.XuatXuManagement
{
    public interface IXuatXuManagementService
    {
        Task<IEnumerable<XuatXuModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<XuatXuModel> GetOneModelByRowID(int IdXuatXu);
        Task<ReturnSqlModel> CreateXuatXu(XuatXuModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateXuatXu(XuatXuModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusXuatXu(XuatXuModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(XuatXuModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
    }
}
