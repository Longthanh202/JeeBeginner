using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeAccount.Classes
{
    [Serializable]
    public class TrungDuLieuExceoption : Exception
    {
        public TrungDuLieuExceoption() : base("")
        {
        }

        public TrungDuLieuExceoption(string message) : base(message)
        {
        }

        public TrungDuLieuExceoption(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}