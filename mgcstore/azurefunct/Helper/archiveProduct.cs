using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace azurefunct.Helper
{
    public class archiveProduct : Product
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
    }
}
