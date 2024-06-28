using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.TaikhoanManagement;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace JeeBeginner.Services.TaikhoanManagement
{
    public interface ITaikhoanManagementService
    {
        Task<IEnumerable<TaikhoanDTO>> GetAll(SqlConditions conds, string orderByStr);
        Task<ReturnSqlModel> CreateTaikhoan(TaikhoanModel taikhoan, long CreatedBy);
        Task<ReturnSqlModel> UpdateTaikhoan(TaikhoanModel taikhoanmodel, long CreatedBy);
        Task<string> GetNoteLock(long RowId);
        Task<TaikhoanModel> GetOneModelByRowID(int RowID);

        Task<ReturnSqlModel> UpdateStatusTaikhoan(TaikhoanStatusModel model, long CreatedBy);
    }
}
