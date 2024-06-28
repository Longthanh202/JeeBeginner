using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.AccountManagement.CustomerManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace JeeBeginner.Services.CustomerManagement
{
    public interface ICustomerManagementService
    {
        Task<IEnumerable<CustomerModelDTO>> GetListCustomer(string whereSrt, string orderByStr);

        Task<ReturnSqlModel> CreateCustomer(CustomerModel customerModel, int CreatedBy, string CreatedByString, bool isImport);

        Task<IEnumerable<AppListDTO>> GetListApp();

        Task<IEnumerable<Pakage>> GetPakageListApp();

        Task<IEnumerable<AppCustomerDTO>> GetDS_InfoAppByCustomerID(string whereSrt, string orderByStr);

        Task<List<string>> GetAllCustomerHetHan();

        Task<List<string>> GetAllCustomerSapHetHan(int SoNgay);

        Task<CustomerModelDTO> GetCustomerByCustomerID(long CustomerID);

        Task<IEnumerable<CustomerModelDTO>> GetCustomerByCustomerIDs(List<string> Ids);

        Task<ReturnSqlModel> UpdateStatus(CustomerAppStatusModel model);

        Task<string> GetNoteLock(long CustomerID, long AppID);

        Task<IEnumerable<AppCustomerDTO>> GetInfoAppByCustomerID(long CustomerID);

        Task<ReturnSqlModel> UpdateCustomerAppGiaHanModel(CustomerAppGiaHanModel model);

        Task<IEnumerable<CustomerAppDTO>> GetListCustomerAppByCustomerIDFromAccount(long CustomerID);

        Task<ReturnSqlModel> UpdateCustomerAppAddNumberStaff(CustomerAppAddNumberStaffModel model);

        Task<HttpResponseMessage> UpdateCustomerResetPassword(CustomerResetPasswordModel model);

        Task<HttpResponseMessage> UpdateUnLock(long customerid);

        Task<HttpResponseMessage> UpdateLock(long customerid);

        Task UpdateCustomerAddDeletAppModelCnn(CustomerAddDeletAppModel customer, string CreatedBy);
    }
}