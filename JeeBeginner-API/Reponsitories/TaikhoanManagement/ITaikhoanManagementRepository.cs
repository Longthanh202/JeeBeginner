using DpsLibs.Data;
using JeeBeginner.Models.TaikhoanManagement;
using JeeBeginner.Models.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.TaikhoanManagement
{
    public interface ITaikhoanManagementRepository
    {
        Task<IEnumerable<TaikhoanDTO>> GetAll(SqlConditions conds, string orderByStr);

        Task<string> GetNoteLock(long RowId);
        Task<TaikhoanModel> GetOneModelByRowID(int RowID);
        Task<ReturnSqlModel> CreateTaikhoan(TaikhoanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateTaikhoan(TaikhoanModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusTaikhoan(TaikhoanStatusModel model, long CreatedBy);
    }
}
