using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JeeAccount.Classes
{
    [Serializable]
    public class KhongDuocXoaException : Exception
    {
        public KhongDuocXoaException() : base("")
        {
        }

        public KhongDuocXoaException(string message) : base(message)
        {
        }

        public KhongDuocXoaException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}