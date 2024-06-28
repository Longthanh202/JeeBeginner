using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace JeeBeginner.Models.Common
{
    public class BaseModel<T>
    {
        public BaseModel()
        {
            error = new ErrorModel();
        }

        //khởi tạo nhanh trả về lỗi
        public BaseModel(string errorMessage)
        {
            status = 0;
            error = new ErrorModel() { message = errorMessage, code = "9" };
        }

        public int status { get; set; }
        public T data { get; set; }
        public PageModel panigator { get; set; }
        public ErrorModel error { get; set; }
        public bool Visible { get; set; }
    }

    public class ErrorModel
    {
        public string message { get; set; }
        public string code { get; set; }
        public string LastError { get; set; }
    }

    public class ResultModel
    {
        public int status { get; set; }
        public object data { get; set; }
        public ErrorModel error { get; set; }
    }

    public class PageModel
    {
        public int Page { get; set; } = 1;
        public int AllPage { get; set; } = 0;
        public int Size { get; set; } = 10;
        public int TotalCount { get; set; } = 0;
        public int total { get; set; } = 0;
    }

    public class ErrorModelBTSC : ErrorModel
    {
        public string devmessage { get; set; } = "";
        public int status { get; set; } = 1;
    }

    public class CusErrorModel<T>
    {
        public string message { get; set; }
        public string code { get; set; }

        /// <summary>
        /// Thông báo lỗi code cho dev không cần debug
        /// </summary>
        public string devmessage { get; set; }

        public int status { get; set; } = 0;///bao loi
        public T data { get; set; }
    }

    public class QueryParams
    {
        public bool more { get; set; } = false;
        public int page { get; set; } = 1;
        public int record { get; set; } = 10;
        public string sortOrder { get; set; } = "";
        public string sortField { get; set; } = "";
        public FilterModel filter { get; set; }

        public QueryParams()
        {
            filter = new FilterModel();
        }
    }

    public class SortParams
    {
        [JsonPropertyName("column")]
        [JsonProperty("column")]
        public string ColumnName { get; set; }

        [JsonPropertyName("direction")]
        [JsonProperty("direction")]
        public string Direction { get; set; }
    }

    public class FilterModel
    {
        public string keys { get; set; }
        public string vals { get; set; }
        private Dictionary<string, string> _dic = new Dictionary<string, string>();

        public FilterModel()
        {
            keys = vals = "";
        }

        public FilterModel(string keys, string vals)
        {
            this.keys = keys;
            this.vals = vals;
            initDictionary();
        }

        private void initDictionary()
        {
            string[] arrKeys = keys.Split('|');
            if (vals is not null)
            {
                string[] arrVals = vals.Split('|');
                for (int i = 0; i < arrKeys.Length && i < arrVals.Length; i++)
                {
                    _dic.Add(arrKeys[i], arrVals[i]);
                }
            }
        }

        public string this[string key]
        {
            get
            {
                if (keys.Length > 0 && _dic.Count == 0)
                    initDictionary();
                if (_dic.ContainsKey(key))
                    return _dic[key];
                return null;
            }
        }
    }

    public class Panigator
    {
        [JsonPropertyName("total")]
        [JsonProperty("total")]
        public int TotalItems { get; set; }

        [JsonPropertyName("totalpage")]
        [JsonProperty("totalpage")]
        public int TotalPage { get; set; }

        [JsonPropertyName("page")]
        [JsonProperty("page")]
        public int PageIndex { get; set; }

        [JsonPropertyName("pageSize")]
        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonPropertyName("pageSizes")]
        [JsonProperty("pageSizes")]
        public List<int> PageSizes { get; set; }

        public Panigator()
        {
        }

        public Panigator(int p_PageIndex, int p_PageSize, int p_TotalRows)
        {
            PageIndex = p_PageIndex;
            PageSize = p_PageSize;
            TotalItems = p_TotalRows;
            TotalPage = int.Parse(Math.Ceiling((double)TotalItems / PageSize).ToString());
            PageSizes = Enumerable.Range(1, TotalPage).Select(x => x).ToList();
        }

        public class QueryRequestParams
        {
            [JsonPropertyName("filter")]//for derelize of NEWTON.JSON
            [JsonProperty("filter")]//for serilize of NEWTON.JSON
            public Dictionary<string, string> Filter { get; set; }

            [JsonPropertyName("paginator")]
            [JsonProperty("paginator")]
            public Panigator Panigator { get; set; }

            [JsonPropertyName("searchTerm")]
            [JsonProperty("searchTerm")]
            public string SearchValue { get; set; }

            [JsonPropertyName("sorting")]
            [JsonProperty("sorting")]
            public SortParams Sort { get; set; }
        }

        public class SortParams
        {
            [JsonPropertyName("column")]
            [JsonProperty("column")]
            public string ColumnName { get; set; }

            [JsonPropertyName("direction")]
            [JsonProperty("direction")]
            public string Direction { get; set; }
        }
    }

    public class ReturnSqlModel
    {
        public bool Susscess { get; set; }
        public string ErrorMessgage { get; set; }
        public string ErrorCode { get; set; }

        public ReturnSqlModel()
        {
            Susscess = true;
            ErrorMessgage = "";
            ErrorCode = "";
        }

        public ReturnSqlModel(string errorMessgage, string errorCode)
        {
            Susscess = false;
            ErrorMessgage = errorMessgage;
            ErrorCode = errorCode;
        }
    }
}