using DpsLibs.Data;
using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Classes;
using JeeBeginner.Models.AccountManagement;
using JeeBeginner.Models.AccountManagement.CustomerManagement;
using JeeBeginner.Models.Common;
using JeeBeginner.Models.CustomerManagement;
using JeeBeginner.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories.CustomerManagement
{
    public class CustomerManagementRepository : ICustomerManagementRepository
    {
        private readonly string _connectionString;
        public CustomerManagementRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        public async Task<List<string>> AppCodes(DpsConnection cnn, long CustomerID)
        {
            List<string> appcodes = new List<string>();
            DataTable dt = new DataTable();
            string sql = @"select AppCode from Customer_App
                            join AppList on Customer_App.AppID = AppList.AppID 
                            where CustomerID = @CustomerID";
            SqlConditions conds = new SqlConditions();
            conds.Add("CustomerID", CustomerID);
            dt = await cnn.CreateDataTableAsync(sql, conds);
            for (var index = 0; index < dt.Rows.Count; index++)
            {
                appcodes.Add(dt.Rows[index][0].ToString());
            }
            return appcodes;
        }
        public async Task<IEnumerable<CustomerModelDTO>> GetListCustomer(string whereSrt, string orderByStr)
        {
            DataTable dt = new DataTable();
            string sql = "";
            if (string.IsNullOrEmpty(whereSrt))
            {
                sql = $@"select * from CustomerList order by {orderByStr}";
            }
            else
            {
                sql = $@"select * from CustomerList where {whereSrt} order by {orderByStr}";
            }
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new CustomerModelDTO
                {
                    Address = row["Address"].ToString(),
                    Code = row["Code"].ToString(),
                    CompanyName = row["CompanyName"].ToString(),
                    Note = row["Note"].ToString(),
                    Phone = row["Phone"].ToString(),
                    RegisterDate = (row["RegisterDate"] != DBNull.Value) ? ((DateTime)row["RegisterDate"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                    RegisterName = row["RegisterName"].ToString(),
                    RowID = Int32.Parse(row["RowID"].ToString()),
                    Status = Int32.Parse(row["Status"].ToString()),
                    GiaHanDenNgay = (row["GiaHanDenNgay"] != DBNull.Value) ? ((DateTime)row["GiaHanDenNgay"]).ToString("dd/MM/yyyy") : "",
                });
            }
        }

        public async Task<IEnumerable<CustomerModelDTO>> GetListCustomerByIDs(List<string> Ids)
        {
            if (Ids == null || Ids.Count == 0)
            {
                throw new Exception("Id list can not be empty");
            }

            DataTable dt = new DataTable();
            string sql = "select * from CustomerList where ";
            string whereString = "";
            SqlConditions conds = new SqlConditions();
            for (int i = 0; i < Ids.Count; i++)
            {
                whereString += $" or RowID = @Id{i}";
                conds.Add($"Id{i}", Ids[i]);
            }
            sql += whereString.Substring(3);


            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql, conds);
                return dt.AsEnumerable().Select(row => new CustomerModelDTO
                {
                    Address = row["Address"].ToString(),
                    Code = row["Code"].ToString(),
                    CompanyName = row["CompanyName"].ToString(),
                    Note = row["Note"].ToString(),
                    Phone = row["Phone"].ToString(),
                    RegisterDate = (row["RegisterDate"] != DBNull.Value) ? ((DateTime)row["RegisterDate"]).ToString("dd/MM/yyyy HH:mm:ss") : "",
                    RegisterName = row["RegisterName"].ToString(),
                    RowID = Int32.Parse(row["RowID"].ToString()),
                    Status = Int32.Parse(row["Status"].ToString()),
                    GiaHanDenNgay = (row["GiaHanDenNgay"] != DBNull.Value) ? ((DateTime)row["GiaHanDenNgay"]).ToString("dd/MM/yyyy") : "",
                });
            }
        }

        public async Task<CustomerModelDTO> GetCustomerByCustomerID(long CustomerID)
        {
            DataTable dt = new DataTable();

            string sql = $@"select * from CustomerList where RowID = {CustomerID}";

            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new CustomerModelDTO
                {
                    Address = row["Address"].ToString(),
                    Code = row["Code"].ToString(),
                    CompanyName = row["CompanyName"].ToString(),
                    Note = row["Note"].ToString(),
                    Phone = row["Phone"].ToString(),
                    RegisterDate = (row["RegisterDate"] != DBNull.Value) ? ((DateTime)row["RegisterDate"]).ToString("dd/MM/yyyy") : "",
                    RegisterName = row["RegisterName"].ToString(),
                    RowID = Int32.Parse(row["RowID"].ToString()),
                    Status = Int32.Parse(row["Status"].ToString()),
                    GiaHanDenNgay = (row["GiaHanDenNgay"] != DBNull.Value) ? ((DateTime)row["GiaHanDenNgay"]).ToString("dd/MM/yyyy") : "",
                }).SingleOrDefault();
            }
        }

        public async Task<ReturnSqlModel> CreateCustomer(DpsConnection cnn, CustomerModel customerModel, int CreatedBy)
        {
            Hashtable val = new Hashtable();
            try
            {
                #region val data

                if (customerModel.RowID > 0)
                {
                    val.Add("RowID", customerModel.RowID);
                }
                val.Add("Code", customerModel.Code);
                val.Add("CompanyName", customerModel.CompanyName);
                val.Add("RegisterName", customerModel.RegisterName);
                val.Add("Address", customerModel.Address);
                val.Add("Phone", customerModel.Phone);
                val.Add("CreatedBy", CreatedBy);
                val.Add("Disable", 0);
                val.Add("CreatedDate", DateTime.UtcNow);

                if (!string.IsNullOrEmpty(customerModel.Note))
                {
                    val.Add("Note", customerModel.Note);
                }
                string username = customerModel.Username;
                val.Add("Gender", customerModel.Gender);
                val.Add("RegisterDate", DateTime.UtcNow);

                #endregion val data
                if (customerModel.RowID > 0)
                {
                    cnn.ExecuteNonQuery("SET IDENTITY_INSERT CustomerList ON");
                }
                int x = cnn.Insert(val, "CustomerList");
                if (customerModel.RowID > 0)
                {
                    cnn.ExecuteNonQuery("SET IDENTITY_INSERT CustomerList OFF");
                }
                if (x <= 0)
                {
                    return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION));
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
            }
            return await Task.FromResult(new ReturnSqlModel());
        }

        public async Task<ReturnSqlModel> CreateAppCode(DpsConnection cnn, CustomerModel customerModel, long CustomerID, string CreatedBy)
        {
            try
            {
                DateTime start = DateTime.ParseExact(customerModel.RegisterDate, "dd/MM/yyyy", null);
                for (var index = 0; index < customerModel.AppID.Count; index++)
                {
                    Hashtable val = new Hashtable();
                    val.Add("CustomerID", CustomerID);
                    val.Add("AppID", customerModel.AppID[index]);
                    val.Add("StartDate", start);
                    val.Add("CreatedDate", DateTime.UtcNow);
                    val.Add("CreatedBy", CreatedBy);
                    val.Add("Status", 1);
                    val.Add("IsDefaultApply", 1);
                    val.Add("PackageID", customerModel.GoiSuDung[index]);
                    val.Add("SoLuongNhanSu", customerModel.SoLuongNhanSu[index]);
                    if (!string.IsNullOrEmpty(customerModel.DeadlineDate))
                    {
                        DateTime end = DateTime.ParseExact(customerModel.DeadlineDate, "dd/MM/yyyy", null);
                        val.Add("EndDate", end);
                    }
                    int x = cnn.Insert(val, "Customer_App");
                    if (x <= 0)
                    {
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
            }
            return await Task.FromResult(new ReturnSqlModel());
        }

        public void UpdateCustomerAddDeletAppModelCnn(DpsConnection cnn, CustomerAddDeletAppModel customerModel, string CreatedBy)
        {
            try
            {
                AddCustomerAppNewCnn(cnn, customerModel, CreatedBy);
                DeleteCustomerAppNewCnn(cnn, customerModel);
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void AddCustomerAppNewCnn(DpsConnection cnn, CustomerAddDeletAppModel customerModel, string CreatedBy)
        {
            try
            {
                for (var index = 0; index < customerModel.LstAddAppID.Count; index++)
                {
                    string sql = $"select * from Customer_App where CustomerID = {customerModel.CustomerID} and AppID = {customerModel.LstAddAppID[index]}";

                    var dt = cnn.CreateDataTable(sql);
                    if (dt.Rows.Count > 0)
                    {
                        Hashtable val = new Hashtable();
                        val.Add("StartDate", DateTime.UtcNow);
                        val.Add("CreatedDate", DateTime.UtcNow);
                        val.Add("CreatedBy", CreatedBy);
                        val.Add("Status", 1);
                        val.Add("SoLuongNhanSu", customerModel.SoLuongNhanSu[index]);
                        val.Add("PackageID", customerModel.GoiSuDung[index]);
                        SqlConditions conds = new SqlConditions();
                        conds.Add("CustomerID", customerModel.CustomerID);
                        conds.Add("AppID", customerModel.LstAddAppID[index]);
                        if (!string.IsNullOrEmpty(customerModel.EndDate))
                        {
                            DateTime end = DateTime.ParseExact(customerModel.EndDate, "dd/MM/yyyy", null);
                            val.Add("EndDate", end);
                        }
                        int x = cnn.Update(val, conds, "Customer_App");
                        if (x <= 0)
                        {
                            throw cnn.LastError;
                        }
                    }
                    else
                    {
                        Hashtable val = new Hashtable();
                        val.Add("CustomerID", customerModel.CustomerID);
                        val.Add("AppID", customerModel.LstAddAppID[index]);
                        val.Add("StartDate", DateTime.UtcNow);
                        val.Add("CreatedDate", DateTime.UtcNow);
                        val.Add("CreatedBy", CreatedBy);
                        val.Add("Status", 1);
                        val.Add("IsDefaultApply", 1);
                        val.Add("PackageID", customerModel.GoiSuDung[index]);
                        val.Add("SoLuongNhanSu", customerModel.SoLuongNhanSu[index]);

                        if (!string.IsNullOrEmpty(customerModel.EndDate))
                        {
                            DateTime end = DateTime.ParseExact(customerModel.EndDate, "dd/MM/yyyy", null);
                            val.Add("EndDate", end);
                        }
                        int x = cnn.Insert(val, "Customer_App");
                        if (x <= 0)
                        {
                            throw cnn.LastError;
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void DeleteCustomerAppNewCnn(DpsConnection cnn, CustomerAddDeletAppModel customerModel)
        {
            try
            {
                for (var index = 0; index < customerModel.LstDeleteAppID.Count; index++)
                {
                    string sql = $"select * from Customer_App where CustomerID = {customerModel.CustomerID} and AppID = {customerModel.LstDeleteAppID[index]}";
                    var dt = cnn.CreateDataTable(sql);
                    if (dt.Rows.Count > 0)
                    {
                        SqlConditions conds = new SqlConditions();
                        conds.Add("CustomerID", customerModel.CustomerID);
                        conds.Add("AppID", customerModel.LstDeleteAppID[index]);
                        int x = cnn.Delete(conds, "Customer_App");
                        if (x <= 0)
                        {
                            throw cnn.LastError;
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public long GetlastCustomerID(DpsConnection cnn)
        {
            long customerID = -1;
            var rowid = cnn.ExecuteScalar("SELECT IDENT_CURRENT ('CustomerList') AS Current_Identity;");
            customerID = long.Parse(rowid.ToString());
            return customerID;
        }
        public async Task<CustomerModel> GetCurrentDBID(DpsConnection cnn, CustomerModel customerModel)
        {
            customerModel.CurrentDBID = new List<int>();
            for (var index = 0; index < customerModel.AppID.Count; index++)
            {
                DataTable dt = new DataTable();
                string sql = $"select CurrentDatabaseID from AppList where AppID = {customerModel.AppID[index]}";
                dt = await cnn.CreateDataTableAsync(sql);
                if (string.IsNullOrEmpty(dt.Rows[0][0].ToString()))
                {
                    customerModel.CurrentDBID.Add(-1);
                }
                else
                {
                    customerModel.CurrentDBID.Add(Int32.Parse(dt.Rows[0][0].ToString()));
                }
            }
            return customerModel;
        }
        public async Task<IEnumerable<AppListDTO>> GetListApp()
        {
            DataTable dt = new DataTable();

            string sql = @"select * from AppList";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new AppListDTO
                {
                    AppID = Int32.Parse(row["AppID"].ToString()),
                    APIUrl = row["APIUrl"].ToString(),
                    AppCode = row["AppCode"].ToString(),
                    AppName = row["AppName"].ToString(),
                    BackendURL = row["BackendURL"].ToString(),
                    CurrentVersion = row["CurrentVersion"].ToString(),
                    Description = row["Description"].ToString(),
                    LastUpdate = row["LastUpdate"].ToString(),
                    Note = row["Note"].ToString(),
                    ReleaseDate = row["ReleaseDate"].ToString(),
                    IsDefaultApp = false,
                });
            }
        }

        public async Task<List<string>> GetAllCustomerSapHetHan(int SoNgay)
        {
            DataTable dt = new DataTable();

            string sql = @"select CustomerID, EndDate from Customer_App where Status = 1";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                var data = dt.AsEnumerable().Select(row => new CustomerEndate
                {
                    CustomerID = row["CustomerID"].ToString(),
                    EndDate = row["EndDate"] != DBNull.Value ? (DateTime)row["EndDate"] : DateTime.MinValue,
                });
                var ListCustomerIDSapHetHan = new List<string>();
                foreach (var item in data)
                {
                    if (GeneralService.SapHetHanDateTime(item.EndDate, SoNgay))
                    {
                        if (!ListCustomerIDSapHetHan.Contains(item.CustomerID))
                            ListCustomerIDSapHetHan.Add(item.CustomerID);
                    }
                }
                return ListCustomerIDSapHetHan;
            }
        }

        public async Task<List<string>> GetAllCustomerHetHan()
        {
            DataTable dt = new DataTable();

            string sql = @"select  CustomerID, EndDate from Customer_App where Status = 1";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                var data = dt.AsEnumerable().Select(row => new CustomerEndate
                {
                    CustomerID = row["CustomerID"].ToString(),
                    EndDate = row["EndDate"] != DBNull.Value ? (DateTime)row["EndDate"] : DateTime.MinValue,
                });
                var ListCustomerIDHetHan = new List<string>();
                foreach (var item in data)
                {
                    if (GeneralService.HetHanDateTime(item.EndDate))
                    {
                        if (!ListCustomerIDHetHan.Contains(item.CustomerID))
                            ListCustomerIDHetHan.Add(item.CustomerID);
                    }
                }
                return ListCustomerIDHetHan;
            }
        }

        public async Task<IEnumerable<AppCustomerDTO>> GetDS_InfoAppByCustomerID(string whereSrt, string orderByStr)
        {
            DataTable dt = new DataTable();
            string sql = $@"select Customer_App.*, AppList.AppName 
                            from Customer_App
                            join AppList on Customer_App.AppID = AppList.AppID 
                            where {whereSrt} order by {orderByStr}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new AppCustomerDTO
                {
                    AppID = Int32.Parse(row["AppID"].ToString()),
                    CustomerID = Int32.Parse(row["CustomerID"].ToString()),
                    Status = Convert.ToBoolean(row["Status"]),
                    EndDate = (row["EndDate"] != DBNull.Value) ? ((DateTime)row["EndDate"]).ToString("dd/MM/yyyy") : "",
                    Note = (Convert.ToBoolean(row["Status"])) ? row["NoteActive"].ToString() : row["NoteInActive"].ToString(),
                    AppName = row["AppName"].ToString(),
                });
            }
        }

        public async Task<ReturnSqlModel> UpdateStatus(CustomerAppStatusModel model)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                try
                {
                    conds.Add("CustomerID", model.CustomerID);
                    conds.Add("AppID", model.AppID);
                    if (model.Status)
                    {
                        val.Add("Status", 0);
                        val.Add("NoteInActive", model.Note);
                        val.Add("NoteActive", DBNull.Value);
                    }
                    else
                    {
                        val.Add("Status", 1);
                        val.Add("NoteActive", model.Note);
                        val.Add("NoteInActive", DBNull.Value);
                    }
                    int x = cnn.Update(val, conds, "Customer_App");
                    if (x <= 0)
                    {
                        return await Task.FromResult(new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL));
                    }
                }
                catch (Exception ex)
                {
                    cnn.RollbackTransaction();
                    cnn.EndTransaction();
                    return await Task.FromResult(new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION));
                }
            }
            return await Task.FromResult(new ReturnSqlModel());
        }

        public async Task<string> GetNoteLock(long CustomerID, long AppID)
        {
            DataTable dt = new DataTable();
            SqlConditions conds = new SqlConditions();
            conds.Add("CustomerID", CustomerID);
            conds.Add("AppID", AppID);

            string result = "";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                string sql = "select NoteInActive, NoteActive, Status from Customer_App where CustomerID = @CustomerID and AppID = @AppID";
                dt = await cnn.CreateDataTableAsync(sql, conds);
                bool isLock = Convert.ToBoolean(dt.Rows[0]["Status"]);
                if (isLock)
                {
                    result = dt.Rows[0]["NoteActive"].ToString();
                }
                else
                {
                    result = dt.Rows[0]["NoteInActive"].ToString();
                }
                return await Task.FromResult(result);
            }
        }
        public async Task<IEnumerable<AppCustomerDTO>> GetInfoAppByCustomerID(long CustomerID)
        {
            DataTable dt = new DataTable();

            string sql = $@"select Customer_App.*, AppList.AppName, PackageList.AppID
                            , PackageList.Title from Customer_App
                            join AppList on Customer_App.AppID = AppList.AppID
                            join PackageList on PackageList.RowID = Customer_App.PackageID
                            where CustomerID = {CustomerID}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new AppCustomerDTO
                {
                    AppID = Int32.Parse(row["AppID"].ToString()),
                    CustomerID = Int32.Parse(row["CustomerID"].ToString()),
                    Status = Convert.ToBoolean(row["Status"]),
                    EndDate = (row["EndDate"] != DBNull.Value) ? ((DateTime)row["EndDate"]).ToString("dd/MM/yyyy") : "",
                    Note = (Convert.ToBoolean(row["Status"])) ? row["NoteActive"].ToString() : row["NoteInActive"].ToString(),
                    AppName = row["AppName"].ToString(),
                    PakageTitle = row["Title"].ToString(),
                });
            }
        }
        public async Task<ReturnSqlModel> UpdateCustomerAppGiaHanModelCnn(CustomerAppGiaHanModel model, DpsConnection cnn)
        {
            var updateCustomer = this.UpdateGiaHanCustomer(model.CustomerID, model.EndDate, cnn);
            if (!updateCustomer.Susscess) return await Task.FromResult(updateCustomer);
            foreach (var app in model.LstAppCustomerID)
            {
                var updateApp = this.UpdateEndDateAppByCustomerIDAppID(model.CustomerID, app, model.EndDate, cnn);
                if (!updateApp.Susscess) return await Task.FromResult(updateApp);
            }
            return await Task.FromResult(updateCustomer);
        }

        private ReturnSqlModel UpdateEndDateAppByCustomerIDAppID(long CustomerID, long AppID, string EndDate, DpsConnection cnn)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            try
            {
                DateTime date = DateTime.ParseExact(EndDate, "dd/MM/yyyy", null);
                conds.Add("CustomerID", CustomerID);
                conds.Add("AppID", AppID);
                val.Add("EndDate", date);
                int x = cnn.Update(val, conds, "Customer_App");
                if (x <= 0)
                {
                    return new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL);
                }
                return new ReturnSqlModel();
            }
            catch (Exception ex)
            {
                return new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION);
            }
        }
        private ReturnSqlModel UpdateGiaHanCustomer(long CustomerID, string EndDate, DpsConnection cnn)
        {
            Hashtable val = new Hashtable();
            SqlConditions conds = new SqlConditions();
            try
            {
                DateTime date = DateTime.ParseExact(EndDate, "dd/MM/yyyy", null);
                conds.Add("RowID", CustomerID);
                val.Add("GiaHanDenNgay", date);
                int x = cnn.Update(val, conds, "CustomerList");
                if (x <= 0)
                {
                    return new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_SQL);
                }
                return new ReturnSqlModel();
            }
            catch (Exception ex)
            {
                return new ReturnSqlModel(ex.Message, Constant.ERRORCODE_EXCEPTION);
            }
        }
        public async Task<List<int>> GetListCurrentDBID(DpsConnection cnn, List<int> LstAddAppID)
        {
            var lst = new List<int>();
            for (var index = 0; index < LstAddAppID.Count; index++)
            {
                DataTable dt = new DataTable();
                string sql = $"select CurrentDatabaseID from AppList where AppID = {LstAddAppID[index]}";
                dt = await cnn.CreateDataTableAsync(sql);

                if (string.IsNullOrEmpty(dt.Rows[0][0].ToString()))
                {
                    lst.Add(-1);
                }
                else
                {
                    lst.Add(Int32.Parse(dt.Rows[0][0].ToString()));
                }
            }

            return lst;
        }
    }
}