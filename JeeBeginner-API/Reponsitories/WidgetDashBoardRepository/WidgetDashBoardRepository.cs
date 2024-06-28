using DpsLibs.Data;
using JeeBeginner.Classes;
using JeeBeginner.Models;
using JeeBeginner.Models.Common;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace JeeBeginner.Reponsitories
{
    public class WidgetDashBoardRepository : IWidgetDashBoardRepository
    {
        private readonly string _connectionString;

        public WidgetDashBoardRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Widget>> GetAll()
        {
            DataTable dt = new DataTable();
            string sql = "select * from Widget_Dashboard";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);

                return dt.AsEnumerable().Select(row => new Widget
                {
                    cols = Convert.ToInt32(row["Cols"]),
                    componentName = row["ComponentName"].ToString(),
                    id = Convert.ToInt32(row["Id"]),
                    name = row["Name"].ToString(),
                    rows = Convert.ToInt32(row["Rows"]),
                    x = Convert.ToInt32(row["x"]),
                    y = Convert.ToInt32(row["y"])
                });
            }
        }

        public async Task<WidgetDashBoardModel> GetByID(long ID_NV, long WidgetId)
        {
            DataTable dt = new DataTable();
            string sql = $"select * from Widget_Dashboard where Id_nv = {ID_NV} and id = {WidgetId}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                return dt.AsEnumerable().Select(row => new WidgetDashBoardModel
                {
                    Id_row = Convert.ToInt32(row["Id_row"]),
                    Cols = Convert.ToInt32(row["Cols"]),
                    ComponentName = row["ComponentName"].ToString(),
                    Id = Convert.ToInt32(row["Id"]),
                    Id_nv = Convert.ToInt32(row["Id_nv"]),
                    Name = row["Name"].ToString(),
                    Rows = Convert.ToInt32(row["Rows"]),
                    x = Convert.ToInt32(row["x"]),
                    y = Convert.ToInt32(row["y"])
                }).SingleOrDefault();
            }
        }

        public async Task<ReturnSqlModel> Create(WidgetDashBoardModel widget)
        {
            Hashtable val = new Hashtable();
            DataTable dt = new DataTable();
            ReturnSqlModel returnSql = new ReturnSqlModel();
            string sql = $"select Id_nv from Widget_Dashboard where Id_nv = {widget.Id_nv} and id = {widget.Id}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                dt = await cnn.CreateDataTableAsync(sql);
                if (dt.Rows.Count == 0)
                {
                    val.Add("Id_nv", 0);
                    val.Add("Id", widget.Id);
                    val.Add("Name", widget.Name);
                    val.Add("x", widget.x);
                    val.Add("y", widget.y);
                    val.Add("Cols", widget.Cols);
                    val.Add("Rows", widget.Rows);
                    val.Add("ComponentName", widget.ComponentName);
                    int x = cnn.Insert(val, "Widget_Dashboard");
                    if (x <= 0)
                    {
                        return new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION);
                    }
                }
                else
                {
                    return new ReturnSqlModel("Widget đã tồn tại", Constant.ERRORCODE_EXIST);
                }
            }
            return new ReturnSqlModel();
        }

        public async Task<ReturnSqlModel> Update(WidgetDashBoardModel widget)
        {
            Hashtable val = new Hashtable();
            SqlConditions Conds = new SqlConditions();
            string sql = $"select Id_nv from Widget_Dashboard where Id_nv = {widget.Id_nv} and id = {widget.Id}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                DataTable dt = await cnn.CreateDataTableAsync(sql);
                if (dt.Rows.Count == 0)
                {
                    return new ReturnSqlModel("Widget không tồn tại", Constant.ERRORCODE_NOTEXIST);
                }
                Conds.Add("Id_nv", 0);
                Conds.Add("Id", widget.Id);
                val.Add("Name", widget.Name);
                val.Add("x", widget.x);
                val.Add("y", widget.y);
                val.Add("Cols", widget.Cols);
                val.Add("Rows", widget.Rows);
                int x = cnn.Update(val, Conds, "Widget_Dashboard");
                if (x <= 0)
                {
                    return new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION);
                }
            }
            return new ReturnSqlModel();
        }

        public async Task<ReturnSqlModel> Delete(long ID_NV, long WidgetId)
        {
            SqlConditions Conds = new SqlConditions();
            string sql = $"select Id_nv from Widget_Dashboard where Id_nv = {ID_NV} and id = {WidgetId}";
            using (DpsConnection cnn = new DpsConnection(_connectionString))
            {
                DataTable dt = await cnn.CreateDataTableAsync(sql);
                if (dt.Rows.Count == 0)
                {
                    return new ReturnSqlModel("Widget không tồn tại", Constant.ERRORCODE_NOTEXIST);
                }
                Conds.Add("Id_nv", 0);
                Conds.Add("Id", WidgetId);
                int x = cnn.Delete(Conds, "Widget_Dashboard");
                if (x <= 0)
                {
                    return new ReturnSqlModel(cnn.LastError.ToString(), Constant.ERRORCODE_EXCEPTION);
                }
            }

            return new ReturnSqlModel();
        }
    }
}