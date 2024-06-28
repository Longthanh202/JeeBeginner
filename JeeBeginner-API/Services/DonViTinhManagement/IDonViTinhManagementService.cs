using DpsLibs.Data;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.DonViTinhManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Services.DonViTinhManagement
{
    public interface IDonViTinhManagementService
    {
        Task<IEnumerable<DonViTinhModel>> GetAll(SqlConditions conds, string orderByStr, string whereStr);
        Task<DonViTinhModel> GetOneModelByRowID(int IdDonViTinh);
        Task<ReturnSqlModel> CreateDonViTinh(DonViTinhModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateDonViTinh(DonViTinhModel model, long CreatedBy);
        Task<ReturnSqlModel> UpdateStatusDonViTinh(DonViTinhModel model, long DeleteBy);
        Task<ReturnSqlModel> Delete(DonViTinhModel model, long DeleteBy);
        Task<ReturnSqlModel> Deletes(decimal[] ids, long DeleteBy);
        Task<FileContentResult> Export(string whereStr);
        Task<bool> ImportDVTFromExcel(IFormFile file, long CreatedBy);
    }
}
