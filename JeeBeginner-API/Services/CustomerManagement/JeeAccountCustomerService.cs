using DPSinfra.Utils;
using JeeAccount.Models.CustomerManagement;
using JeeBeginner.Models.CustomerManagement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace JeeBeginner.Services.CustomerManagement
{
    public class JeeAccountCustomerService
    {
        private readonly string URL_JEEACC_CUSTOMER;
        private readonly string URL_JEEACC_CUSTOMER_API;
        private readonly string URL_JEEACC_ACCOUNT_API;
        private readonly string URL_JEEACC_DATABASE_API;
        private readonly IConfiguration _configuration;
        private readonly string _secrectkey;

        public JeeAccountCustomerService(IConfiguration configuration)
        {
            _configuration = configuration;
            URL_JEEACC_CUSTOMER = configuration.GetValue<string>("JeeAccount:API");
            URL_JEEACC_CUSTOMER_API = URL_JEEACC_CUSTOMER + "api/customermanagement";
            URL_JEEACC_ACCOUNT_API = URL_JEEACC_CUSTOMER + "api/accountmanagement";
            URL_JEEACC_DATABASE_API = URL_JEEACC_CUSTOMER + "api/databasemanagement";
            _secrectkey = configuration.GetValue<string>("secrectkey:JeeAccount");
        }

        public async Task<HttpResponseMessage> CreateCustomer(CustomerModel customerModel, bool isImport)
        {
            string url = URL_JEEACC_CUSTOMER_API + $"/CreateCustomer/{isImport}";
            var content = customerModel;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.PostAsync(url, httpContent);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateCustomerAppGiaHanModel(CustomerAppGiaHanModel model)
        {
            string url = URL_JEEACC_CUSTOMER_API + "/UpdateCustomerAppGiaHanModel";
            var content = model;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.PostAsync(url, httpContent);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateCustomerAppGiaHanModel(long model)
        {
            string url = URL_JEEACC_CUSTOMER_API + "/UpdateCustomerAppGiaHanModel";
            var content = model;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.PostAsync(url, httpContent);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> GetListCustomerAppByCustomerIDFromAccount(long CustomerID)
        {
            string url = URL_JEEACC_ACCOUNT_API + $"/GetListCustomerAppByCustomerIDFromCustomer?CustomerID={CustomerID}";

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.GetAsync(url);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> GetListDBFromAccount()
        {
            string url = URL_JEEACC_DATABASE_API + $"/GetDSDataList";

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.GetAsync(url);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateCustomerAppAddNumberStaff(CustomerAppAddNumberStaffModel model)
        {
            string url = URL_JEEACC_CUSTOMER_API + "/UpdateCustomerAppAddNumberStaff";
            var content = model;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await client.PostAsync(url, httpContent);
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> ResetPasswordRootCustomer(CustomerResetPasswordModel model)
        {
            string url = URL_JEEACC_ACCOUNT_API + "/ResetPasswordRootCustomer";
            var content = model;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await Task.Run(() => client.PostAsync(url, httpContent));
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateUnLockCustomer(long customerid)
        {
            bool state = false;
            string url = URL_JEEACC_CUSTOMER_API + $"/LockUnLockCustomer/{customerid}/{state}";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await Task.Run(() => client.GetAsync(url));
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateLockCustomer(long customerid)
        {
            bool state = true;
            string url = URL_JEEACC_CUSTOMER_API + $"/LockUnLockCustomer/{customerid}/{state}";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);

                var reponse = await Task.Run(() => client.GetAsync(url));
                return reponse;
            }
        }

        public async Task<HttpResponseMessage> UpdateCustomerAddDeletAppModel(CustomerAddDeletAppModel model)
        {
            string url = URL_JEEACC_CUSTOMER_API + $"/UpdateCustomerAddDeletAppModel";
            var content = model;
            var stringContent = await Task.Run(() => JsonConvert.SerializeObject(content));
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(_secrectkey);
                var reponse = await client.PostAsync(url, httpContent);
                return reponse;
            }
        }
    }
}