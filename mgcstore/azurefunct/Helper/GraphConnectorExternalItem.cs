using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace azurefunct.Helper
{
    // GraphConnectorExternalItem myDeserializedClass = JsonConvert.DeserializeObject<GraphConnectorExternalItem>(myJsonResponse); 

    public class GraphConnectorExternalItem
    {
        [JsonProperty("@odata.type")]
        public string OdataType { get; set; }
        public List<Acl> acl { get; set; }
        public Properties properties { get; set; }
        public Content content { get; set; }
    }
    public class Acl
    {
        public string type { get; set; }
        public string value { get; set; }
        public string accessType { get; set; }
        public string identitySource { get; set; }
    }

    public class Properties
    {
        public string id { get; set; }

        [JsonProperty("title@odata.type")]
        public string TitleOdataType { get; set; }
        public string title { get; set; }
        public string thumbnailUrl { get; set; }
        public string company { get; set; }
        public string category { get; set; }
        public string description { get; set; }
        public string price { get; set; }
        public string url { get; set; }
    }

    public class Content
    {
        public string value { get; set; }
        public string type { get; set; }
    }

}
