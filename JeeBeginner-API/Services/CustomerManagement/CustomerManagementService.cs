using DPSinfra.Utils;
using DpsLibs.Data;
using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.AccountManagement.CustomerManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using JeeBeginner.Reponsitories.CustomerManagement;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace JeeBeginner.Services.CustomerManagement
{
    public class CustomerManagementService : ICustomerManagementService
    {
        private readonly ICustomerManagementRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly JeeAccountCustomerService _jeeAccountCustomerService;
        private readonly string _connectionString;

        public CustomerManagementService(ICustomerManagementRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
            _jeeAccountCustomerService = new JeeAccountCustomerService(configuration);
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ReturnSqlModel> CreateCustomer(CustomerModel customerModel, int CreatedBy, string CreatedByString, bool isImport)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                cnn.BeginTransaction();
                var create = await _repository.CreateCustomer(cnn, customerModel, CreatedBy);
                if (!create.Susscess)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return create;
                }
                int customerId = customerModel.RowID;
                if (customerModel.RowID <= 0)
                {
                    customerId = Int32.Parse(_repository.GetlastCustomerID(cnn).ToString());
                    customerModel.RowID = customerId;
                }

                var createAppcodes = await _repository.CreateAppCode(cnn, customerModel, customerId, CreatedByString);
                if (!createAppcodes.Susscess)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return createAppcodes;
                }
                var reponse = await _jeeAccountCustomerService.CreateCustomer(customerModel, isImport);
                if (reponse.IsSuccessStatusCode)
                {
                    cnn.EndTransaction();
                    return await Task.FromResult(new ReturnSqlModel());
                }
                else
                {
                    string returnValue = reponse.Content.ReadAsStringAsync().Result;
                    var res = new ReturnSqlModel(returnValue, Constant.ERRORCODE);
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(res);
                }
            }
        }

        public async Task<IEnumerable<AppCustomerDTO>> GetDS_InfoAppByCustomerID(string whereSrt, string orderByStr)
        {
            return await _repository.GetDS_InfoAppByCustomerID(whereSrt, orderByStr);
        }

        public async Task<IEnumerable<AppListDTO>> GetListApp()
        {
            return await _repository.GetListApp();
        }

        public async Task<IEnumerable<CustomerModelDTO>> GetListCustomer(string whereSrt, string orderByStr)
        {
            return await _repository.GetListCustomer(whereSrt, orderByStr);
        }

        public async Task<CustomerModelDTO> GetCustomerByCustomerID(long CustomerID)
        {
            return await _repository.GetCustomerByCustomerID(CustomerID);
        }

        public async Task<IEnumerable<CustomerModelDTO>> GetCustomerByCustomerIDs(List<string> Ids)
        {
            return await _repository.GetListCustomerByIDs(Ids);
        }

        public async Task<ReturnSqlModel> UpdateStatus(CustomerAppStatusModel model)
        {
            return await _repository.UpdateStatus(model);
        }

        public async Task<string> GetNoteLock(long CustomerID, long AppID)
        {
            return await _repository.GetNoteLock(CustomerID, AppID);
        }

        public async Task<IEnumerable<AppCustomerDTO>> GetInfoAppByCustomerID(long CustomerID)
        {
            return await _repository.GetInfoAppByCustomerID(CustomerID);
        }

        public async Task<List<string>> GetAllCustomerHetHan()
        {
            return await _repository.GetAllCustomerHetHan();
        }

        public async Task<List<string>> GetAllCustomerSapHetHan(int SoNgay)
        {
            return await _repository.GetAllCustomerSapHetHan(SoNgay);
        }

        public async Task<ReturnSqlModel> UpdateCustomerAppGiaHanModel(CustomerAppGiaHanModel model)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                cnn.BeginTransaction();
                var update = await _repository.UpdateCustomerAppGiaHanModelCnn(model, cnn);
                if (!update.Susscess)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(update);
                }

                var reponse = await _jeeAccountCustomerService.UpdateCustomerAppGiaHanModel(model);
                if (reponse.IsSuccessStatusCode)
                {
                    cnn.EndTransaction();
                    return await Task.FromResult(new ReturnSqlModel());
                }
                else
                {
                    string returnValue = reponse.Content.ReadAsStringAsync().Result;
                    if (string.IsNullOrEmpty(returnValue)) returnValue = reponse.ReasonPhrase;
                    var res = new ReturnSqlModel(returnValue, reponse.StatusCode.ToString());
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(res);
                }
            }
        }

        public async Task<IEnumerable<CustomerAppDTO>> GetListCustomerAppByCustomerIDFromAccount(long CustomerID)
        {
            var reponse = await _jeeAccountCustomerService.GetListCustomerAppByCustomerIDFromAccount(CustomerID);
            if (reponse.IsSuccessStatusCode)
            {
                string returnValue = reponse.Content.ReadAsStringAsync().Result;
                var res = JsonConvert.DeserializeObject<IEnumerable<CustomerAppDTO>>(returnValue);
                return res;
            }
            else
            {
                return null;
            }
        }

        public async Task<ReturnSqlModel> UpdateCustomerAppAddNumberStaff(CustomerAppAddNumberStaffModel model)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                var reponse = await _jeeAccountCustomerService.UpdateCustomerAppAddNumberStaff(model);
                if (reponse.IsSuccessStatusCode)
                {
                    string returnValue = reponse.Content.ReadAsStringAsync().Result;
                    return await Task.FromResult(new ReturnSqlModel());
                }
                else
                {
                    string returnValue = reponse.Content.ReadAsStringAsync().Result;
                    var res = new ReturnSqlModel(returnValue, Constant.ERRORCODE);
                    return await Task.FromResult(res);
                }
            }
        }

        public async Task<HttpResponseMessage> UpdateCustomerResetPassword(CustomerResetPasswordModel model)
        {
            return await _jeeAccountCustomerService.ResetPasswordRootCustomer(model);
        }

        public async Task<HttpResponseMessage> UpdateUnLock(long customerid)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                cnn.BeginTransaction();
                UpdateLockUnLockCustomerCnn(cnn, customerid, 1);
                var reponse = await _jeeAccountCustomerService.UpdateUnLockCustomer(customerid);
                if (!reponse.IsSuccessStatusCode)
                {
                    cnn.RollbackTransaction();
                }
                cnn.EndTransaction();
                return reponse;
            }
        }

        private void UpdateLockUnLockCustomerCnn(DpsConnection cnn, long customerid, int Status)
        {
            Hashtable val = new Hashtable();
            val.Add("Status", Status);
            SqlConditions conds = new SqlConditions();
            conds.Add("RowID", customerid);
            int x = cnn.Update(val, conds, "CustomerList");
            if (x <= 0)
            {
                throw cnn.LastError;
            }
        }

        public async Task<HttpResponseMessage> UpdateLock(long customerid)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                cnn.BeginTransaction();
                UpdateLockUnLockCustomerCnn(cnn, customerid, 0);
                var reponse = await _jeeAccountCustomerService.UpdateLockCustomer(customerid);
                if (!reponse.IsSuccessStatusCode)
                {
                    cnn.RollbackTransaction();
                }
                cnn.EndTransaction();
                return reponse;
            }
        }

        public async Task<IEnumerable<Pakage>> GetPakageListApp()
        {
            DataTable dt = new DataTable();

            string sql = "select * from PackageList";

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new Pakage
                {
                    RowID = Int32.Parse(row["RowID"].ToString()),
                    AppID = Int32.Parse(row["AppID"].ToString()),
                    NumberOfDayLimit = (row["NumberOfDayLimit"] != DBNull.Value) ? Int32.Parse(row["NumberOfDayLimit"].ToString()) : -1,
                    LimitedNumberOfProfile = (row["LimitedNumberOfProfile"] != DBNull.Value) ? Int32.Parse(row["NumberOfDayLimit"].ToString()) : -1,
                    Title = row["Title"].ToString(),
                    Note = (row["Note"] != DBNull.Value) ? row["Note"].ToString() : ""
                });
            }
        }

        public async Task UpdateCustomerAddDeletAppModelCnn(CustomerAddDeletAppModel customer, string CreatedBy)
        {
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    cnn.BeginTransaction();

                    if (customer.CurrentDBID.Count == 0) throw new Exception("CurrentDBID không có dữ liệu");

                    _repository.UpdateCustomerAddDeletAppModelCnn(cnn, customer, CreatedBy);

                    var reponse = await _jeeAccountCustomerService.UpdateCustomerAddDeletAppModel(customer);
                    if (reponse.IsSuccessStatusCode)
                    {
                        cnn.EndTransaction();
                    }
                    else
                    {
                        string returnValue = reponse.Content.ReadAsStringAsync().Result;
                        cnn.RollbackTransaction();
                        cnn.EndTransaction();
                        throw new Exception(returnValue);
                    }
                }
                catch (Exception)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    throw;
                }
            }
        }
    }
}