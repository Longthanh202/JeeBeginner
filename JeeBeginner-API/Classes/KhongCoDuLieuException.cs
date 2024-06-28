using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeAccount.Classes
{
    [Serializable]
    public class KhongCoDuLieuException : Exception
    {
        public KhongCoDuLieuException() : base("")
        {
        }

        public KhongCoDuLieuException(string message) : base(message)
        {
        }

        public KhongCoDuLieuException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}