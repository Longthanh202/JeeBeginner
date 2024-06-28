using DpsLibs.Data;
using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.AccountManagement.CustomerManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.CustomerManagement
{
    public interface ICustomerManagementRepository
    {
        Task<List<string>> AppCodes(DpsConnection cnn, long CustomerID);

        Task<IEnumerable<CustomerModelDTO>> GetListCustomer(string whereSrt, string orderByStr);

        Task<ReturnSqlModel> CreateCustomer(DpsConnection cnn, CustomerModel customerModel, int CreatedBy);

        Task<ReturnSqlModel> CreateAppCode(DpsConnection cnn, CustomerModel customerModel, long CustomerID, string CreatedBy);

        Task<CustomerModel> GetCurrentDBID(DpsConnection cnn, CustomerModel customerModel);

        Task<List<string>> GetAllCustomerHetHan();

        Task<List<string>> GetAllCustomerSapHetHan(int SoNgay);

        long GetlastCustomerID(DpsConnection cnn);

        Task<IEnumerable<AppListDTO>> GetListApp();

        Task<IEnumerable<AppCustomerDTO>> GetDS_InfoAppByCustomerID(string whereSrt, string orderByStr);

        Task<IEnumerable<AppCustomerDTO>> GetInfoAppByCustomerID(long CustomerID);

        Task<CustomerModelDTO> GetCustomerByCustomerID(long CustomerID);

        Task<IEnumerable<CustomerModelDTO>> GetListCustomerByIDs(List<string> Ids);

        Task<ReturnSqlModel> UpdateStatus(CustomerAppStatusModel model);

        Task<string> GetNoteLock(long CustomerID, long AppID);

        Task<ReturnSqlModel> UpdateCustomerAppGiaHanModelCnn(CustomerAppGiaHanModel model, DpsConnection cnn);

        void UpdateCustomerAddDeletAppModelCnn(DpsConnection cnn, CustomerAddDeletAppModel customer, string CreatedBy);

        Task<List<int>> GetListCurrentDBID(DpsConnection cnn, List<int> LstAddAppID);
    }
}